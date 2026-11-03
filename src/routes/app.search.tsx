import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { Search, BookOpen, Baby, MapPin, HelpCircle, Sparkles } from 'lucide-react';
import { PageTitle } from '@/components/app/AppShell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { useI18n } from '@/lib/i18n';
import { appSeo as seo } from '@/lib/seo';
import { searchContent, type SearchResult } from '@/lib/search';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SHOW_EXAMPLE_FACILITIES } from '@/lib/feature-flags';
import type { Facility } from '@/lib/facilities';

export const Route = createFileRoute('/app/search')({
  staticData: { sitemap: false },
  head: () => seo('Search health information', 'Find articles, pregnancy guidance, facilities and answers.'),
  component: SearchPage,
});

const typeIcons: Record<SearchResult['type'], typeof BookOpen> = {
  article: BookOpen,
  pregnancy: Baby,
  facility: MapPin,
  faq: HelpCircle,
};

const typeLabels = {
  article: { en: 'Article', sw: 'Makala' },
  pregnancy: { en: 'Pregnancy', sw: 'Ujauzito' },
  facility: { en: 'Facility', sw: 'Kituo' },
  faq: { en: 'FAQ', sw: 'Maswali' },
};

function SearchPage() {
  const text = useAppText();
  const { lang } = useI18n();
  const [query, setQuery] = useState('');

  const { data: facilities = [] } = useQuery({
    queryKey: ['facilities-for-search'],
    queryFn: async () => {
      let q = supabase.from('facilities').select('*').order('name');
      if (!SHOW_EXAMPLE_FACILITIES) q = q.eq('is_example', false);
      const { data } = await q;
      return (data ?? []) as Facility[];
    },
  });

  const results = useMemo(
    () => searchContent(query, lang, facilities),
    [query, lang, facilities],
  );

  return (
    <>
      <PageTitle
        title={text('Search', 'Tafuta')}
        sub={text(
          'Find health articles, pregnancy guidance, facilities and answers. Results stay on this device.',
          'Tafuta makala za afya, mwongozo wa ujauzito, vituo na majibu. Matokeo yanabaki kwenye kifaa hiki.',
        )}
      />

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={text(
            'Try: week 12, iron foods, antenatal, Muhimbili...',
            'Jaribu: wiki 12, vyakula chuma, kliniki, Muhimbili...',
          )}
          className="h-12 pl-10 text-base"
          autoFocus
        />
      </div>

      {query.trim().length >= 2 && results.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            {text(
              'No matching information found. Try different words or ask the private assistant.',
              'Hakuna taarifa inayolingana. Jaribu maneno mengine au uliza msaidizi binafsi.',
            )}
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/app/assistant">{text('Ask the assistant', 'Uliza msaidizi')}</Link>
          </Button>
        </div>
      )}

      {results.length > 0 && (
        <ul className="space-y-3">
          {results.map((r) => {
            const Icon = typeIcons[r.type];
            const content = (
              <div className="flex gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-primary">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-secondary">
                      {text(typeLabels[r.type].en, typeLabels[r.type].sw)}
                    </span>
                    {r.meta && <span className="text-xs text-muted-foreground">· {r.meta}</span>}
                  </div>
                  <h3 className="font-bold leading-snug">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.snippet}</p>
                </div>
              </div>
            );
            return (
              <li key={`${r.type}-${r.id}`}>
                {r.to ? (
                  <Link to={r.to}>{content}</Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        {text(
          'Search ranks educational content by relevance. Always confirm important information with a health worker.',
          'Utafutaji unapanga maudhui ya elimu kulingana na umuhimu. Daima thibitisha taarifa muhimu na mhudumu wa afya.',
        )}
      </p>
    </>
  );
}
