import { describe, expect, it } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { sitemapStaticPaths, isSitemapRouteIncluded } from '@/lib/sitemap';
import { appSeo, seo } from '@/lib/seo';
import manifest from '../../public/manifest.webmanifest?raw';

describe('Domain visibility and install scope', () => {
  it('starts the installed app at /app and scopes it to /app/', () => {
    const data = JSON.parse(manifest);
    expect(data.start_url).toBe('/app');
    expect(data.scope).toBe('/app/');
  });
  it('uses the website domain for public canonicals', () => {
    expect(seo('Privacy', 'Privacy details', '/privacy').links?.[0]?.href).toBe('https://sautisalama.health/privacy');
  });
  it('marks app pages noindex,nofollow', () => {
    expect(appSeo('Journal', 'Private entries').meta.find(meta => 'name' in meta && meta.name === 'robots')?.content).toBe('noindex,nofollow');
  });
  it('includes public pages and excludes all personal and auth pages from the sitemap', () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(sitemapStaticPaths(router)).toEqual(['/', '/about', '/accessibility', '/contact', '/faq', '/features', '/find-care', '/how-it-works', '/learn', '/partners', '/privacy', '/terms']);
    for (const route of Object.values(router.routesById)) {
      if (route.fullPath.startsWith('/app') || ['/auth', '/reset-password'].includes(route.fullPath)) {
        expect(isSitemapRouteIncluded(route)).toBe(false);
      }
    }
    expect(isSitemapRouteIncluded(router.routesById['/learn/$slug'])).toBe(true);
  });
});