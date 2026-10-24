import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { moods } from '@/lib/moods';
import { MoodFace } from './MoodFace';

export function MoodPicker({ value, onChange, disabled = false }: { value: string; onChange: (mood: string) => void; disabled?: boolean }) {
  const text = useAppText();
  return <div className="relative min-w-0 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:bg-gradient-to-l after:from-background after:to-transparent lg:after:hidden">
    <div role="group" aria-label={text('Mood', 'Hisia')} className="flex max-w-full gap-2 overflow-x-auto py-2 pr-8 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pr-0">{moods.map(([id, en, sw]) => <Button key={id} type="button" disabled={disabled} aria-pressed={value === id} variant={value === id ? 'default' : 'outline'} className="h-24 min-w-24 shrink-0 flex-col gap-1 rounded-lg px-2 lg:min-w-0" onClick={() => onChange(id)}><MoodFace mood={id} /><span className="text-xs">{text(en, sw)}</span></Button>)}</div>
  </div>;
}
