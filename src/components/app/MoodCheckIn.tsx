import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { CHECK_IN_TITLE } from '@/lib/device-vault';
import { moods } from '@/lib/moods';
import { MoodPicker } from './MoodPicker';
import { usePrivateRecords } from './usePrivateRecords';

export function MoodCheckIn({ history = false }: { history?: boolean }) {
  const text = useAppText(); const records = usePrivateRecords('journal');
  const [changing, setChanging] = useState(false), [thanks, setThanks] = useState(''), [busy, setBusy] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const checks = records.rows.filter(r => r.title === CHECK_IN_TITLE).sort((a,b) => b.record_date.localeCompare(a.record_date));
  const current = checks.find(r => r.record_date === today);
  const moodName = (id: string) => { const found = moods.find(m => m[0] === id); return found ? `${found[1]} ${text(found[2],found[3])}` : id; };
  async function select(mood: string) {
    setBusy(true);
    try {
      await records.saveOne({ kind: 'journal', record_date: today, title: CHECK_IN_TITLE, details: { mood, notes: '' } });
      setThanks(mood); setChanging(false); toast.success(text(records.user ? 'Saved privately' : 'Saved on this device', records.user ? 'Imehifadhiwa kwa faragha' : 'Imehifadhiwa kwenye kifaa hiki'));
    } catch (e) { toast.error(e instanceof Error ? e.message : text('Not saved. Try again.','Haijahifadhiwa. Jaribu tena.')); }
    finally { setBusy(false); }
  }
  return <section className="my-5 min-w-0">{records.vault.configured && !records.unlocked ? <Button variant="outline" onClick={() => { void records.vault.ensureKey().catch(() => undefined); }}>{text('Unlock check-ins','Fungua kumbukumbu za hisia')}</Button> : current && !changing ? <div className="flex flex-wrap items-center gap-3"><p>{text('Today','Leo')}: <strong>{moodName(String(current.details['mood'] ?? ''))}</strong></p><Button variant="outline" onClick={() => setChanging(true)}>{text('Change','Badilisha')}</Button></div> : <MoodPicker value={thanks} disabled={busy || !records.canSave} onChange={select} />}{!records.canSave && <Button asChild variant="link"><Link to="/app/profile">{text('Complete your adult profile to save','Kamilisha wasifu wa mtu mzima kuhifadhi')}</Link></Button>}{thanks && <div className="mt-4 rounded-lg border bg-mint p-4"><h2 className="font-bold">{text('Thanks for checking in','Asante kwa kushiriki hisia')}</h2><div className="mt-3 flex gap-3"><Button asChild variant="outline"><Link to="/app/journal" search={{ mood: thanks }}>{text('Add a note','Ongeza maelezo')}</Link></Button><Button variant="ghost" onClick={() => setThanks('')}>{text('Done','Imekamilika')}</Button></div></div>}{history && <div className="mt-8 divide-y">{checks.length ? checks.map(r => <div key={r.id} className="flex justify-between py-4"><span>{r.record_date}</span><strong>{moodName(String(r.details['mood'] ?? ''))}</strong></div>) : <p className="text-muted-foreground">{text('No check-ins yet.','Bado hakuna kumbukumbu za hisia.')}</p>}</div>}{records.error && <Button variant="outline" onClick={records.retry}>{text('Could not load. Retry','Haijapakiwa. Jaribu tena')}</Button>}</section>;
}