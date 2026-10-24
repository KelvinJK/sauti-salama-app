import { createFileRoute } from '@tanstack/react-router';
import { articles } from '@/lib/content';
import { useI18n } from '@/lib/i18n';
import { useAppText } from '@/lib/app-copy';
import { PageTitle } from '@/components/app/AppShell';
import { seo } from '@/lib/seo';
import { ComingSoon } from '@/components/app/ComingSoon';
export const Route = createFileRoute('/app/nutrition')({ head: () => seo('Nutrition & first foods', 'Read draft nutrition information and prepare questions for a health worker.'), component: Nutrition });
function Nutrition() { const {t} = useI18n(); const text=useAppText(); return <><PageTitle title={t('f5')} sub={text('Food, nourishment and your family.','Chakula, lishe na familia yako.')} /><ComingSoon title={text('Nutrition & recipes','Lishe na mapishi')} /></>; }