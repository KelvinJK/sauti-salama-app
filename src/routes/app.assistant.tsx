import { createFileRoute, Link } from '@tanstack/react-router';
import { MessageCircle } from 'lucide-react';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { appSeo as seo } from '@/lib/seo';
import { ComingSoon } from '@/components/app/ComingSoon';
export const Route = createFileRoute('/app/assistant')({ staticData: { sitemap: false }, head: () => seo('Private health questions', 'Prepare health questions privately and browse educational information.'), component: Assistant });
function Assistant(){ const text=useAppText(); return <><PageTitle title={text('Your health questions','Maswali yako ya afya')} sub={text('Information and care navigation, not diagnosis or treatment.','Taarifa na mwongozo wa huduma, si utambuzi wala matibabu.')} /><ComingSoon title={text('Private health questions','Maswali binafsi ya afya')} /></>; }