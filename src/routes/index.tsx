import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Languages, CalendarHeart, Droplet, Smile, Home as HomeIcon, BookOpen, Activity, HeartHandshake, Menu as MenuIcon } from "lucide-react";
import mascot from "@/assets/mascot.png";
import { SiteLayout, Logo } from "@/components/site/SiteLayout";
import { Features, HowSteps, PrivacyPoints, FaqList, SectionHead } from "@/components/site/sections";
import { useI18n } from "@/lib/i18n";
import { SITE_URL } from '@/lib/domains';
import { DomainLink } from '@/components/DomainLink';
import { Button } from '@/components/ui/button';
import { seo, organizationJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/")({ staticData: { sitemap: true },
  head: () => {
    const head = seo(
      "Your health. Your voice. Your choice.",
      "Free women's health, pregnancy, motherhood and family wellbeing information in Tanzania and East Africa. Learn, track your cycle and pregnancy privately, and find verified clinics.",
      "/",
      { sw: "Afya ya wanawake, ujauzito, uzazi na ustawi wa familia kwa Kiswahili: jifunze, fuatilia na upate kliniki zilizothibitishwa Tanzania.", jsonLd: organizationJsonLd },
    );
    return { ...head, meta: [{ title: "Sauti Salama — Your health. Your voice. Your choice." }, ...head.meta.slice(1)] };
  },
  component: Home,
});

function PhonePreview() {
  return (
    <div className="relative mx-auto w-[270px] rounded-[2.5rem] border-[10px] border-plum bg-background p-4 shadow-soft dark:border-primary/40">
      <div className="flex items-center justify-between"><Logo /></div>
      <p className="mt-4 text-sm text-muted-foreground">Habari, Amina 👋</p>
      <div className="mt-3 rounded-2xl bg-gradient-brand p-4 text-primary-foreground">
        <p className="text-xs opacity-90">Cycle · day 12</p>
        <p className="text-lg font-extrabold">Example preview</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[{ i: CalendarHeart, b: "bg-pink" }, { i: Droplet, b: "bg-lavender" }, { i: Smile, b: "bg-mint" }].map(({ i: I, b }, k) => (
          <div key={k} className={`grid h-16 place-items-center rounded-2xl ${b} shadow-emboss`}><I className="h-6 w-6 text-primary" /></div>
        ))}
      </div>
      <div className="mt-3 rounded-2xl bg-peach p-3 text-xs font-semibold text-foreground">Antenatal visit · reminder</div>
      <div className="mt-4 flex items-start justify-between border-t border-border pt-3">
        {[{ i: HomeIcon, l: "Home" }, { i: BookOpen, l: "Learn" }, { i: Activity, l: "Track" }, { i: HeartHandshake, l: "Care" }, { i: MenuIcon, l: "Menu" }].map(({ i: I, l }, k) => (
          <div key={l} className="flex flex-1 flex-col items-center gap-1">
            <I className={`h-4 w-4 ${k === 0 ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-[9px] font-bold ${k === 0 ? "text-primary" : "text-muted-foreground"}`}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Home() {
  const { t, lang } = useI18n();
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="container-page grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-4 inline-block rounded-full bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary shadow-emboss">{t("positioning")}</p>
            <h1 className="text-5xl font-extrabold leading-[1.05] text-plum dark:text-foreground md:text-6xl">
              {t("hero_l1")}<br /><span className="text-gradient-brand">{t("hero_l2")}</span><br />{t("hero_l3")}
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">{t("hero_sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <DomainLink destination="app" to="/app" className="btn-primary">{t("hero_cta")}</DomainLink>
              <Link to="/how-it-works" className="btn-secondary">{t("hero_cta2")}</Link>
            </div>
          </div>
          <div className="relative">
            <PhonePreview />
            <img src={mascot} alt="Sauti Salama companion" width={1024} height={1024} className="absolute -bottom-6 -left-2 w-32 md:w-40" />
          </div>
        </div>
      </section>

      <section id="features" className="container-page py-20">
        <SectionHead title={t("features_title")} sub={t("features_sub")} />
        <Features />
      </section>

      <section id="how" className="bg-cream py-20 dark:bg-muted/40">
        <div className="container-page">
          <SectionHead title={t("how_title")} />
          <HowSteps />
        </div>
      </section>

      <section className="container-page grid gap-8 py-20 md:grid-cols-2">
        <div className="border-t-2 border-teal bg-mint p-8 dark:bg-mint/30">
          <MapPin className="h-8 w-8 text-teal" />
          <h2 className="mt-4 text-2xl font-extrabold">{t("care_title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("care_sub")}</p>
          <Link to="/find-care" className="btn-secondary mt-6">{t("nav_care")}</Link>
        </div>
        <div className="border-t-2 border-primary bg-lavender p-8 dark:bg-lavender/30">
          <Languages className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-2xl font-extrabold">{t("lang_title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("lang_sub")}</p>
          <Link to="/learn" className="btn-secondary mt-6">{t("browse_learn")}</Link>
        </div>
      </section>

      <section className="bg-plum py-20 text-plum-foreground dark:bg-card dark:text-card-foreground">
        <div className="container-page">
          <h2 className="text-3xl font-extrabold md:text-4xl">{t("privacy_title")}</h2>
          <p className="mt-3 max-w-2xl opacity-85">{t("privacy_sub")}</p>
          <div className="mt-8"><PrivacyPoints /></div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHead title={t("partners_title")} sub={t("partners_sub")} />
        <Button asChild variant="outline"><Link to="/contact" search={{ topic: 'partnership' }}>{lang === 'en' ? 'Partner with us' : 'Shirikiana nasi'}</Link></Button>
      </section>

      <section id="faq" className="container-page max-w-3xl pb-8">
        <SectionHead title={t("faq_title")} />
        <FaqList />
      </section>

      <section className="mt-16 bg-primary text-primary-foreground">
        <div className="container-page relative overflow-hidden py-12 md:py-16">
          <h2 className="max-w-xl text-3xl font-extrabold md:text-4xl">{t("cta_title")}</h2>
          <p className="mt-3 max-w-lg opacity-90">{t("cta_sub")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/learn" className="btn-secondary">{t("browse_learn")}</Link>
            <DomainLink destination="app" to="/app" className="btn-secondary">{t("open_app")}</DomainLink>
          </div>
          <img src={mascot} alt="" loading="lazy" width={1024} height={1024} className="absolute -bottom-6 right-4 hidden w-40 md:block" />
        </div>
      </section>
    </SiteLayout>
  );
}
