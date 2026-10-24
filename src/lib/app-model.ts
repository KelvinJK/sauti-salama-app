import { z } from 'zod';

export const recordKinds = ['cycle', 'pregnancy', 'antenatal', 'postnatal', 'child', 'growth', 'journal'] as const;
export type RecordKind = typeof recordKinds[number];
export function isAdult(birthDate: string, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return false;
  const birth = new Date(`${birthDate}T00:00:00Z`);
  if (Number.isNaN(birth.getTime()) || birth.toISOString().slice(0, 10) !== birthDate) return false;
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  if (today.getUTCMonth() < birth.getUTCMonth() || (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate())) age--;
  return age >= 18 && age <= 120;
}
export const profileSchema = z.object({ display_name: z.string().trim().min(1).max(80), language: z.enum(['en', 'sw']), birth_date: z.string(), acceptTerms: z.literal(true) });
export const recordSchema = z.object({
  kind: z.enum(recordKinds), record_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().trim().min(1).max(160),
  details: z.object({ notes: z.string().max(10000).default(''), mood: z.string().max(40).optional(), bleeding: z.string().max(40).optional(), symptoms: z.array(z.string().max(40)).max(12).optional(), child_id: z.string().uuid().optional(), weight: z.number().positive().max(300).optional(), height: z.number().positive().max(250).optional() }),
});