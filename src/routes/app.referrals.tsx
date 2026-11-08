import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { appSeo as seo } from '@/lib/seo';
import { CheckCircle, Copy, Download } from 'lucide-react';
import { usePrivateRecords } from '@/components/app/usePrivateRecords';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SHOW_EXAMPLE_FACILITIES } from '@/lib/feature-flags';
import type { Facility } from '@/lib/facilities';

export const Route = createFileRoute('/app/referrals')({ staticData: { sitemap: false }, head: () => seo('My referrals', 'Referral status and explicit-consent healthcare sharing.'), component: Referrals });

function Referrals(){ 
  const text = useAppText(); 
  const [consented, setConsented] = useState(false);
  const [shared, setShared] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [note, setNote] = useState('');
  const journal = usePrivateRecords('journal');
  const pregnancy = usePrivateRecords('pregnancy');

  const { data: facilities } = useQuery({
    queryKey: ['facilities-for-referral'],
    queryFn: async () => {
      let q = supabase.from('facilities').select('*').order('name');
      if (!SHOW_EXAMPLE_FACILITIES) q = q.eq('is_example', false);
      const { data } = await q;
      return (data ?? []) as Facility[];
    },
  });

  function generateNote() {
    const records = [...(journal.rows || []), ...(pregnancy.rows || [])].slice(0, 5);
    const summary = records.map(r => `- ${r.record_date}: ${r.title}${r.details['notes'] ? ' - ' + String(r.details['notes']).slice(0, 100) : ''}`).join('\n');
    const facilityName = facilities?.find(f => f.id === selectedFacility)?.name || 'selected facility';
    return `Referral note for ${facilityName}\nPrepared on ${new Date().toLocaleDateString()}\n\nRecent private records (shared with consent):\n${summary || 'No records selected'}\n\nThis note was prepared by the user with explicit consent.`;
  }

  function prepare() {
    setNote(generateNote());
    setShared(true);
  }

  function copyNote() {
    navigator.clipboard.writeText(note);
    alert(text('Copied to clipboard', 'Imenakiliwa kwenye clipboard'));
  }

  function downloadNote() {
    const blob = new Blob([note], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'referral-note.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return <>
    <PageTitle title={text('My referrals','Rufaa zangu')} sub={text('Share a summary of your private records with a verified facility, only with your consent.','Shiriki muhtasari wa kumbukumbu zako binafsi na kituo kilichothibitishwa, kwa idhini yako tu.')} />
    <p className="mb-5 text-muted-foreground">{text('Select a facility and consent to generate a shareable note on this device.','Chagua kituo na toa idhini kuzalisha dokezo linaloweza kushirikiwa kwenye kifaa hiki.')}</p>
    
    {!shared ? <>
      <label className="mb-3 block text-sm font-semibold">{text('Facility', 'Kituo')}
        <select value={selectedFacility} onChange={e => setSelectedFacility(e.target.value)} className="mt-1 h-11 w-full rounded-md border bg-background px-3">
          <option value="">{text('Choose a facility', 'Chagua kituo')}</option>
          {facilities?.map(f => <option key={f.id} value={f.id}>{f.name} ({f.district})</option>)}
        </select>
      </label>
      <label className="mb-4 flex items-center gap-2">
        <input type="checkbox" checked={consented} onChange={e => setConsented(e.target.checked)} />
        {text('I explicitly consent to generate a referral note containing a summary of my recent private records for the selected facility.','Ninatoa idhini wazi ya kuzalisha dokezo la rufaa lenye muhtasari wa kumbukumbu zangu binafsi za hivi karibuni kwa kituo kilichochaguliwa.')}
      </label>
      <Button disabled={!consented || !selectedFacility} onClick={prepare}>{text('Generate shareable note','Zalisha dokezo linaloweza kushirikiwa')}</Button>
    </> : <>
      <div className="mb-5 flex items-center gap-2 text-green-700">
        <CheckCircle className="h-5 w-5" />
        {text('Referral note ready. Copy or download it to share with the facility.','Dokezo la rufaa limeandaliwa. Nakili au pakua ili kushiriki na kituo.')}
      </div>
      <pre className="mb-4 max-h-64 overflow-auto rounded-lg border bg-muted p-4 text-sm whitespace-pre-wrap">{note}</pre>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={copyNote}><Copy className="h-4 w-4" />{text('Copy', 'Nakili')}</Button>
        <Button variant="outline" onClick={downloadNote}><Download className="h-4 w-4" />{text('Download', 'Pakua')}</Button>
        <Button variant="ghost" onClick={() => setShared(false)}>{text('Start over', 'Anza upya')}</Button>
      </div>
    </>}
    
    <div className="mt-6">
      <Button asChild variant="outline"><Link to="/app/find-care">{text('Browse facilities','Tazama vituo')}</Link></Button>
    </div>
  </>;
}
