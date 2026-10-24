import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Delete, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAppText } from '@/lib/app-copy';
import { BACKGROUND_LOCK_MS, shouldLock, unlockVault, vaultConfigured } from '@/lib/device-vault';
import { useAppAuth } from './AuthProvider';

type VaultContextValue = { owner: string; key: CryptoKey | null; ready: boolean; configured: boolean; revision: number; ensureKey: () => Promise<CryptoKey>; lock: () => void; changed: () => void };
const VaultContext = createContext<VaultContextValue | null>(null);
export function VaultProvider({ children }: { children: ReactNode }) {
  const { user } = useAppAuth();
  const owner = user?.id ?? 'guest';
  const text = useAppText();
  const [keyState, setKeyState] = useState<{ owner: string; key: CryptoKey } | null>(null);
  const key = keyState?.owner === owner ? keyState.key : null;
  const [configured, setConfigured] = useState(false), [ready, setReady] = useState(false), [revision, setRevision] = useState(0);
  const [open, setOpen] = useState(false), [pin, setPin] = useState(''), [firstPin, setFirstPin] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const pending = useRef<Array<{ resolve: (key: CryptoKey) => void; reject: (error: Error) => void }>>([]);
  const lock = () => { setKeyState(null); setRevision(n => n + 1); };
  useEffect(() => {
    let active = true;
    setReady(false); setKeyState(null);
    void vaultConfigured(owner).then(value => { if (active) { setConfigured(value); setReady(true); } }).catch(() => { if (active) { setConfigured(false); setReady(true); } });
    return () => { active = false; pending.current.splice(0).forEach(p => p.reject(new Error('Vault closed.'))); };
  }, [owner]);
  useEffect(() => {
    let hiddenAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const visibility = () => {
      if (document.hidden) { hiddenAt = Date.now(); timer = setTimeout(lock, BACKGROUND_LOCK_MS); }
      else { if (hiddenAt && shouldLock(hiddenAt, Date.now())) lock(); clearTimeout(timer); hiddenAt = 0; }
    };
    document.addEventListener('visibilitychange', visibility);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  function close() { setOpen(false); setPin(''); setFirstPin(''); pending.current.splice(0).forEach(p => p.reject(new Error('PIN entry cancelled. Nothing was saved.'))); }
  function ensureKey() {
    if (key) return Promise.resolve(key);
    setPin(''); setFirstPin(''); setError(''); setOpen(true);
    return new Promise<CryptoKey>((resolve, reject) => pending.current.push({ resolve, reject }));
  }
  async function submit() {
    if (!configured && !firstPin) { setFirstPin(pin); setPin(''); return; }
    setBusy(true); setError('');
    try {
      const unlocked = await unlockVault(owner, configured ? pin : firstPin, configured ? undefined : pin);
      setKeyState({ owner, key: unlocked }); setConfigured(true); setOpen(false); setPin(''); setFirstPin('');
      pending.current.splice(0).forEach(p => p.resolve(unlocked));
    } catch (e) { setError(e instanceof Error ? e.message : text('Could not unlock.', 'Imeshindikana kufungua.')); setPin(''); if (!configured) setFirstPin(''); }
    finally { setBusy(false); }
  }
  return <VaultContext.Provider value={{ owner, key, ready, configured, revision, ensureKey, lock, changed: () => setRevision(n => n + 1) }}>{children}<Dialog open={open} onOpenChange={value => { if (!value) close(); }}><DialogContent className="max-w-sm"><DialogTitle className="flex items-center gap-2"><LockKeyhole />{text(configured ? 'Unlock your private space' : firstPin ? 'Confirm your PIN' : 'Create a six-digit PIN', configured ? 'Fungua nafasi yako binafsi' : firstPin ? 'Thibitisha PIN' : 'Unda PIN ya tarakimu sita')}</DialogTitle><DialogDescription>{text('Device records are encrypted. If you forget your PIN, local data cannot be recovered.', 'Kumbukumbu za kifaa zimesimbwa. Ukisahau PIN, data ya kifaa haiwezi kurejeshwa.')}</DialogDescription><div className="flex justify-center gap-3 py-4" aria-label={`${pin.length} / 6`} role="status">{Array.from({ length: 6 }, (_, i) => <span key={i} className={`h-4 w-4 rounded-full border-2 border-primary ${i < pin.length ? 'bg-primary' : 'bg-background'}`} />)}</div><input type="password" inputMode="numeric" autoComplete="off" aria-label={text('Six-digit PIN', 'PIN ya tarakimu sita')} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} className="sr-only" /><div className="grid grid-cols-3 gap-2">{['1','2','3','4','5','6','7','8','9','', '0', 'back'].map((digit, i) => digit ? <Button key={digit} variant="outline" className="h-12" disabled={busy} aria-label={digit === 'back' ? text('Backspace', 'Futa tarakimu') : digit} onClick={() => setPin(old => digit === 'back' ? old.slice(0, -1) : (old + digit).slice(0, 6))}>{digit === 'back' ? <Delete /> : digit}</Button> : <span key={i} />)}</div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button disabled={busy || pin.length !== 6} onClick={submit}>{text(busy ? 'Please wait…' : !configured && !firstPin ? 'Continue' : 'Unlock', busy ? 'Subiri…' : !configured && !firstPin ? 'Endelea' : 'Fungua')}</Button></DialogContent></Dialog></VaultContext.Provider>;
}
export function useVault() { const value = useContext(VaultContext); if (!value) throw new Error('VaultProvider is required'); return value; }