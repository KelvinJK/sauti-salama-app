import { createFileRoute } from '@tanstack/react-router';
import { RecordPage } from '@/components/app/RecordPage';
import { appSeo as seo } from '@/lib/seo';
import { pregnancyWeeks } from '@/lib/pregnancy-content';
import { useI18n } from '@/lib/i18n';
import { useAppText } from '@/lib/app-copy';
import { Baby } from 'lucide-react';

export const Route = createFileRoute('/app/pregnancy')({ staticData: { sitemap: false }, head: () => seo('Pregnancy journey', 'Record your pregnancy journey and questions for your care provider.'), component: PregnancyPage });

function PregnancyPage() {
  const { lang } = useI18n();
  const text = useAppText();
  return <>
    <div className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><Baby className="h-5 w-5" />{text('Week-by-week guide', 'Mwongozo wa kila wiki')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {pregnancyWeeks.map(w => (
          <details key={w.week} className="rounded-lg border bg-card p-4">
            <summary className="cursor-pointer font-semibold">{w.title[lang]}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{w.summary[lang]}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{w.tips[lang].map(t => <li key={t}>{t}</li>)}</ul>
          </details>
        ))}
      </div>
    </div>
    <RecordPage kind="pregnancy" title={['Pregnancy journey','Safari ya ujauzito']} subtitle={['Your private notes and questions.','Maelezo yako binafsi na maswali.']} />
  </>;
}
