import { createFileRoute } from '@tanstack/react-router';
import { RecordPage } from '@/components/app/RecordPage';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/growth')({ head: () => seo('Child growth measurements', 'Record child weight and height over time, without clinical interpretation.'), component: () => <RecordPage kind="growth" title={['Growth measurements','Vipimo vya ukuaji']} subtitle={['Record measurements from your child’s visits. Ask a health worker to interpret them.','Rekodi vipimo vya mtoto. Muulize mhudumu wa afya avitafsiri.']} /> });