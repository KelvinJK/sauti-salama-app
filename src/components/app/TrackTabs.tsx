import { Link, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAppText } from '@/lib/app-copy';
export function TrackTabs() {
  const { pathname } = useLocation(); const text = useAppText();
  return <nav aria-label={text('Track views','Mitazamo ya ufuatiliaji')} className="mb-6 grid max-w-lg grid-cols-3 rounded-lg bg-muted p-1">{([['/app/cycle','Cycle','Mzunguko'],['/app/journal','Journal','Shajara'],['/app/check-ins','Check-ins','Hisia']] as const).map(([to,en,sw]) => <Button key={to} asChild variant={pathname.startsWith(to) ? 'default' : 'ghost'} className="h-11 min-w-0 px-2"><Link to={to} aria-current={pathname.startsWith(to) ? 'page' : undefined}>{text(en,sw)}</Link></Button>)}</nav>;
}