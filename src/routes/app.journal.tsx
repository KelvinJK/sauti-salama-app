import { createFileRoute } from '@tanstack/react-router';
import { RecordPage } from '@/components/app/RecordPage';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/journal')({ validateSearch: (search: Record<string, unknown>): { mood?: string } => typeof search['mood'] === 'string' ? { mood: search['mood'] } : {}, head: () => seo('Private health journal', 'A private journal for feelings, notes and questions for your clinician.'), component: Journal });
function Journal() { const { mood } = Route.useSearch(); return <RecordPage kind="journal" initialMood={mood ?? ''} title={['Private journal','Shajara binafsi']} subtitle={['A moment for your thoughts, feelings and questions.','Nafasi ya mawazo, hisia na maswali yako.']} />; }