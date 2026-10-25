import { DomainLink } from '@/components/DomainLink';
import { createFileRoute, Link } from '@tanstack/react-router';
import { BookOpen, ArrowRight } from 'lucide-react';
import { articles } from '@/lib/content';
import { useI18n } from '@/lib/i18n';
import { PageTitle } from '@/components/app/AppShell';
import { Button } from '@/components/ui/button';
import { appSeo as seo } from '@/lib/seo';
export const Route = createFileRoute('/app/learn')({ staticData: { sitemap: false }, head: () => seo('App health education', 'Read bilingual health education freely in the SautiSalama app.'), component: Learn });
function Learn() { const { lang,t } = useI18n(); return <><PageTitle title={t('learn_title')} sub={t('learn_sub')} /><div className="grid gap-5 sm:grid-cols-2">{articles.map(a => <article key={a.slug} className="rounded-lg border bg-card p-6"><BookOpen className="mb-5 text-primary" /><span className="text-xs font-semibold text-secondary">{t('review_pending')}</span><h2 className="mt-2 text-xl font-bold">{a.title[lang]}</h2><p className="my-4 text-sm text-muted-foreground">{a.summary[lang]}</p><details><summary className="cursor-pointer font-semibold text-primary">{t('read_more')}</summary><div className="mt-4 space-y-3 text-sm leading-relaxed">{a.body[lang].map(p => <p key={p}>{p}</p>)}</div></details></article>)}</div><Button asChild variant="ghost" className="mt-6"><DomainLink destination="site" to="/learn">{t('browse_learn')}<ArrowRight /></DomainLink></Button></>; }