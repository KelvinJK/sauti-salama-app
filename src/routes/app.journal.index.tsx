import { createFileRoute } from '@tanstack/react-router';
import { RecordPage } from '@/components/app/RecordPage';
import { appSeo as seo } from '@/lib/seo';
export const Route = createFileRoute('/app/journal/')({ staticData: { sitemap: false }, head: () => seo('Private health journal', 'A private journal for feelings, notes and questions for your clinician.'), component: () => <RecordPage kind="journal" view="list" title={['Private journal','Shajara binafsi']} subtitle={['A moment for your thoughts, feelings and questions.','Nafasi ya mawazo, hisia na maswali yako.']} /> });
