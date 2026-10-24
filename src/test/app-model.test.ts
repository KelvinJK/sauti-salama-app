import { describe, expect, it } from 'vitest';
import { isAdult, recordSchema } from '@/lib/app-model';
describe('Adult pilot registration', () => {
  it('allows adults exactly 18 years old', () => { expect(isAdult('2008-10-24', new Date('2026-10-24T12:00:00Z'))).toBe(true); });
  it('rejects someone who turns 18 tomorrow', () => { expect(isAdult('2008-10-25', new Date('2026-10-24T12:00:00Z'))).toBe(false); });
  it('rejects an invalid birth date', () => { expect(isAdult('2000-02-31')).toBe(false); });
});
describe('Growth records', () => {
  it('rejects non-positive measurements', () => { expect(recordSchema.safeParse({ kind: 'growth', title: 'Measurement', record_date: '2026-10-24', details: { weight: -2, height: 45 } }).success).toBe(false); });
});