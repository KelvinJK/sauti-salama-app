import { createFileRoute } from '@tanstack/react-router';
import { CareDirectory } from './app.care';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/find-care')({ head: () => seo('Verified facility search', 'Search verified Tanzania facilities by district and available services.'), component: CareDirectory });