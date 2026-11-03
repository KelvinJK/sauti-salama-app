import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { appSeo as seo } from '@/lib/seo';
import { CheckCircle } from 'lucide-react';

export const Route = createFileRoute('/app/referrals')({ staticData: { sitemap: false }, head: () => seo('My referrals', 'Referral status and explicit-consent healthcare sharing.'), component: Referrals });

function Referrals(){ 
  const text = useAppText(); 
  const [consented, setConsented] = useState(false);
  const [shared, setShared] = useState(false);

  return <>
    <PageTitle title={text('My referrals','Rufaa zangu')} sub={text('Share selected private records only with your explicit consent.','Shiriki kumbukumbu binafsi zilizochaguliwa kwa idhini yako wazi tu.')} />
    <p className="mb-5 text-muted-foreground">{text('Nothing is shared automatically. You control what, if anything, is prepared for a facility.','Hakuna kinachoshirikiwa kiotomatiki. Wewe unadhibiti nini, ikiwa kuna chochote, kinachoandaliwa kwa kituo.')}</p>
    
    {!shared ? <>
      <label className="mb-4 flex items-center gap-2">
        <input type="checkbox" checked={consented} onChange={e => setConsented(e.target.checked)} />
        {text('I explicitly consent to prepare a referral note from my private records for a verified facility.','Ninatoa idhini wazi ya kuandaa dokezo la rufaa kutoka kumbukumbu zangu binafsi kwa kituo kilichothibitishwa.')}
      </label>
      <Button disabled={!consented} onClick={() => setShared(true)}>{text('Prepare referral note','Andaa dokezo la rufaa')}</Button>
    </> : <>
      <div className="mb-5 flex items-center gap-2 text-green-700">
        <CheckCircle className="h-5 w-5" />
        {text('Referral note prepared on this device. Share it only when you are ready and with a trusted provider.','Dokezo la rufaa limeandaliwa kwenye kifaa hiki. Shiriki tu unapokuwa tayari na kwa mtoa huduma unayemwamini.')}
      </div>
      <p className="text-sm text-muted-foreground">{text('In the full version, this will generate a secure shareable summary. For now, you can note key points from your journal or records.','Katika toleo kamili, hii itazalisha muhtasari unaoweza kushirikiwa kwa usalama. Kwa sasa, unaweza kuandika pointi muhimu kutoka shajara au kumbukumbu zako.')}</p>
    </>}
    
    <div className="mt-6">
      <Button asChild variant="outline"><Link to="/app/find-care">{text('Find a facility','Tafuta kituo')}</Link></Button>
    </div>
  </>;
}
