import { createFileRoute, Link } from '@tanstack/react-router';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { seo } from '@/lib/seo';
import { ComingSoon } from '@/components/app/ComingSoon';
export const Route = createFileRoute('/app/referrals')({ head: () => seo('My referrals', 'Referral status and explicit-consent healthcare sharing.'), component: Referrals });
function Referrals(){ const text=useAppText(); return <><PageTitle title={text('My referrals','Rufaa zangu')} /><ComingSoon title={text('Consent-based referrals','Rufaa kwa idhini')} /><p className="my-5 text-muted-foreground">{text('Nothing has been shared.','Hakuna kilichoshirikiwa.')}</p><Button asChild variant="outline"><Link to="/app/find-care">{text('Find care','Tafuta huduma')}</Link></Button></>; }