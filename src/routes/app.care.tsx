import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { seo } from '@/lib/seo';
import { supabase } from '@/integrations/supabase/client';
import { facilityServices, facilityServiceCopy, formatPhoneHref, type Facility, type FacilityService } from '@/lib/facilities';
import { UrgentHelpBanner } from '@/components/app/Safety';

export const Route = createFileRoute('/app/care')({
  head: () => seo('Find care in Tanzania', 'Browse verified health facilities and filter by district and services.'),
  component: CareHub,
});

const ALL = 'all';

function CareHub() {
  const text = useAppText();
  return <><UrgentHelpBanner /><PageTitle title={text('Care', 'Huduma')} /><div className="flex flex-wrap gap-3"><Button asChild><Link to="/app/find-care"><MapPin />{text('Find care','Tafuta huduma')}</Link></Button><Button asChild variant="outline"><Link to="/app/referrals">{text('My referrals','Rufaa zangu')}</Link></Button></div></>;
}
export function CareDirectory() {
  const text = useAppText();
  const [district, setDistrict] = useState(ALL);
  const [service, setService] = useState<FacilityService | typeof ALL>(ALL);

  const { data: facilities, isLoading, isError, refetch } = useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const { data, error } = await supabase.from('facilities').select('*').order('district').order('name');
      if (error) throw error;
      return data as Facility[];
    },
  });

  const districts = [...new Set((facilities ?? []).map((f) => f.district))].sort();
  const visible = (facilities ?? []).filter(
    (f) => (district === ALL || f.district === district) && (service === ALL || f.services.includes(service)),
  );

  return (
    <>
      <PageTitle title={text('Find care', 'Tafuta huduma')} sub={text('Verified facilities, filtered by where you are and what you need.', 'Vituo vilivyothibitishwa, kulingana na mahali ulipo na huduma unayohitaji.')} />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          {text('District', 'Wilaya')}
          <select aria-label={text('District', 'Wilaya')} value={district} onChange={(e) => setDistrict(e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal">
            <option value={ALL}>{text('All districts', 'Wilaya zote')}</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          {text('Service', 'Huduma')}
          <select aria-label={text('Service', 'Huduma')} value={service} onChange={(e) => setService(e.target.value as FacilityService | typeof ALL)} className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal">
            <option value={ALL}>{text('All services', 'Huduma zote')}</option>
            {facilityServices.map((s) => <option key={s} value={s}>{text(facilityServiceCopy[s].en, facilityServiceCopy[s].sw)}</option>)}
          </select>
        </label>
      </div>

      {isLoading && <p className="py-8 text-muted-foreground">{text('Loading facilities…', 'Inapakia vituo…')}</p>}
      {isError && (
        <div className="py-8">
          <p className="mb-3 text-muted-foreground">{text('The directory could not be loaded. Please try again.', 'Orodha haikuweza kupakiwa. Tafadhali jaribu tena.')}</p>
          <Button variant="outline" onClick={() => refetch()}>{text('Try again', 'Jaribu tena')}</Button>
        </div>
      )}

      {!isLoading && !isError && (facilities ?? []).length === 0 && (
        <div className="border-y py-9">
          <MapPin className="mb-4 h-9 w-9 text-teal" />
          <h2 className="text-xl font-bold">{text('No verified facilities listed yet', 'Bado hakuna vituo vilivyothibitishwa')}</h2>
          <p className="my-4 max-w-xl text-muted-foreground">{text('We only publish facilities after their details have been verified. The directory will grow as verification is completed.', 'Tunachapisha vituo tu baada ya taarifa kuthibitishwa. Orodha itakua kadri uthibitishaji unavyokamilika.')}</p>
        </div>
      )}

      {!isLoading && !isError && (facilities ?? []).length > 0 && visible.length === 0 && (
        <p className="py-8 text-muted-foreground">{text('No facilities match these filters. Try a different district or service.', 'Hakuna kituo kinacholingana na vichujio hivi. Jaribu wilaya au huduma nyingine.')}</p>
      )}

      <ul className="grid gap-4">
        {visible.map((f) => (
          <li key={f.id} className="rounded-2xl border p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">{f.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold"><ShieldCheck className="h-3.5 w-3.5" />{text('Verified', 'Imethibitishwa')}</span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{f.district}, {f.region}{f.address ? ` — ${f.address}` : ''}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {f.services.map((s) => (
                <span key={s} className="rounded-full border px-2.5 py-0.5 text-xs">{text(facilityServiceCopy[s as FacilityService]?.en ?? s, facilityServiceCopy[s as FacilityService]?.sw ?? s)}</span>
              ))}
            </div>
            {f.phone && (
              <Button asChild variant="outline" size="sm" className="mt-4">
                <a href={formatPhoneHref(f.phone)}><Phone className="h-4 w-4" />{f.phone}</a>
              </Button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild variant="outline"><Link to="/app/referrals">{text('My referrals', 'Rufaa zangu')}</Link></Button>
      </div>
      <p className="mt-6 font-semibold">{text('In an emergency, go to the nearest health facility.', 'Katika dharura, nenda kituo cha afya kilicho karibu.')}</p>
    </>
  );
}
