import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "sw";

const dict = {
  en: {
    nav_features: "Features", nav_how: "How it works", nav_families: "For families", nav_care: "Find care", nav_faq: "FAQ", nav_learn: "Learn",
    open_app: "Open the app",
    hero_l1: "Your health.", hero_l2: "Your voice.", hero_l3: "Your choice.",
    hero_sub: "Understand your health, document your journey and find the support you need — in Kiswahili or English.",
    hero_cta: "Explore SautiSalama", hero_cta2: "See how it works",
    positioning: "Women's health. Motherhood. Family wellbeing.",
    features_title: "Everything in one caring place",
    features_sub: "Six connected modules built around the moments that matter for women and families.",
    f1: "Reproductive health", f1d: "Clear, reviewed information on your body, contraception and wellbeing.",
    f2: "Cycle tracking", f2d: "Log periods, symptoms and moods privately on your own terms.",
    f3: "Pregnancy & postnatal", f3d: "Week-by-week guidance, antenatal visits and recovery support.",
    f4: "Child growth", f4d: "Record measurements and follow your child's growth over time.",
    f5: "Nutrition & recipes", f5d: "Affordable local recipes for every stage of childhood.",
    f6: "Private journal", f6d: "A confidential space for notes, feelings and questions for your clinician.",
    how_title: "How SautiSalama works",
    how1: "Learn freely", how1d: "Browse the educational library without an account.",
    how2: "Create a private space", how2d: "Adults 18+ can sign up to track and document their health.",
    how3: "Find the right care", how3d: "Locate services and share information only with your consent.",
    care_title: "Healthcare navigation", care_sub: "Find facilities offering the services you need. Referrals are only shared with your explicit consent.",
    privacy_title: "Privacy and trust, by design",
    privacy_sub: "Your records belong to you. Export or delete your data any time, and choose exactly what you share.",
    p1: "You control sharing", p2: "No selling of data", p3: "Export and delete anytime",
    lang_title: "Kiswahili or English — your choice", lang_sub: "Switch language anytime. Every screen is designed to work in both.",
    partners_title: "Healthcare partners", partners_sub: "We are building partnerships with facilities and organisations in Tanzania. No partnerships are announced yet.",
    faq_title: "Frequently asked questions",
    cta_title: "Start your SautiSalama journey", cta_sub: "Free educational content today. Personal tools are coming in the next release.",
    disclaimer: "SautiSalama provides health information and care navigation. It does not diagnose or treat. In an emergency, call 112 or go to the nearest health facility.",
    footer_rights: "All rights reserved.",
    learn_title: "Health education library", learn_sub: "Free to read, no account needed.",
    review_pending: "Clinical review pending",
    read_more: "Read article", back: "Back",
    coming_soon: "Coming in the next release",
    app_title: "The SautiSalama app",
    app_sub: "Personal tracking, journal and referrals need secure accounts. We're setting these up now — nothing you enter will be stored until then.",
    browse_learn: "Browse the library",
  },
  sw: {
    nav_features: "Vipengele", nav_how: "Jinsi inavyofanya kazi", nav_families: "Kwa familia", nav_care: "Tafuta huduma", nav_faq: "Maswali", nav_learn: "Jifunze",
    open_app: "Fungua programu",
    hero_l1: "Afya yako.", hero_l2: "Sauti yako.", hero_l3: "Chaguo lako.",
    hero_sub: "Elewa afya yako, andika safari yako na upate msaada unaohitaji — kwa Kiswahili au Kiingereza.",
    hero_cta: "Gundua SautiSalama", hero_cta2: "Tazama inavyofanya kazi",
    positioning: "Afya ya wanawake. Uzazi. Ustawi wa familia.",
    features_title: "Kila kitu mahali pamoja penye kujali",
    features_sub: "Sehemu sita zilizounganishwa kwa nyakati muhimu za wanawake na familia.",
    f1: "Afya ya uzazi", f1d: "Taarifa wazi kuhusu mwili wako, uzazi wa mpango na ustawi.",
    f2: "Kufuatilia mzunguko", f2d: "Rekodi hedhi, dalili na hisia kwa faragha.",
    f3: "Ujauzito na baada ya kujifungua", f3d: "Mwongozo wa kila wiki, kliniki na msaada wa kupona.",
    f4: "Ukuaji wa mtoto", f4d: "Rekodi vipimo na fuatilia ukuaji wa mtoto wako.",
    f5: "Lishe na mapishi", f5d: "Mapishi ya bei nafuu ya kienyeji kwa kila hatua ya utoto.",
    f6: "Shajara binafsi", f6d: "Mahali pa siri kwa maelezo, hisia na maswali kwa mtoa huduma.",
    how_title: "Jinsi SautiSalama inavyofanya kazi",
    how1: "Jifunze bure", how1d: "Soma maktaba ya elimu bila akaunti.",
    how2: "Unda nafasi binafsi", how2d: "Watu wazima 18+ wanaweza kujisajili kufuatilia afya zao.",
    how3: "Pata huduma sahihi", how3d: "Tafuta huduma na shiriki taarifa kwa idhini yako tu.",
    care_title: "Kupata huduma za afya", care_sub: "Tafuta vituo vinavyotoa huduma unazohitaji. Rufaa hushirikiwa kwa idhini yako tu.",
    privacy_title: "Faragha na uaminifu tangu mwanzo",
    privacy_sub: "Kumbukumbu zako ni zako. Pakua au futa data yako wakati wowote, na uchague unachoshiriki.",
    p1: "Wewe unadhibiti kushiriki", p2: "Hatuuzi data", p3: "Pakua na futa wakati wowote",
    lang_title: "Kiswahili au Kiingereza — chaguo lako", lang_sub: "Badilisha lugha wakati wowote. Kila skrini inafanya kazi kwa lugha zote mbili.",
    partners_title: "Washirika wa afya", partners_sub: "Tunajenga ushirikiano na vituo na mashirika nchini Tanzania. Hakuna ushirikiano uliotangazwa bado.",
    faq_title: "Maswali yanayoulizwa mara kwa mara",
    cta_title: "Anza safari yako ya SautiSalama", cta_sub: "Elimu ya bure leo. Zana binafsi zinakuja katika toleo lijalo.",
    disclaimer: "SautiSalama inatoa taarifa za afya na mwongozo wa huduma. Haitambui wala kutibu magonjwa. Katika dharura, piga 112 au nenda kituo cha afya kilicho karibu.",
    footer_rights: "Haki zote zimehifadhiwa.",
    learn_title: "Maktaba ya elimu ya afya", learn_sub: "Bure kusoma, hakuna akaunti inayohitajika.",
    review_pending: "Inasubiri ukaguzi wa kitabibu",
    read_more: "Soma makala", back: "Rudi",
    coming_soon: "Inakuja katika toleo lijalo",
    app_title: "Programu ya SautiSalama",
    app_sub: "Ufuatiliaji binafsi, shajara na rufaa vinahitaji akaunti salama. Tunaviandaa sasa — hakuna utakachoingiza kitahifadhiwa hadi hapo.",
    browse_learn: "Tazama maktaba",
  },
} as const;

export type TKey = keyof typeof dict.en;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict.en[k],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("ss-lang");
    if (saved === "sw" || saved === "en") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("ss-lang", l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[lang][k] }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
export const translate = (lang: Lang, k: TKey) => dict[lang][k];
