import { createFileRoute, Link } from '@tanstack/react-router';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/referrals')({ head: () => seo('My referrals', 'Referral status and explicit-consent healthcare sharing.'), component: Referrals });
function Referrals(){ const text=useAppText(); return <><PageTitle title={text('My referrals','Rufaa zangu')} /><p className="mb-5 text-muted-foreground">{text('No referrals. Referral sending awaits verified healthcare partners and a consent workflow. Nothing has been shared.','Hakuna rufaa. Kutuma rufaa kunasubiri washirika waliothibitishwa na utaratibu wa idhini. Hakuna kilichoshirikiwa.')}</p><Button asChild variant="outline"><Link to="/app/care">{text('Find care','Tafuta huduma')}</Link></Button></>; }