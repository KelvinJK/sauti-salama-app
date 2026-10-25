import { SITE_URL } from './domains';

export const seo = (title: string, description: string, path?: string) => ({
  meta: [
    { title: `${title} | Sauti Salama` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | Sauti Salama` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(path ? [{ property: 'og:url', content: `${SITE_URL}${path}` }] : []),
  ],
  ...(path ? { links: [{ rel: 'canonical', href: `${SITE_URL}${path}` }] } : {}),
});

export const appSeo = (title: string, description: string) => {
  const head = seo(title, description);
  return { ...head, meta: [...head.meta, { name: 'robots', content: 'noindex,nofollow' }] };
};
