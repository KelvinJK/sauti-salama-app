import { webcrypto } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { attemptState, shouldLock, validPin, deriveKey, encrypt, decrypt, EMERGENCY_NUMBER, PRIVATE_LOAD_TIMEOUT_MS } from '@/lib/device-vault';
import { moods, symptomOptions } from '@/lib/moods';

describe('Device privacy rules', () => {
  vi.stubGlobal('crypto', webcrypto);
  it('requires exactly six numeric PIN digits', () => { expect(validPin('123456')).toBe(true); expect(validPin('12345')).toBe(false); expect(validPin('1234567')).toBe(false); expect(validPin('abcdef')).toBe(false); });
  it('imposes a 30-second wait on the fifth wrong attempt', () => { expect(attemptState(3,1000)).toEqual({ attempts:4,retryAt:0 }); expect(attemptState(4,1000)).toEqual({ attempts:0,retryAt:31000 }); });
  it('locks at five minutes in the background', () => { expect(shouldLock(1000,300999)).toBe(false); expect(shouldLock(1000,301000)).toBe(true); });
  it('uses a five-second private loading deadline', () => { expect(PRIVATE_LOAD_TIMEOUT_MS).toBe(5000); });
  it('configures the requested emergency number', () => { expect(EMERGENCY_NUMBER).toBe('112'); });
  it('encrypts records and rejects the wrong PIN-derived key', async () => {
    const salt = new Uint8Array(16).fill(7);
    const key = await deriveKey('123456',salt), wrong = await deriveKey('654321',salt);
    const entry = { notes:'Sensitive journal note',mood:'calm' };
    const cipher = await encrypt(key,entry);
    expect(new TextDecoder().decode(cipher.ciphertext)).not.toContain(entry.notes);
    expect(await decrypt(key,cipher)).toEqual(entry);
    await expect(decrypt(wrong,cipher)).rejects.toThrow();
  });
  it('shares all twelve requested moods', () => { expect(moods.map(m => m[2])).toEqual(['Joyful','Calm','Grateful','Energized','Sensitive','Confused','Tired','Stressed','Angry','Insecure','Hurt','Hopeful']); });
  it('includes all seven requested symptoms', () => { expect(symptomOptions.map(s => s[1])).toEqual(['Cramps','Headache','Fatigue','Bloating','Nausea','Spotting','Mood changes']); });
});