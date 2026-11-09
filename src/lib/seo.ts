import { SITE_URL } from './domains';

export const SITE_NAME = 'Sauti Salama';
/** 1200x630 social share image (WhatsApp, Facebook, X, LinkedIn previews). */
export const SHARE_IMAGE = `${SITE_URL}/og-image.jpg`;

type JsonLd = Record<string, unknown>;
type SeoOptions = {
  /** Kiswahili description appended so Swahili searches match the page. */
  sw?: string;
  type?: 'website' | 'article';
  /** Structured data (schema.org) rendered as JSON-LD. */
  jsonLd?: JsonLd | JsonLd[];
};

/** Serialise JSON-LD safely for an inline <script>. */
const ldScript = (data: JsonLd | JsonLd[]) => ({
  type: 'application/ld+json',
  children: JSON.stringify(data).replace(/</g, '\\u003c'),
});

export const seo = (title: string, description: string, path?: string, options: SeoOptions = {}) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const fullDescription = options.sw ? `${description} ${options.sw}` : description;
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: fullDescription },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: fullDescription },
      { property: 'og:type', content: options.type ?? 'website' },
      { property: 'og:locale', content: 'en_TZ' },
      { property: 'og:locale:alternate', content: 'sw_TZ' },
      { property: 'og:image', content: SHARE_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Sauti Salama: women\'s and family health in English and Kiswahili' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: SHARE_IMAGE },
      ...(path ? [{ property: 'og:url', content: `${SITE_URL}${path}` }] : []),
    ],
    ...(path ? { links: [{ rel: 'canonical', href: `${SITE_URL}${path}` }] } : {}),
    ...(options.jsonLd ? { scripts: [ldScript(options.jsonLd)] } : {}),
  };
};

export const appSeo = (title: string, description: string) => {
  const head = seo(title, description);
  return { ...head, meta: [...head.meta, { name: 'robots', content: 'noindex,nofollow' }] };
};

/** Organisation and website identity, used on the home page. */
export const organizationJsonLd: JsonLd[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    email: 'sautisalamatanzania@gmail.com',
    areaServed: [
      { '@type': 'Country', name: 'Tanzania' },
      { '@type': 'Place', name: 'East Africa' },
    ],
    knowsLanguage: ['en', 'sw'],
    sameAs: ['https://github.com/KelvinJK/sauti-salama-app'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: 'Sauti Salama Tanzania',
    url: `${SITE_URL}/`,
    inLanguage: ['en', 'sw'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  },
];
