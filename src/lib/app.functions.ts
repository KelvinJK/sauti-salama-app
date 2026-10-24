import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { isAdult, profileSchema, recordSchema, recordKinds } from './app-model';
import { z } from 'zod';

export const readProfile = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from('profiles').select('*').eq('id', context.userId).single();
  if (error) throw new Error('Could not load your profile. Please try again.');
  return data;
});
export const saveProfile = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input) => profileSchema.parse(input)).handler(async ({ data, context }) => {
  if (!isAdult(data.birth_date)) throw new Error('Accounts are for adults aged 18 and older.');
  const { data: existing, error: readError } = await context.supabase.from('profiles').select('terms_accepted_at').eq('id', context.userId).single();
  if (readError) throw new Error('Could not load your profile.');
  const { data: profile, error } = await context.supabase.from('profiles').update({ display_name: data.display_name, language: data.language, birth_date: data.birth_date, terms_accepted_at: existing.terms_accepted_at ?? new Date().toISOString() }).eq('id', context.userId).select().single();
  if (error) throw new Error('Your profile was not saved. Please try again.');
  return profile;
});
export const listRecords = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ kind: z.enum(recordKinds) }).parse(input)).handler(async ({ data, context }) => {
  const { data: rows, error } = await context.supabase.from('health_records').select('*').eq('user_id', context.userId).eq('kind', data.kind).order('record_date', { ascending: false }).limit(200);
  if (error) throw new Error('Could not load your records. Please try again.');
  return rows;
});
export const saveRecord = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input) => recordSchema.parse(input)).handler(async ({ data, context }) => {
  if (data.kind === 'growth') {
    if (!data.details.child_id || !data.details.weight || !data.details.height) throw new Error('Choose a child and enter both measurements.');
    const { data: child } = await context.supabase.from('health_records').select('id').eq('id', data.details.child_id).eq('user_id', context.userId).eq('kind', 'child').maybeSingle();
    if (!child) throw new Error('Child profile not found.');
  }
  const { data: row, error } = await context.supabase.from('health_records').insert({ ...data, user_id: context.userId }).select().single();
  if (error) throw new Error('Your record was not saved. Please try again.');
  return row;
});
export const deleteRecord = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input)).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from('health_records').delete().eq('id', data.id).eq('user_id', context.userId);
  if (error) throw new Error('Your record was not deleted.');
  return { success: true };
});
export const exportAccount = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: profile, error: pError } = await context.supabase.from('profiles').select('*').eq('id', context.userId).single();
  const records = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await context.supabase.from('health_records').select('*').eq('user_id', context.userId).order('id').range(offset, offset + 999);
    if (error) throw new Error('Your export could not be prepared.');
    records.push(...data);
    if (data.length < 1000) break;
  }
  if (pError) throw new Error('Your export could not be prepared.');
  return { profile, records, exported_at: new Date().toISOString() };
});
export const deleteAccount = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ confirmation: z.literal('DELETE') }).parse(input)).handler(async ({ context }) => {
  // A verified user can delete only their own identity. Never accept a target user ID.
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.auth.admin.deleteUser(context.userId);
  if (error) throw new Error('Your account could not be deleted. Please try again.');
  return { success: true };
});