import { Link } from '@tanstack/react-router';
import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
export function ComingSoon({ title }: { title?: string }) {
  const text = useAppText();
  return <section className="max-w-xl border-y py-8"><Sprout className="mb-4 size-9 text-teal" /><p className="mb-2 text-sm font-bold text-secondary">{text('Coming soon','Inakuja hivi karibuni')}</p><h2 className="text-xl font-bold">{title ?? text('A little more care is on its way','Huduma zaidi zinakuja')}</h2><p className="my-4 text-muted-foreground">{text('This space is still being prepared. In the meantime, you can read health information or keep a private journal.','Sehemu hii bado inaandaliwa. Kwa sasa, unaweza kusoma taarifa za afya au kuandika shajara binafsi.')}</p><div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/app/learn">{text('Browse information','Soma taarifa')}</Link></Button><Button asChild variant="outline"><Link to="/app/journal">{text('Open journal','Fungua shajara')}</Link></Button></div></section>;
}