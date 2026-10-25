import { createFileRoute } from '@tanstack/react-router';
import { getRouterInstance } from '@tanstack/react-start';
import { articles } from '@/lib/content';
import { SITE_URL } from '@/lib/domains';
import { isSitemapRouteIncluded, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from '@/lib/sitemap';

export const Route = createFileRoute('/sitemap.xml')({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map(path => ({ path }));
        const articleRouteId = '/learn/$slug';
        if (isSitemapRouteIncluded(router.routesById[articleRouteId])) {
          for (const article of articles) {
            const location = router.buildLocation({ to: '/learn/$slug', params: { slug: article.slug }, search: () => ({}), hash: '' });
            const path = sitemapPathForLocation(router, location, articleRouteId);
            if (path) entries.push({ path });
          }
        }
        return new Response(sitemapXML(SITE_URL, entries), {
          headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
        });
      },
    },
  },
});