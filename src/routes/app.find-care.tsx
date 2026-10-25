import { createFileRoute } from '@tanstack/react-router';
import { CareDirectory } from './app.care';
import { appSeo as seo } from '@/lib/seo';
export const Route = createFileRoute('/app/find-care')({ staticData: { sitemap: false }, head: () => seo('Verified facility search', 'Search verified Tanzania facilities by district and available services.'), component: CareDirectory });