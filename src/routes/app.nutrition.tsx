import { createFileRoute } from '@tanstack/react-router';
import { articles } from '@/lib/content';
import { useI18n } from '@/lib/i18n';
import { useAppText } from '@/lib/app-copy';
import { PageTitle } from '@/components/app/AppShell';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/nutrition')({ head: () => seo('Nutrition & first foods', 'Read draft nutrition information and prepare questions for a health worker.'), component: Nutrition });
function Nutrition() { const {lang,t} = useI18n(); const text=useAppText(); return <><PageTitle title={t('f5')} sub={text('Food, nourishment and your family.','Chakula, lishe na familia yako.')} />{articles.filter(a=>a.topic==='nutrition').map(a=><section key={a.slug} className="max-w-2xl space-y-4 border-y py-6"><p className="text-sm font-semibold text-secondary">{t('review_pending')}</p><h2 className="text-xl font-bold">{a.title[lang]}</h2>{a.body[lang].map(p=><p key={p} className="leading-relaxed text-muted-foreground">{p}</p>)}</section>)}<h2 className="mt-8 text-xl font-bold">{text('Recipes','Mapishi')}</h2><p className="mt-3 text-muted-foreground">{text('No reviewed recipes are published yet.','Bado hakuna mapishi yaliyokaguliwa yaliyochapishwa.')}</p></>; }