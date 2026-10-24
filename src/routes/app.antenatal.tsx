import { createFileRoute } from '@tanstack/react-router';
import { RecordPage } from '@/components/app/RecordPage';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/antenatal')({ head: () => seo('Antenatal visit planner', 'Keep your planned antenatal visits and questions in one private place.'), component: () => <RecordPage kind="antenatal" title={['Antenatal planner','Mpango wa kliniki ya wajawazito']} subtitle={['Record appointments agreed with your health worker.','Rekodi miadi uliyopanga na mhudumu wa afya.']} /> });