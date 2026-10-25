import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-mark.png";
import { useI18n, type Lang } from "@/lib/i18n";
import { ThemeToggle } from '@/components/ThemeProvider';
import { DomainLink } from '@/components/DomainLink';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="SautiSalama home">
      <img src={logo} alt="" width={40} height={24} className="h-6 w-auto" />
      <span className="text-lg font-extrabold tracking-tight text-plum dark:text-foreground">
        Sauti<span className="text-secondary">Salama</span>
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
        <button
          key={o.v}
          onClick={() => setLang(o.v)}
          aria-pressed={lang === o.v}
          className={`rounded-full px-3 py-1 text-xs font-bold transition ${lang === o.v ? "bg-card text-primary shadow-emboss" : "text-muted-foreground"}`}
        >
          {o.l}
        </button>
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
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
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
  const { t } = useI18n();
  return (
  <footer className="mt-24 bg-plum text-plum-foreground">
    [
      { to: "/about", l: "About" },
      { to: "/features", l: t("nav_features") },
      { to: "/how-it-works", l: t("nav_how") },
      { to: "/partners", l: "Partners" },
    ],
    [
      { to: "/learn", l: t("nav_learn") },
      { to: "/find-care", l: t("nav_care") },
      { to: "/faq", l: t("nav_faq") },
      { to: "/contact", l: "Contact" },
    ],
    [
      { to: "/privacy", l: "Privacy" },
      { to: "/terms", l: "Terms" },
      { to: "/accessibility", l: "Accessibility" },
    ],
  ] as const;
  return (
    <footer className="mt-24 bg-plum text-plum-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold">SautiSalama</p>
          <p className="mt-2 text-sm opacity-80">{t("positioning")}</p>
        </div>
        {cols.map((c, i) => (
          <ul key={i} className="space-y-2 text-sm">
            {c.map((l) => (
              <li key={l.to}><Link to={l.to} className="opacity-80 hover:opacity-100">{l.l}</Link></li>
            ))}
          </ul>
        ))}
      </div>
      <div className="container-page border-t border-plum-foreground/15 py-6 text-xs opacity-75">
        <p>{t("disclaimer")}</p>
        <p className="mt-2">© {new Date().getFullYear()} SautiSalama. {t("footer_rights")}</p>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({ title, sub }: { title: string; sub?: string | undefined }) {
  return (
    <section className="bg-gradient-soft">
      <div className="container-page py-16 md:py-20">
        <h1 className="max-w-3xl text-4xl font-extrabold text-plum dark:text-foreground md:text-5xl">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{sub}</p>}
      </div>
    </section>
  );
}
