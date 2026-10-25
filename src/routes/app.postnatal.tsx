import { createFileRoute } from '@tanstack/react-router';
import { RecordPage } from '@/components/app/RecordPage';
import { appSeo as seo } from '@/lib/seo';
export const Route = createFileRoute('/app/postnatal')({ staticData: { sitemap: false }, head: () => seo('Postnatal care notes', 'Record recovery notes and follow-up appointments after birth.'), component: () => <RecordPage kind="postnatal" title={['Postnatal care','Huduma baada ya kujifungua']} subtitle={['Your recovery notes and follow-up appointments.','Maelezo ya kupona na miadi ya ufuatiliaji.']} /> });