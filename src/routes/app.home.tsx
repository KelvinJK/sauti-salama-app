import { createFileRoute, Link } from '@tanstack/react-router';
import { BookOpen, CalendarHeart, Baby, Sprout, Salad, NotebookPen, MessageCircle, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import mascot from '@/assets/mascot.png';
import { useI18n } from '@/lib/i18n';
import { useAppText } from '@/lib/app-copy';
import { useAppAuth } from '@/components/app/AuthProvider';
import { seo } from '@/lib/seo';
const modules = [
  {to:'/app/learn', k:'f1', icon:BookOpen, bg:'bg-lavender'},
  {to:'/app/cycle', k:'f2', icon:CalendarHeart, bg:'bg-pink'},
  {to:'/app/pregnancy', k:'f3', icon:Baby, bg:'bg-peach'},
  {to:'/app/children', k:'f4', icon:Sprout, bg:'bg-mint'},
  {to:'/app/nutrition', k:'f5', icon:Salad, bg:'bg-peach'},
  {to:'/app/journal', k:'f6', icon:NotebookPen, bg:'bg-lavender'},
] as const;
export const Route = createFileRoute('/app/home')({ head: () => seo('My wellbeing dashboard', 'Your SautiSalama health education and private wellbeing tools.'), component: Home });
function Home() { const text = useAppText(); const { t } = useI18n(); const { user } = useAppAuth();
  return <><section className="relative mb-9 flex items-center justify-between gap-3 border-b pb-8"><div><p className="mb-3 text-sm font-semibold text-secondary">{text('A little care, every day', 'Jali afya yako kila siku')}</p><h1 className="text-3xl font-extrabold text-plum">{text('Karibu, welcome back', 'Karibu tena')}</h1><p className="mt-3 max-w-lg text-muted-foreground">{text('How are you feeling today?', 'Unajisikiaje leo?')}</p><span className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4" />{text(user ? 'Your private space' : 'Guest mode · no personal records stored', user ? 'Nafasi yako binafsi' : 'Hali ya mgeni · hakuna kumbukumbu zinazohifadhiwa')}</span></div><img src={mascot} alt="" className="h-28 w-28 shrink-0 object-contain sm:h-40 sm:w-40" /></section>
    <h2 className="mb-5 text-xl font-bold">{text('Your health & wellbeing', 'Afya na ustawi wako')}</h2><div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">{modules.map(({to,k,icon:Icon,bg}) => <Link key={to} to={to} className="group flex min-h-44 flex-col rounded-lg border bg-card p-4 shadow-emboss transition-colors hover:border-primary sm:p-5"><span className={`grid h-12 w-12 place-items-center rounded-xl ${bg}`}><Icon className="h-6 w-6 text-primary" /></span><h3 className="mt-5 break-words text-base font-bold leading-snug">{t(k)}</h3><ArrowUpRight className="ml-auto mt-3 h-4 w-4 text-muted-foreground" /></Link>)}</div>
    <div className="mt-7 grid gap-4 lg:grid-cols-2"><Link to="/app/assistant" className="flex items-center gap-4 rounded-lg bg-plum p-5 text-plum-foreground"><MessageCircle className="h-7 w-7 shrink-0 text-secondary" /><span className="font-bold">{text('Ask a Private Health Question', 'Uliza swali la afya kwa faragha')}</span><ArrowUpRight className="ml-auto shrink-0" /></Link><Link to="/app/care" className="flex items-center gap-4 rounded-lg border bg-mint p-5"><MapPin className="h-7 w-7 shrink-0 text-teal" /><span className="font-bold">{text('Find Verified Healthcare Services', 'Tafuta huduma za afya zilizothibitishwa')}</span><ArrowUpRight className="ml-auto shrink-0" /></Link></div>
    <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{t('disclaimer')}</p>
  </>;
}