export const SITE_URL = 'https://sautisalama.health';
export const APP_URL = 'https://app.sautisalama.health';

export function isProductionHost(host: string): boolean {
  return ['sautisalama.health', 'www.sautisalama.health', 'app.sautisalama.health'].includes(host.toLowerCase().split(':')[0] ?? '');
}

export function domainHref(path: string, destination: 'site' | 'app', host: string): string {
  return isProductionHost(host) ? `${destination === 'app' ? APP_URL : SITE_URL}${path}` : path;
}

// Read only Host (not client-supplied forwarded headers). Fixed destinations
// prevent Host-header injection from creating an open redirect.
export function productionRedirect(request: Request): Response | undefined {
  const url = new URL(request.url);
  const host = (request.headers.get('host') ?? url.host).toLowerCase().split(':')[0];
  if ((host === 'sautisalama.health' || host === 'www.sautisalama.health') && url.pathname.startsWith('/app')) {
    return Response.redirect(`${APP_URL}${url.pathname}${url.search}`, 308);
  }
  if (host === 'app.sautisalama.health' && url.pathname === '/') {
    return Response.redirect(`${APP_URL}/app${url.search}`, 308);
  }
  return undefined;
}