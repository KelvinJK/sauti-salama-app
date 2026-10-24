import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
import { moods } from '@/lib/moods';

export function MoodPicker({ value, onChange, disabled = false }: { value: string; onChange: (mood: string) => void; disabled?: boolean }) {
  const text = useAppText();
  return <div role="group" aria-label={text('Mood', 'Hisia')} className="flex max-w-full gap-2 overflow-x-auto py-2">{moods.map(([id, face, en, sw]) => <Button key={id} type="button" disabled={disabled} aria-pressed={value === id} variant={value === id ? 'default' : 'outline'} className="h-20 min-w-24 shrink-0 flex-col gap-1 rounded-lg px-2" onClick={() => onChange(id)}><span aria-hidden="true" className="text-2xl">{face}</span><span className="text-xs">{text(en, sw)}</span></Button>)}</div>;
}