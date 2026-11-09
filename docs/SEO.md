# Search engine optimisation

No one can guarantee a top ranking; search engines rank on relevance, quality, trust and links.
This is what the code already does, and what the team needs to do to compete for searches in
Tanzania and East Africa in English and Kiswahili.

## Built into the site

- Unique title, bilingual (English + Kiswahili) description and canonical URL on every public page
- Open Graph and Twitter tags with a 1200x630 share image for WhatsApp, Facebook, X and LinkedIn
- `og:locale` `en_TZ` with `sw_TZ` alternate
- Structured data (JSON-LD): Organization and WebSite (home), Article with Swahili headline (each learn page), FAQPage (FAQ)
- `sitemap.xml` of all public pages and articles; `robots.txt` blocks private app pages, which are also `noindex`
- Server-side rendering, so search engines see full content without running JavaScript
- Mobile-first, fast pages; long-lived caching for build assets

## Team actions (in order)

1. **Google Search Console**: add the domain property `sautisalama.health` (DNS TXT record in Namecheap),
   then submit `https://sautisalama.health/sitemap.xml`. Set nothing under international targeting
   (the `.health` domain is generic; content and links signal the region).
2. **Bing Webmaster Tools**: import from Search Console. Bing also feeds Yahoo, DuckDuckGo and Ecosia.
3. **Google Business Profile**: create a profile for Sauti Salama (service area: Tanzania) with the website link.
4. **Links from trusted sites**: ask partners to link to the site: UNICEF Tanzania, the Ministry of Health,
   NGOs, clinics in the facility directory, universities, women's health groups and local media.
   Health topics are judged strictly on trust, so these links matter more than anything else.
5. **Content in Kiswahili**: write articles that answer what people search, for example
   "dalili za ujauzito", "siku za hatari", "kliniki ya wajawazito", "lishe ya mama mjamzito".
   Keep a clinician review date on each article.
6. **Measure**: check Search Console monthly for queries, clicks and pages with errors.

## Recommended next code change

Kiswahili text is currently switched on in the browser, so search engines index the English version of
each page. Publishing Kiswahili pages at their own URLs (for example `/sw/learn/...`) with `hreflang`
links would let Kiswahili searches find Kiswahili pages directly.
