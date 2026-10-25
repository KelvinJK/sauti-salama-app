import { describe, expect, it } from 'vitest';
import { domainHref, productionRedirect } from '@/lib/domains';

describe('Production domain split', () => {
  it.each(['sautisalama.health', 'www.sautisalama.health'])('permanently redirects %s app paths with their query', host => {
    const response = productionRedirect(new Request('http://internal/app/journal/new?mood=calm&x=1', { headers: { host } }));
    expect(response?.status).toBe(308);
    expect(response?.headers.get('location')).toBe('https://app.sautisalama.health/app/journal/new?mood=calm&x=1');
  });
  it('redirects the app root to the welcome page', () => {
    const response = productionRedirect(new Request('https://app.sautisalama.health/?next=care'));
    expect(response?.status).toBe(308);
    expect(response?.headers.get('location')).toBe('https://app.sautisalama.health/app?next=care');
  });
  it.each(['sauti-salama-app.lovable.app', 'preview.vercel.app', 'localhost:8080', 'app.sautisalama.health.evil.test'])('does not redirect other host %s', host => {
    expect(productionRedirect(new Request('http://internal/app?x=1', { headers: { host } }))).toBeUndefined();
    expect(productionRedirect(new Request('http://internal/', { headers: { host } }))).toBeUndefined();
  });
  it('leaves public website pages and app deep links alone', () => {
    expect(productionRedirect(new Request('https://sautisalama.health/learn'))).toBeUndefined();
    expect(productionRedirect(new Request('https://app.sautisalama.health/app/home'))).toBeUndefined();
  });
  it.each(['sautisalama.health', 'www.sautisalama.health', 'app.sautisalama.health'])('uses cross-domain destinations on production host %s', host => {
    expect(domainHref('/app', 'app', host)).toBe('https://app.sautisalama.health/app');
    expect(domainHref('/', 'site', host)).toBe('https://sautisalama.health/');
    expect(domainHref('/privacy', 'site', host)).toBe('https://sautisalama.health/privacy');
    expect(domainHref('/terms', 'site', host)).toBe('https://sautisalama.health/terms');
  });
  it('keeps preview links relative', () => {
    expect(domainHref('/app', 'app', 'localhost')).toBe('/app');
    expect(domainHref('/privacy', 'site', 'preview.vercel.app')).toBe('/privacy');
  });
});