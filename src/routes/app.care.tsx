import { useState } from 'react';
import { useWebMCP } from 'use-webmcp-tool';
import { runWebMCPTool } from '@/lib/webmcp-telemetry';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, ShieldCheck, Clock, FlaskConical, Baby, CalendarCheck, HeartHandshake, Sprout, Salad, Send, MessageCircle, ChevronRight, type LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SHOW_EXAMPLE_FACILITIES } from '@/lib/feature-flags';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { appSeo as seo } from '@/lib/seo';
import { supabase } from '@/integrations/supabase/client';
import { facilityServices, facilityServiceCopy, formatPhoneHref, type Facility, type FacilityService } from '@/lib/facilities';
import { UrgentHelpBanner } from '@/components/app/Safety';

export const Route = createFileRoute('/app/care')({ staticData: { sitemap: false },
  head: () => seo('Find care in Tanzania', 'Browse verified health facilities and filter by district and services.'),
  component: CareHub,
});


const ALL = 'all';

type HubRow = { to?: '/app/pregnancy' | '/app/antenatal' | '/app/postnatal' | '/app/children' | '/app/nutrition' | '/app/find-care' | '/app/referrals' | '/app/assistant'; icon: LucideIcon; bg: string; t: [string, string]; s: [string, string]; soon?: boolean };
const hubSections: Array<{ t: [string, string]; rows: HubRow[] }> = [
  { t: ['Maternal care', 'Huduma ya mama'], rows: [
    { to: '/app/pregnancy', icon: Baby, bg: 'bg-peach', t: ['Pregnancy journey', 'Safari ya ujauzito'], s: ['Week-by-week information for you and baby', 'Taarifa za kila wiki kwako na mtoto'] },
    { to: '/app/antenatal', icon: CalendarCheck, bg: 'bg-lavender', t: ['Antenatal planner', 'Mpango wa kliniki'], s: ['Plan and remember clinic visits', 'Panga na kumbuka mahudhurio ya kliniki'] },
    { to: '/app/postnatal', icon: HeartHandshake, bg: 'bg-pink', t: ['Postnatal support', 'Msaada baada ya kujifungua'], s: ['Care for you after birth', 'Huduma kwako baada ya kujifungua'] },
  ] },
  { t: ['Child health', 'Afya ya mtoto'], rows: [
    { to: '/app/children', icon: Sprout, bg: 'bg-mint', t: ['Child profiles', 'Wasifu wa watoto'], s: ['Private profiles and growth measurements', 'Wasifu binafsi na vipimo vya ukuaji'] },
    { to: '/app/nutrition', icon: Salad, bg: 'bg-peach', t: ['Nutrition library', 'Maktaba ya lishe'], s: ['Healthy meals for the family', 'Milo bora kwa familia'] },
  ] },
  { t: ['Get support', 'Pata msaada'], rows: [
    { to: '/app/find-care', icon: MapPin, bg: 'bg-mint', t: ['Find care', 'Tafuta huduma'], s: ['Search facilities by district and service', 'Tafuta vituo kwa wilaya na huduma'] },
    { to: '/app/referrals', icon: Send, bg: 'bg-lavender', t: ['My referrals', 'Rufaa zangu'], s: ['Share details only with your consent', 'Shiriki taarifa kwa idhini yako tu'] },
    { to: '/app/assistant', icon: MessageCircle, bg: 'bg-pink', t: ['Private assistant', 'Msaidizi binafsi'], s: ['Ask health questions privately', 'Uliza maswali ya afya kwa faragha'] },
  ] },
];
function CareHub() {
  const text = useAppText();
  return <><UrgentHelpBanner /><PageTitle title={text('Care', 'Huduma')} />{hubSections.map((section) => <section key={section.t[0]} className="mb-8"><h2 className="mb-3 text-lg font-bold">{text(...section.t)}</h2><ul className="divide-y overflow-hidden rounded-lg border bg-card">{section.rows.map((row) => { const Icon = row.icon; const inner = <><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${row.bg}`}><Icon className="h-5 w-5 text-primary" /></span><span className="min-w-0 flex-1"><span className="block font-bold">{text(...row.t)}</span><span className="block truncate text-sm text-muted-foreground">{text(...row.s)}</span>{row.soon && <span className="mt-1 inline-block rounded-full bg-peach px-2 py-0.5 text-xs font-bold text-secondary">{text('Coming soon', 'Inakuja hivi karibuni')}</span>}</span><ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" /></>; return <li key={row.t[0]}>{row.soon || !row.to ? <div aria-disabled="true" className="flex min-h-16 cursor-not-allowed items-center gap-4 p-4 opacity-60">{inner}</div> : <Link to={row.to} className="flex min-h-16 items-center gap-4 p-4 transition-colors hover:bg-muted">{inner}</Link>}</li>; })}</ul></section>)}</>;
}
export function CareDirectory() {
  const text = useAppText();
  const [district, setDistrict] = useState(ALL);
  const [service, setService] = useState<FacilityService | typeof ALL>(ALL);
  const [query, setQuery] = useState('');

  const { data: dbFacilities, isLoading, isError, refetch } = useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      let q = supabase.from('facilities').select('*').eq('verified', true).order('district').order('name');
      if (!SHOW_EXAMPLE_FACILITIES) q = q.eq('is_example', false);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as Array<Facility & { hours: string; is_example: boolean }>;
    },
  });
  const facilities = dbFacilities ?? [];

  const districts = [...new Set((facilities ?? []).map((f) => f.district))].sort();
  const visible = (facilities ?? []).filter(
    (f) => (district === ALL || f.district === district) && (service === ALL || f.services.includes(service)) && (!query.trim() || `${f.name} ${f.district} ${f.region} ${f.address}`.toLowerCase().includes(query.trim().toLowerCase())),
  );

  useWebMCP({
    name: 'list_shown_facilities',
    description: 'List the verified facilities currently shown in the care directory, respecting active filters.',
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    enabled: !isLoading && !isError,
    execute: () => runWebMCPTool('list_shown_facilities', () =>
      visible.length === 0 ? 'No verified facilities shown.' : visible.map((f) => `${f.name} — ${f.district}, ${f.region}; services: ${f.services.join(', ')}; phone: ${f.phone ?? 'n/a'}`).join('\n')),
  });
  useWebMCP({
    name: 'filter_facilities',
    description: 'Change the care directory filters by district and/or service. Use "all" to clear a filter.',
    inputSchema: {
      type: 'object',
      properties: {
        district: { type: 'string', description: `District name, or "all". Available: ${districts.join(', ') || 'none yet'}.` },
        service: { type: 'string', enum: [ALL, ...facilityServices], description: 'Service key, or "all".' },
      },
    },
    enabled: !isLoading && !isError,
    execute: (args: { district?: unknown; service?: unknown }) => runWebMCPTool('filter_facilities', () => {
      if (args.district !== undefined && (typeof args.district !== 'string' || (args.district !== ALL && !districts.includes(args.district)))) throw new Error(`Unknown district; expected all or one of: ${districts.join(', ')}`);
      if (args.service !== undefined && (typeof args.service !== 'string' || (args.service !== ALL && !(facilityServices as readonly string[]).includes(args.service)))) throw new Error(`Unknown service; expected all or one of: ${facilityServices.join(', ')}`);
      if (typeof args.district === 'string') setDistrict(args.district);
      if (typeof args.service === 'string') setService(args.service as FacilityService | typeof ALL);
      return 'Filters updated.';
    }),
  });

  return (
    <>
      <PageTitle title={text('Find care', 'Tafuta huduma')} sub={text('Verified facilities, filtered by where you are and what you need.', 'Vituo vilivyothibitishwa, kulingana na mahali ulipo na huduma unayohitaji.')} />

      <label className="mb-3 grid gap-1 text-sm font-semibold">{text('Search', 'Tafuta')}<Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={text('Name, district or area', 'Jina, wilaya au eneo')} className="h-11 font-normal" /></label>
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
              {f.is_example ? <span className="inline-flex items-center gap-1 rounded-full bg-peach px-2.5 py-0.5 text-xs font-semibold"><FlaskConical className="h-3.5 w-3.5" />{text('Example facility (pilot)', 'Kituo cha mfano (majaribio)')}</span> : <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold"><ShieldCheck className="h-3.5 w-3.5" />{text('Verified', 'Imethibitishwa')}</span>}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{f.district}, {f.region}{f.address ? ` — ${f.address}` : ''}</p>
            {f.hours && <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="h-4 w-4 shrink-0" />{f.hours}</p>}
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
