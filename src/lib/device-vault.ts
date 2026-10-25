import { recordSchema, type RecordKind } from './app-model';

export const PIN_LENGTH = 6;
export const MAX_PIN_ATTEMPTS = 5;
export const PIN_WAIT_MS = 30_000;
export const BACKGROUND_LOCK_MS = 5 * 60_000;
export const PRIVATE_LOAD_TIMEOUT_MS = 5_000;
export const EMERGENCY_NUMBER = '112';
export const CHECK_IN_TITLE = 'Daily mood check-in';
export type DeviceRecord = { id: string; kind: RecordKind; record_date: string; title: string; details: Record<string, unknown>; created_at?: string };
type Cipher = { iv: Uint8Array; ciphertext: ArrayBuffer };
type VaultMeta = { salt: Uint8Array; verifier: Cipher; attempts: number; retryAt: number };

export function validPin(pin: string) { return /^\d{6}$/.test(pin); }
export function attemptState(attempts: number, now: number) {
  const next = attempts + 1;
  return { attempts: next >= MAX_PIN_ATTEMPTS ? 0 : next, retryAt: next >= MAX_PIN_ATTEMPTS ? now + PIN_WAIT_MS : 0 };
}
export function shouldLock(hiddenAt: number, now: number) { return now - hiddenAt >= BACKGROUND_LOCK_MS; }
export async function deriveKey(pin: string, salt: Uint8Array) {
  if (!validPin(pin)) throw new Error('Use six digits.');
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: new Uint8Array(salt), iterations: 310_000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
export async function encrypt(key: CryptoKey, value: unknown): Promise<Cipher> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return { iv, ciphertext: await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(value))) };
}
export async function decrypt<T>(key: CryptoKey, value: Cipher): Promise<T> {
  return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(value.iv) }, key, value.ciphertext))) as T;
}
async function db() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('sautisalama-private-vault', 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('vault'); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Device storage is unavailable. Nothing was saved.'));
  });
}
async function storage<T>(key: string, write?: { value: T }): Promise<T | undefined> {
  const database = await db();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction('vault', write ? 'readwrite' : 'readonly');
      const store = transaction.objectStore('vault');
      const request = write ? store.put(write.value, key) : store.get(key);
      transaction.oncomplete = () => resolve(write ? write.value : request.result);
      transaction.onerror = () => reject(new Error('Device storage failed. Nothing was saved.'));
      transaction.onabort = () => reject(new Error('Device storage failed. Nothing was saved.'));
    });
  } finally { database.close(); }
}
export async function vaultConfigured(owner: string) { return !!(await storage<VaultMeta>(`${owner}:meta`)); }
export async function unlockVault(owner: string, pin: string, confirm?: string) {
  let meta = await storage<VaultMeta>(`${owner}:meta`);
  if (!meta) {
    if (pin !== confirm || !validPin(pin)) throw new Error('The six-digit PINs must match.');
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(pin, salt);
    meta = { salt, verifier: await encrypt(key, VAULT_VERIFIER), attempts: 0, retryAt: 0 };
    await storage(`${owner}:meta`, { value: meta });
    return key;
  }
  if (Date.now() < meta.retryAt) throw new Error(`Wait ${Math.ceil((meta.retryAt - Date.now()) / 1000)} seconds before trying again.`);
  const key = await deriveKey(pin, meta.salt);
  try {
    if (await decrypt(key, meta.verifier) !== VAULT_VERIFIER) throw new Error('Incorrect PIN');
  } catch {
    const next = attemptState(meta.attempts, Date.now());
    await storage(`${owner}:meta`, { value: { ...meta, ...next } });
    throw new Error(next.retryAt ? 'Too many attempts. Wait 30 seconds.' : 'Incorrect PIN. Try again.');
  }
  await storage(`${owner}:meta`, { value: { ...meta, attempts: 0, retryAt: 0 } });
  return key;
}
export async function readDeviceRecords(owner: string, key: CryptoKey): Promise<DeviceRecord[]> {
  const cipher = await storage<Cipher>(`${owner}:records`);
  return cipher ? decrypt<DeviceRecord[]>(key, cipher) : [];
}
// Serialize writes so two rapid check-ins cannot overwrite a journal save.
let writes: Promise<unknown> = Promise.resolve();
export function mutateDeviceRecords(owner: string, key: CryptoKey, transform: (rows: DeviceRecord[]) => DeviceRecord[]) {
  const task = writes.catch(() => undefined).then(async () => {
    const rows = transform(await readDeviceRecords(owner, key));
    await storage(`${owner}:records`, { value: await encrypt(key, rows) });
    return rows;
  });
  writes = task;
  return task;
}
export function makeDeviceRecord(input: unknown): DeviceRecord {
  return { ...recordSchema.parse(input), id: crypto.randomUUID(), created_at: new Date().toISOString() };
}
// Optional fingerprint/face unlock. The PIN stays required: it is wrapped with a key derived from the
// authenticator's PRF output, so nothing usable is stored unless the device can derive that secret.
type BioMeta = { credentialId: Uint8Array; salt: Uint8Array; wrapped: Cipher };
type PrfOutputs = { prf?: { enabled?: boolean; results?: { first?: ArrayBuffer } } };
export async function biometricSupported() {
  try {
    return typeof window !== 'undefined' && !!window.PublicKeyCredential && window.isSecureContext
      && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch { return false; }
}
export async function biometricEnrolled(owner: string) { return !!(await storage<BioMeta>(`${owner}:bio`)); }
async function prfKey(credentialId: Uint8Array, salt: Uint8Array) {
  const assertion = await navigator.credentials.get({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    allowCredentials: [{ type: 'public-key', id: new Uint8Array(credentialId) }],
    userVerification: 'required',
    extensions: { prf: { eval: { first: new Uint8Array(salt) } } } as AuthenticationExtensionsClientInputs,
  } }) as PublicKeyCredential | null;
  const secret = (assertion?.getClientExtensionResults() as PrfOutputs | undefined)?.prf?.results?.first;
  if (!secret) throw new Error('This device cannot use fingerprint or face unlock. Use your PIN.');
  const material = await crypto.subtle.importKey('raw', secret, 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(16), info: new TextEncoder().encode('sautisalama-bio') }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
export async function enrollBiometric(owner: string, pin: string) {
  if (!validPin(pin)) throw new Error('Use six digits.');
  const credential = await navigator.credentials.create({ publicKey: {
    rp: { name: 'Sauti Salama' },
    user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'Sauti Salama private space', displayName: 'Sauti Salama' },
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' },
    extensions: { prf: {} } as AuthenticationExtensionsClientInputs,
  } }) as PublicKeyCredential | null;
  if (!credential || !(credential.getClientExtensionResults() as PrfOutputs).prf?.enabled) throw new Error('This device cannot use fingerprint or face unlock. Use your PIN.');
  const credentialId = new Uint8Array(credential.rawId), salt = crypto.getRandomValues(new Uint8Array(32));
  const key = await prfKey(credentialId, salt);
  await storage<BioMeta>(`${owner}:bio`, { value: { credentialId, salt, wrapped: await encrypt(key, pin) } });
}
export async function unlockWithBiometric(owner: string) {
  const bio = await storage<BioMeta>(`${owner}:bio`);
  if (!bio) throw new Error('Fingerprint or face unlock is not set up.');
  const pin = await decrypt<string>(await prfKey(bio.credentialId, bio.salt), bio.wrapped);
  return unlockVault(owner, pin);
}
