import { createFileRoute } from '@tanstack/react-router';
import { RecordPage } from '@/components/app/RecordPage';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/cycle')({ head: () => seo('Menstrual calendar & daily log', 'Privately record periods, symptoms and mood. No fertility or diagnostic predictions.'), component: () => <RecordPage kind="cycle" title={['Cycle tracking','Kufuatilia mzunguko']} subtitle={['Your menstrual calendar, symptoms and mood.','Kalenda yako ya hedhi, dalili na hisia.']} /> });