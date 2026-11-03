import { articles, faqs } from './content';
import { pregnancyWeeks } from './pregnancy-content';
import type { Lang } from './i18n';
import type { Facility } from './facilities';
import { facilityServiceCopy } from './facilities';

export type SearchResultType = 'article' | 'pregnancy' | 'facility' | 'faq';

export type SearchResult = {
  type: SearchResultType;
  id: string;
  title: string;
  snippet: string;
  score: number;
  to?: string;
  meta?: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\sà-ſ]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function scoreText(queryTokens: string[], text: string, weight = 1): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for (const token of queryTokens) {
    if (lower.includes(token)) score += 2 * weight;
    if (lower.split(/\s+/).includes(token)) score += 3 * weight;
  }
  // Phrase bonus
  const phrase = queryTokens.join(' ');
  if (phrase.length > 4 && lower.includes(phrase)) score += 5 * weight;
  return score;
}

export function searchContent(
  query: string,
  lang: Lang,
  facilities: Facility[] = [],
): SearchResult[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const queryTokens = tokenize(q);
  if (queryTokens.length === 0) return [];

  const results: SearchResult[] = [];

  // Articles
  for (const a of articles) {
    const title = a.title[lang];
    const summary = a.summary[lang];
    const body = a.body[lang].join(' ');
    let score =
      scoreText(queryTokens, title, 4) +
      scoreText(queryTokens, summary, 2) +
      scoreText(queryTokens, body, 1);
    if (score > 0) {
      results.push({
        type: 'article',
        id: a.slug,
        title,
        snippet: summary,
        score,
        to: `/learn/${a.slug}`,
        meta: a.topic,
      });
    }
  }

  // Pregnancy weeks
  for (const w of pregnancyWeeks) {
    const title = w.title[lang];
    const summary = w.summary[lang];
    const tips = w.tips[lang].join(' ');
    let score =
      scoreText(queryTokens, title, 4) +
      scoreText(queryTokens, summary, 2) +
      scoreText(queryTokens, tips, 1) +
      scoreText(queryTokens, `week ${w.week} wiki ${w.week}`, 3);
    if (score > 0) {
      results.push({
        type: 'pregnancy',
        id: `week-${w.week}`,
        title,
        snippet: summary,
        score,
        to: '/app/pregnancy',
        meta: `Week ${w.week}`,
      });
    }
  }

  // Facilities
  for (const f of facilities) {
    const services = f.services
      .map((s) => facilityServiceCopy[s]?.[lang] ?? s)
      .join(' ');
    const text = `${f.name} ${f.district} ${f.region} ${f.address ?? ''} ${services}`;
    const score = scoreText(queryTokens, text, 2);
    if (score > 0) {
      results.push({
        type: 'facility',
        id: f.id,
        title: f.name,
        snippet: `${f.district}, ${f.region}${f.address ? ` — ${f.address}` : ''}`,
        score,
        to: '/app/find-care',
        meta: f.district,
      });
    }
  }

  // FAQs
  for (const faq of faqs) {
    const question = faq.q[lang];
    const answer = faq.a[lang];
    const score = scoreText(queryTokens, question, 3) + scoreText(queryTokens, answer, 1);
    if (score > 0) {
      results.push({
        type: 'faq',
        id: question.slice(0, 40),
        title: question,
        snippet: answer,
        score,
        meta: 'FAQ',
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}
