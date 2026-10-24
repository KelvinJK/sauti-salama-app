import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { listRecords, saveRecord, deleteRecord, readProfile } from '@/lib/app.functions';
import { recordSchema, type RecordKind } from '@/lib/app-model';
import { makeDeviceRecord, mutateDeviceRecords, readDeviceRecords, PRIVATE_LOAD_TIMEOUT_MS, type DeviceRecord } from '@/lib/device-vault';
import { useAppAuth } from './AuthProvider';
import { useVault } from './VaultProvider';

async function timed<T>(operation: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try { return await Promise.race([operation, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Loading timed out. Please retry.')), PRIVATE_LOAD_TIMEOUT_MS); })]); }
  finally { clearTimeout(timer); }
}
export function usePrivateRecords(kind: RecordKind) {
  const { user } = useAppAuth(); const vault = useVault();
  const fetchProfile = useServerFn(readProfile), fetchRecords = useServerFn(listRecords), save = useServerFn(saveRecord), remove = useServerFn(deleteRecord);
  const profile = useQuery({ queryKey: ['profile', user?.id], queryFn: () => timed(fetchProfile()), enabled: !!user, retry: false });
  const registered = !!profile.data?.birth_date && !!profile.data?.terms_accepted_at;
  const needsPin = !user || kind === 'journal' || kind === 'growth' || kind === 'child';
  const unlocked = !needsPin || !!vault.key;
  const cloud = useQuery({ queryKey: ['records', user?.id, kind], queryFn: () => timed(fetchRecords({ data: { kind } })), enabled: !!user && registered && unlocked, retry: false });
  const [local, setLocal] = useState<{ key: CryptoKey; rows: DeviceRecord[] } | null>(null);
  const [localError, setLocalError] = useState('');
  useEffect(() => {
    let active = true; setLocal(null); setLocalError('');
    if (!user && vault.key) {
      const key = vault.key;
      void readDeviceRecords(vault.owner, key).then(rows => { if (active) setLocal({ key, rows }); }).catch(() => { if (active) setLocalError('Device records could not load.'); });
    }
    return () => { active = false; };
  }, [user, vault.key, vault.owner, vault.revision]);
  const rows: DeviceRecord[] = !unlocked ? [] : user ? (cloud.data ?? []) as DeviceRecord[] : local?.key === vault.key ? local.rows.filter(r => r.kind === kind) : [];
  async function saveOne(input: unknown) {
    const key = needsPin ? await vault.ensureKey() : null;
    if (user) { if (!registered) throw new Error('Complete adult registration first.'); await save({ data: recordSchema.parse(input) }); await cloud.refetch(); }
    else {
      if (!key) throw new Error('Unlock your device first.');
      const row = makeDeviceRecord(input);
      await mutateDeviceRecords(vault.owner, key, rows => [row, ...rows]); vault.changed();
    }
  }
  async function deleteOne(id: string) {
    if (user) { await remove({ data: { id } }); await cloud.refetch(); }
    else { const key = await vault.ensureKey(); await mutateDeviceRecords(vault.owner, key, rows => rows.filter(r => r.id !== id)); vault.changed(); }
  }
  return { user, vault, registered, needsPin, unlocked, rows, saveOne, deleteOne, loading: !!user && (profile.isFetching || (registered && unlocked && cloud.isFetching)), error: profile.isError || cloud.isError || !!localError, retry: () => { void profile.refetch(); if (registered && unlocked) void cloud.refetch(); vault.changed(); }, canSave: !user || registered };
}