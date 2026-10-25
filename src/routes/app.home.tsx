import { createFileRoute, Link } from '@tanstack/react-router';
import { BookOpen, CalendarHeart, Baby, Sprout, Salad, NotebookPen, MessageCircle, MapPin, ChevronRight, ShieldCheck } from 'lucide-react';
import mascot from '@/assets/mascot.png';
import { useI18n } from '@/lib/i18n';
import { useAppText } from '@/lib/app-copy';
import { useAppAuth } from '@/components/app/AuthProvider';
import { appSeo as seo } from '@/lib/seo';
import { MoodCheckIn } from '@/components/app/MoodCheckIn';
const modules = [
  {to:'/app/learn', k:'f1', icon:BookOpen, bg:'bg-lavender'},
  {to:'/app/cycle', k:'f2', icon:CalendarHeart, bg:'bg-pink'},
  {to:'/app/pregnancy', k:'f3', icon:Baby, bg:'bg-peach'},
  {to:'/app/growth', k:'f4', icon:Sprout, bg:'bg-mint'},
  {to:'/app/nutrition', k:'f5', icon:Salad, bg:'bg-peach'},
  {to:'/app/journal', k:'f6', icon:NotebookPen, bg:'bg-lavender'},
] as const;
export const Route = createFileRoute('/app/home')({ staticData: { sitemap: false }, head: () => seo('My wellbeing dashboard', 'Your Sauti Salama health education and private wellbeing tools.'), component: Home });
function Home() { const text = useAppText(); const { t } = useI18n(); const { user } = useAppAuth();
  return <><section className="relative mb-9 min-w-0 border-b pb-8"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="mb-3 text-sm font-semibold text-secondary">{text('A little care, every day', 'Jali afya yako kila siku')}</p><h1 className="text-3xl font-extrabold text-plum dark:text-foreground">{text('Karibu, welcome back', 'Karibu tena')}</h1><p className="mt-3 max-w-lg text-muted-foreground">{text('How are you feeling today?', 'Unajisikiaje leo?')}</p></div><img src={mascot} alt="" className="h-24 w-24 shrink-0 object-contain sm:h-36 sm:w-36" /></div><MoodCheckIn /><span className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0" />{text(user ? 'Your private space' : 'Guest mode · records stay on this device only', user ? 'Nafasi yako binafsi' : 'Hali ya mgeni · kumbukumbu zinabaki kwenye kifaa hiki tu')}</span></section>
    <h2 className="mb-5 text-xl font-bold">{text('Your health & wellbeing', 'Afya na ustawi wako')}</h2><div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">{modules.map(({to,k,icon:Icon,bg}) => { const soon = k === 'f3' || k === 'f5'; const inner = <><span className={`grid h-12 w-12 place-items-center rounded-xl ${bg}`}><Icon className="h-6 w-6 text-primary" /></span><h3 className="mt-5 break-words text-base font-bold leading-snug">{t(k)}</h3>{soon && <span className="mt-2 text-xs font-bold text-secondary">{text('Coming soon','Inakuja hivi karibuni')}</span>}{!soon && <ChevronRight className="ml-auto mt-auto h-5 w-5 text-muted-foreground" />}</>; return soon ? <div key={to} aria-disabled="true" className="flex min-h-44 cursor-not-allowed flex-col rounded-lg border bg-card p-4 opacity-60 sm:p-5">{inner}</div> : <Link key={to} to={to} className="group flex min-h-44 flex-col rounded-lg border bg-card p-4 shadow-emboss transition-colors hover:border-primary sm:p-5">{inner}</Link>; })}</div>
    <div className="mt-7 grid gap-4 lg:grid-cols-2"><div aria-disabled="true" className="flex cursor-not-allowed items-center gap-4 rounded-lg border bg-card p-5 opacity-60"><MessageCircle className="h-7 w-7 shrink-0 text-primary" /><span className="font-bold">{text('Ask a private health question', 'Uliza swali la afya kwa faragha')}<span className="mt-1 block text-xs font-bold text-secondary">{text('Coming soon','Inakuja hivi karibuni')}</span></span></div><Link to="/app/find-care" className="flex items-center gap-4 rounded-lg border bg-mint p-5"><MapPin className="h-7 w-7 shrink-0 text-teal" /><span className="font-bold">{text('Find verified healthcare services', 'Tafuta huduma za afya zilizothibitishwa')}</span><ChevronRight className="ml-auto shrink-0" /></Link></div>
    <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{t('disclaimer')}</p>
  </>;
}