import { createFileRoute } from '@tanstack/react-router';
import { RecordPage } from '@/components/app/RecordPage';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/journal/new')({ validateSearch: (search: Record<string, unknown>): { mood?: string } => typeof search['mood'] === 'string' ? { mood: search['mood'] } : {}, head: () => seo('New journal entry', 'Write a private journal entry about your feelings, notes and questions.'), component: NewEntry });
function NewEntry() { const { mood } = Route.useSearch(); return <RecordPage kind="journal" view="form" initialMood={mood ?? ''} title={['New entry','Ingizo jipya']} subtitle={['A moment for your thoughts, feelings and questions.','Nafasi ya mawazo, hisia na maswali yako.']} />; }
