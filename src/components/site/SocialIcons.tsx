import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

const socials = [
  { name: 'Instagram', path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z', extra: <><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r=".7" /></> },
  { name: 'Facebook', path: 'M14 22V13h3l.5-4H14V7c0-1 .4-2 2-2h2V2h-3c-3 0-5 2-5 5v2H7v4h3v9', extra: null },
  { name: 'LinkedIn', path: 'M3 9h4v12H3V9Zm8 12V9h4v2c1-3 6-3 6 2v8h-4v-7c0-2-2-2-2 0v7h-4Z', extra: <circle cx="5" cy="4.5" r="2" /> },
];

export function SocialIcons() {
  const { lang } = useI18n();
  return <div className="flex gap-2" aria-label={lang === 'en' ? 'Social media' : 'Mitandao ya kijamii'}>
    {socials.map(({ name, path, extra }) => <span key={name} title={`${name} — ${lang === 'en' ? 'link coming soon' : 'kiungo kinakuja'}`}>
      <Button variant="ghost" size="icon" disabled aria-label={`${name} — ${lang === 'en' ? 'link coming soon' : 'kiungo kinakuja'}`} className="size-10 rounded-full border border-footer-border text-footer-foreground disabled:opacity-70">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} />{extra}</svg>
      </Button>
    </span>)}
  </div>;
}