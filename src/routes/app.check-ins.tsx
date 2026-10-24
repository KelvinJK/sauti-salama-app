import { createFileRoute } from '@tanstack/react-router';
import { PageTitle } from '@/components/app/AppShell';
import { TrackTabs } from '@/components/app/TrackTabs';
import { MoodCheckIn } from '@/components/app/MoodCheckIn';
import { useAppText } from '@/lib/app-copy';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app/check-ins')({ head: () => seo('Mood check-ins', 'Your private daily mood check-ins and history.'), component: CheckIns });
function CheckIns() { const text = useAppText(); return <><TrackTabs /><PageTitle title={text('Check-ins','Hisia za kila siku')} sub={text('How are you feeling today?','Unajisikiaje leo?')} /><MoodCheckIn history /></>; }