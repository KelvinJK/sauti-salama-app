import { createFileRoute } from '@tanstack/react-router';
import { RecordPage } from '@/components/app/RecordPage';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/children')({ head: () => seo('Child profiles', 'Keep private child profiles and link their growth measurements.'), component: () => <RecordPage kind="child" title={['Child profiles','Wasifu wa watoto']} subtitle={['A private record for each child in your care.','Kumbukumbu binafsi kwa kila mtoto unayemlea.']} /> });