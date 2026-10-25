import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, MapPin, ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo-mark.png";
import { useI18n, type Lang } from "@/lib/i18n";
import { ThemeToggle } from '@/components/ThemeProvider';
import { DomainLink } from '@/components/DomainLink';
import { Button } from '@/components/ui/button';
import { SocialIcons } from './SocialIcons';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Sauti Salama home">
      <img src={logo} alt="" width={40} height={24} className="h-6 w-auto" />
      <span className="text-lg font-extrabold tracking-tight text-plum dark:text-foreground">
        Sauti{" "}<span className="text-secondary">Salama</span>
      </span>
    </Link>
  );
}

export function LangToggle() {
  const { lang, setLang } = useI18n();
  const opts: { v: Lang; l: string }[] = [
    { v: "sw", l: "SW" },
    { v: "en", l: "EN" },
  ];
  return (
    <div role="group" aria-label="Language" className="flex rounded-full bg-accent p-1">
      {opts.map((o) => (
        <Button variant="ghost"
          key={o.v}
          onClick={() => setLang(o.v)}
          aria-pressed={lang === o.v}
          className={`rounded-full px-3 py-1 text-xs font-bold transition ${lang === o.v ? "bg-card text-primary shadow-emboss" : "text-muted-foreground"}`}
        >
          {o.l}
        </Button>
      ))}
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/features", l: t("nav_features") },
    { to: "/how-it-works", l: t("nav_how") },
    { to: "/learn", l: t("nav_learn") },
    { to: "/find-care", l: t("nav_care") },
    { to: "/faq", l: t("nav_faq") },
  ] as const;
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-semibold text-muted-foreground hover:text-primary" activeProps={{ className: "text-primary" }}>
              {l.l}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle className="size-10 rounded-full !px-0" />
          <DomainLink destination="app" to="/app" className="btn-primary hidden !py-2.5 text-sm sm:inline-flex">{t("open_app")}</DomainLink>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="container-page flex flex-col gap-1 pb-4 lg:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-semibold hover:bg-accent">
              {l.l}
            </Link>
          ))}
          <DomainLink destination="app" to="/app" onClick={() => setOpen(false)} className="btn-primary mt-2">{t("open_app")}</DomainLink>
          <div className="mt-2 flex items-center justify-between px-3">
            <LangToggle />
            <ThemeToggle className="size-10 rounded-full !px-0" />
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const { t, lang } = useI18n();
  const label = (en: string, sw: string) => lang === 'en' ? en : sw;
  const cols = [
    [
      { to: "/about", l: label("About us", "Kuhusu sisi") },
      { to: "/features", l: t("nav_features") },
      { to: "/how-it-works", l: t("nav_how") },
      { to: "/partners", l: label("Partners", "Washirika") },
    ],
    [
      { to: "/learn", l: t("nav_learn") },
      { to: "/find-care", l: t("nav_care") },
      { to: "/faq", l: t("nav_faq") },
      { to: "/contact", l: label("Contact", "Wasiliana nasi") },
    ],
    [
      { to: "/privacy", l: label("Privacy policy", "Sera ya faragha") },
      { to: "/terms", l: label("Terms and conditions", "Vigezo na masharti") },
      { to: "/data-protection", l: label("Data protection policy", "Sera ya ulinzi wa data") },
      { to: "/accessibility", l: label("Accessibility", "Ufikivu") },
    ],
  ] as const;
  return (
    <footer className="site-footer relative isolate mt-20 overflow-hidden bg-footer text-footer-foreground">
      <img src={logo} alt="" aria-hidden="true" className="footer-watermark pointer-events-none absolute -right-12 bottom-16 -z-10 w-[420px] max-w-none select-none sm:w-[580px]" />
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="col-span-2 space-y-5 md:col-span-1">
          <Link to="/" className="inline-flex items-center gap-3" aria-label={label('Sauti Salama home', 'Sauti Salama mwanzo')}>
            <span className="grid h-12 w-16 place-items-center rounded-lg bg-logo-surface"><img src={logo} alt="" width={52} height={32} className="w-12" /></span>
            <span className="text-xl font-extrabold">Sauti <span className="text-footer-accent">Salama</span></span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-footer-muted">{t("positioning")}</p>
          <a href="https://maps.app.goo.gl/54UWyBLi3qX3Mhb29" target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-sm text-footer-muted hover:text-footer-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-footer-accent" /><span>{label('Our office', 'Ofisi yetu')}<span className="mt-1 block font-semibold text-footer-foreground">Dar es Salaam, Tanzania</span></span><ArrowUpRight className="size-4" />
          </a>
          <SocialIcons />
        </div>
        {cols.map((c, i) => (
          <div key={i} className={i === 2 ? 'col-span-2 md:col-span-1' : ''}>
          <h2 className="mb-5 text-sm font-bold">{[label('Sauti Salama', 'Sauti Salama'), label('Explore', 'Gundua'), label('Policies & trust', 'Sera na uaminifu')][i]}</h2>
          <ul className="space-y-3 text-sm">
            {c.map((l) => (
              <li key={l.to}><Link to={l.to} className="text-footer-muted underline-offset-4 hover:text-footer-foreground hover:underline">{l.l}</Link></li>
            ))}
          </ul>
          </div>
        ))}
      </div>
      <div className="container-page flex flex-wrap items-center justify-between gap-6 border-t border-footer-border py-7 text-xs text-footer-muted">
        <div>
          <p className="max-w-3xl leading-relaxed">{t("disclaimer")}</p>
          <p className="mt-2">© {new Date().getFullYear()} Sauti Salama. {t("footer_rights")}</p>
        </div>
        <LangToggle />
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-site flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({ title, sub }: { title: string; sub?: string | undefined }) {
  return (
    <section className="site-page-heading border-b border-border bg-site-surface">
      <div className="container-page py-16 md:py-20">
        <span aria-hidden="true" className="mb-6 block h-1 w-12 rounded-full bg-secondary" />
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-plum dark:text-foreground md:text-5xl">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{sub}</p>}
      </div>
    </section>
  );
}
