import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppText } from '@/lib/app-copy';
import { useAppAuth } from '@/components/app/AuthProvider';
import { appSeo as seo } from '@/lib/seo';
import { supabase } from '@/integrations/supabase/client';
import { hasRole } from '@/lib/admin.functions';
import { facilitySchema, facilityServices, facilityServiceCopy, type Facility, type FacilityService } from '@/lib/facilities';

export const Route = createFileRoute('/app/admin-facilities')({ staticData: { sitemap: false },
  head: () => seo('Manage facilities', 'Admin review and verification of care directory listings.'),
  component: AdminFacilities,
});

const emptyForm = { name: '', district: '', region: '', address: '', phone: '', services: [] as FacilityService[], verified: false };

function AdminFacilities() {
  const text = useAppText();
  const { user, loading: authLoading } = useAppAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ['is-admin', user?.id],
    enabled: Boolean(user),
    queryFn: async () => (await hasRole({ data: { role: 'admin' } })).allowed,
  });

  const { data: facilities, isLoading } = useQuery({
    queryKey: ['admin-facilities'],
    enabled: role === true,
    queryFn: async () => {
      // Admin policy allows reading unverified rows too.
      const { data, error } = await supabase.from('facilities').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Facility[];
    },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
    queryClient.invalidateQueries({ queryKey: ['facilities'] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const parsed = facilitySchema.safeParse(form);
      if (!parsed.success) throw new Error(text('Fill in the name, district, region and at least one service.', 'Jaza jina, wilaya, mkoa na angalau huduma moja.'));
      const { error } = await supabase.from('facilities').insert(parsed.data);
      if (error) throw new Error(text('The facility was not saved. Please try again.', 'Kituo hakikuhifadhiwa. Tafadhali jaribu tena.'));
    },
    onSuccess: () => { setForm(emptyForm); setFormError(''); refresh(); toast.success(text('Facility saved.', 'Kituo kimehifadhiwa.')); },
    onError: (e) => setFormError(e instanceof Error ? e.message : text('The facility was not saved.', 'Kituo hakikuhifadhiwa.')),
  });

  const setVerified = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase.from('facilities').update({ verified }).eq('id', id);
      if (error) throw new Error(text('The change was not saved.', 'Mabadiliko hayakuhifadhiwa.'));
    },
    onSuccess: () => refresh(),
    onError: (e) => toast.error(e instanceof Error ? e.message : text('The change was not saved.', 'Mabadiliko hayakuhifadhiwa.')),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('facilities').delete().eq('id', id);
      if (error) throw new Error(text('The facility was not deleted.', 'Kituo hakikufutwa.'));
    },
    onSuccess: () => refresh(),
    onError: (e) => toast.error(e instanceof Error ? e.message : text('The facility was not deleted.', 'Kituo hakikufutwa.')),
  });

  if (authLoading || (user && roleLoading)) return <p className="py-8 text-muted-foreground">{text('Loading…', 'Inapakia…')}</p>;
  if (!user) return <><PageTitle title={text('Manage facilities', 'Dhibiti vituo')} /><p className="py-8 text-muted-foreground">{text('Sign in to continue.', 'Ingia ili kuendelea.')}</p></>;
  if (role !== true) return <><PageTitle title={text('Manage facilities', 'Dhibiti vituo')} /><p className="py-8 text-muted-foreground">{text('This area is only for the Sauti Salama review team.', 'Sehemu hii ni kwa timu ya ukaguzi ya Sauti Salama tu.')}</p></>;

  return (
    <>
      <PageTitle title={text('Manage facilities', 'Dhibiti vituo')} sub={text('Add listings and mark them verified only after their details are confirmed.', 'Ongeza vituo na uvithibitishe tu baada ya taarifa kuthibitishwa.')} />

      <form className="mb-10 grid max-w-xl gap-3" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
        <Input required maxLength={160} placeholder={text('Facility name', 'Jina la kituo')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input required maxLength={80} placeholder={text('District', 'Wilaya')} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          <Input required maxLength={80} placeholder={text('Region', 'Mkoa')} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
        </div>
        <Input maxLength={240} placeholder={text('Address (optional)', 'Anuani (si lazima)')} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Input maxLength={40} placeholder={text('Phone (optional)', 'Simu (si lazima)')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <fieldset className="grid gap-2">
          <legend className="text-sm font-semibold">{text('Services', 'Huduma')}</legend>
          <div className="flex flex-wrap gap-2">
            {facilityServices.map((s) => {
              const active = form.services.includes(s);
              return (
                <button key={s} type="button" aria-pressed={active} onClick={() => setForm({ ...form, services: active ? form.services.filter((x) => x !== s) : [...form.services, s] })} className={`rounded-full border px-3 py-1.5 text-sm ${active ? 'border-primary bg-primary text-primary-foreground' : ''}`}>
                  {text(facilityServiceCopy[s].en, facilityServiceCopy[s].sw)}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
          {text('Details verified — show publicly', 'Taarifa zimethibitishwa — onyesha hadharani')}
        </label>
        {formError && <p className="text-sm font-semibold text-destructive">{formError}</p>}
        <Button type="submit" disabled={save.isPending}>{save.isPending ? text('Saving…', 'Inahifadhi…') : text('Add facility', 'Ongeza kituo')}</Button>
      </form>

      {isLoading && <p className="text-muted-foreground">{text('Loading…', 'Inapakia…')}</p>}
      <ul className="grid max-w-2xl gap-3">
        {(facilities ?? []).map((f) => (
          <li key={f.id} className="rounded-2xl border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold">{f.name}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${f.verified ? 'bg-mint' : 'bg-muted'}`}>{f.verified ? text('Verified', 'Imethibitishwa') : text('Pending verification', 'Inasubiri uthibitishaji')}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{f.district}, {f.region}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" disabled={setVerified.isPending} onClick={() => setVerified.mutate({ id: f.id, verified: !f.verified })}>
                {f.verified ? text('Unverify', 'Ondoa uthibitishaji') : text('Mark verified', 'Thibitisha')}
              </Button>
              <Button size="sm" variant="destructive" disabled={remove.isPending} onClick={() => remove.mutate(f.id)}>{text('Delete', 'Futa')}</Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
