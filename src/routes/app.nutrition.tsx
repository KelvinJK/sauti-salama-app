import { createFileRoute } from '@tanstack/react-router';
import { articles } from '@/lib/content';
import { useI18n } from '@/lib/i18n';
import { useAppText } from '@/lib/app-copy';
import { PageTitle } from '@/components/app/AppShell';
import { appSeo as seo } from '@/lib/seo';
import { BookOpen } from 'lucide-react';

export const Route = createFileRoute('/app/nutrition')({ staticData: { sitemap: false }, head: () => seo('Nutrition & first foods', 'Read draft nutrition information and prepare questions for a health worker.'), component: Nutrition });

function Nutrition() { 
  const { lang, t } = useI18n(); 
  const text = useAppText(); 
  const nutritionArticles = articles.filter(a => a.topic === 'nutrition');
  return <>
    <PageTitle title={text('Nutrition library','Maktaba ya lishe')} sub={text('Healthy meals and nutrition information for the family.','Milo bora na taarifa za lishe kwa familia.')} />
    <div className="grid gap-5 sm:grid-cols-2">
      {nutritionArticles.map(a => (
        <article key={a.slug} className="rounded-lg border bg-card p-6">
          <BookOpen className="mb-5 text-primary" />
          <span className="text-xs font-semibold text-secondary">{t('review_pending')}</span>
          <h2 className="mt-2 text-xl font-bold">{a.title[lang]}</h2>
          <p className="my-4 text-sm text-muted-foreground">{a.summary[lang]}</p>
          <details>
            <summary className="cursor-pointer font-semibold text-primary">{t('read_more')}</summary>
            <div className="mt-4 space-y-3 text-sm leading-relaxed">{a.body[lang].map(p => <p key={p}>{p}</p>)}</div>
          </details>
        </article>
      ))}
    </div>
    {nutritionArticles.length === 0 && <p className="py-8 text-muted-foreground">{text('More nutrition information is being prepared.','Taarifa zaidi za lishe zinaandaliwa.')}</p>}
  </>;
}
