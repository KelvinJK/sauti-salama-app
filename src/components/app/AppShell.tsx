import { DomainLink } from '@/components/DomainLink';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, BookOpen, CalendarHeart, MapPin, Menu, Shield, UserRound, Heart } from 'lucide-react';
import type { ReactNode } from 'react';
import logo from '@/assets/logo-mark.png';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useAppText } from '@/lib/app-copy';
import { useAppAuth } from './AuthProvider';
import { ThemeToggle } from '@/components/ThemeProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { QuickExit } from './Safety';

const tabs = [
  { to: '/app/home', en: 'Home', sw: 'Nyumbani', icon: Home },
  { to: '/app/learn', en: 'Learn', sw: 'Jifunze', icon: BookOpen },
  { to: '/app/cycle', en: 'Track', sw: 'Fuatilia', icon: CalendarHeart },
  { to: '/app/care', en: 'Care', sw: 'Huduma', icon: MapPin },
  { to: '/app/menu', en: 'Menu', sw: 'Menyu', icon: Menu },
] as const;
export function AppShell({ children }: { children: ReactNode }) {
  const text = useAppText();
  const { user } = useAppAuth();
  const { pathname } = useLocation();
  const welcome = pathname === '/app' || pathname === '/app/';
  const tracking = ['/app/cycle', '/app/journal', '/app/check-ins'].some(p => pathname.startsWith(p));
  const quickExit = tracking || pathname === '/app/assistant' || pathname === '/app/home';
  return <div className="min-h-screen bg-background">
    <a href="#app-main" className="sr-only focus:not-sr-only">{text('Skip to content', 'Ruka kwenda maudhui')}</a>
    <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center justify-between gap-2 border-b bg-card px-5 py-3 md:px-8">
      <Link to="/app/home" className="flex items-center gap-2"><img src={logo} alt="" className="h-11 w-11 object-contain" /><span className="font-display text-xl font-extrabold text-primary">SautiSalama</span></Link>
      <div className="flex flex-wrap items-center gap-2">{!welcome && quickExit && <QuickExit />}<ThemeToggle className="min-h-11 min-w-11 rounded-lg" />{!welcome && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button asChild variant="outline" size="icon" className="min-h-11 min-w-11"><Link to="/app/profile" aria-label={text('Profile', 'Wasifu')}><UserRound /></Link></Button></TooltipTrigger><TooltipContent>{text('Profile', 'Wasifu')}</TooltipContent></Tooltip></TooltipProvider>}</div>
    </header>
    {!welcome && <aside className="fixed bottom-0 left-0 top-20 hidden w-60 flex-col border-r bg-card p-5 md:flex">
      <p className="mb-5 px-3 text-xs font-bold uppercase text-muted-foreground">{text('My wellbeing', 'Ustawi wangu')}</p>
      <nav aria-label={text('App navigation', 'Urambazaji wa programu')} className="space-y-2">{tabs.map(({ to, en, sw, icon: Icon }) => <Button key={to} asChild variant={pathname === to || (to === '/app/cycle' && tracking) ? 'default' : 'ghost'} className="h-12 w-full justify-start"><Link to={to} aria-current={pathname === to || (to === '/app/cycle' && tracking) ? 'page' : undefined}><Icon />{text(en, sw)}</Link></Button>)}</nav>
      <div className="mt-auto space-y-4 px-3"><Heart className="text-secondary" /><p className="text-sm font-semibold">{text('Your health. Your voice.', 'Afya yako. Sauti yako.')}</p><DomainLink destination="site" to="/privacy" className="flex items-center gap-2 text-xs text-muted-foreground"><Shield className="h-4 w-4" />{text('Privacy & safety', 'Faragha na usalama')}</DomainLink><DomainLink destination="site" to="/" className="block text-xs text-primary">{text('SautiSalama website', 'Tovuti ya SautiSalama')}</DomainLink></div>
    </aside>}
    <main id="app-main" className={`mx-auto max-w-7xl px-5 pt-8 md:px-10 ${welcome ? 'pb-10' : 'pb-28 md:ml-60 md:pb-10'}`}>{children}</main>
    {!welcome && <nav aria-label={text('Main tabs', 'Vichupo vikuu')} className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden">{tabs.map(({ to, en, sw, icon: Icon }) => <Button key={to} asChild variant="ghost" className={`h-20 flex-col gap-1 rounded-none px-1 text-xs ${pathname === to || (to === '/app/cycle' && tracking) ? 'bg-accent text-primary' : 'text-muted-foreground'}`}><Link to={to} aria-current={pathname === to || (to === '/app/cycle' && tracking) ? 'page' : undefined}><Icon className="!size-5" /><span>{text(en, sw)}</span></Link></Button>)}</nav>}
  </div>;
}
export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return <div className="mb-8"><h1 className="font-display text-3xl font-extrabold text-plum dark:text-foreground">{title}</h1>{sub && <p className="mt-3 max-w-2xl text-muted-foreground">{sub}</p>}</div>;
}