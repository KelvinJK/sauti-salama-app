import { createFileRoute, Link } from '@tanstack/react-router';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import mascot from '@/assets/mascot.png';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useAppText } from '@/lib/app-copy';
import { appSeo as seo } from '@/lib/seo';
export const Route = createFileRoute('/app/')({ staticData: { sitemap: false }, head: () => seo('Welcome to your private health space', 'Choose your language and enter SautiSalama as a guest or registered adult.'), component: Welcome });
function Welcome() {
  const text = useAppText(); const { lang, setLang } = useI18n();
  return <div className="mx-auto max-w-xl py-5 text-center"><img src={mascot} alt="" className="mx-auto h-40 w-40 object-contain" /><p className="mt-5 text-sm font-bold text-secondary">{text('Karibu · Welcome', 'Karibu · Welcome')}</p><h1 className="mt-3 text-4xl font-extrabold text-plum">SautiSalama</h1><p className="mt-5 text-lg text-muted-foreground">{text('A space for your health, your voice and your family.', 'Nafasi ya afya yako, sauti yako na familia yako.')}</p><div className="my-7 flex justify-center gap-3" role="group" aria-label={text('Language', 'Lugha')}><Button variant={lang === 'sw' ? 'default' : 'outline'} onClick={() => setLang('sw')}>Kiswahili</Button><Button variant={lang === 'en' ? 'default' : 'outline'} onClick={() => setLang('en')}>English</Button></div><div className="mx-auto flex max-w-sm flex-col gap-3"><Button asChild className="h-12"><Link to="/auth">{text('Create your private space', 'Unda nafasi yako binafsi')}<ArrowRight /></Link></Button><Button asChild variant="outline" className="h-12"><Link to="/app/home">{text('Continue as guest', 'Endelea kama mgeni')}</Link></Button></div><p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4" />{text('Accounts for adults 18+ · Public education for everyone', 'Akaunti kwa watu wazima 18+ · Elimu kwa wote')}</p></div>;
}