import type { Lang } from "./i18n";

export type Article = {
  slug: string;
  topic: "reproductive" | "menstrual" | "maternal" | "child" | "nutrition";
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  body: Record<Lang, string[]>;
};

// Draft educational content. Every article shows "clinical review pending"
// until reviewed by a qualified clinician.
export const articles: Article[] = [
  {
    slug: "understanding-your-menstrual-cycle",
    topic: "menstrual",
    title: { en: "Understanding your menstrual cycle", sw: "Kuelewa mzunguko wako wa hedhi" },
    summary: { en: "What happens in your body each month, and what is commonly considered typical.", sw: "Kinachotokea mwilini mwako kila mwezi, na kinachochukuliwa kuwa kawaida." },
    body: {
      en: [
        "A menstrual cycle is counted from the first day of one period to the first day of the next.",
        "Cycle length varies between people and can change over time. Tracking helps you learn your own pattern.",
        "Speak with a health worker if your periods are very painful, very heavy, or suddenly change.",
      ],
      sw: [
        "Mzunguko wa hedhi huhesabiwa kuanzia siku ya kwanza ya hedhi moja hadi siku ya kwanza ya inayofuata.",
        "Urefu wa mzunguko hutofautiana kati ya watu na unaweza kubadilika. Kufuatilia kunakusaidia kujua mtindo wako.",
        "Ongea na mhudumu wa afya ikiwa hedhi zako zina maumivu makali, ni nzito sana, au zinabadilika ghafla.",
      ],
    },
  },
  {
    slug: "antenatal-care-visits",
    topic: "maternal",
    title: { en: "Why antenatal care visits matter", sw: "Kwa nini kliniki ya wajawazito ni muhimu" },
    summary: { en: "How regular visits help you and your baby stay healthy during pregnancy.", sw: "Jinsi mahudhurio ya mara kwa mara yanavyokusaidia wewe na mtoto." },
    body: {
      en: [
        "Antenatal visits let a health worker check on you and your baby throughout pregnancy.",
        "Bring any questions to your visit — writing them down beforehand can help.",
        "Go to a health facility immediately if you have heavy bleeding, severe headache, blurred vision or reduced baby movement.",
      ],
      sw: [
        "Kliniki ya wajawazito humwezesha mhudumu wa afya kukufuatilia wewe na mtoto wakati wote wa ujauzito.",
        "Peleka maswali yako kliniki — kuyaandika mapema kunasaidia.",
        "Nenda kituo cha afya mara moja ukiwa na damu nyingi, maumivu makali ya kichwa, kutoona vizuri au mtoto kupunguza kucheza.",
      ],
    },
  },
  {
    slug: "breastfeeding-basics",
    topic: "child",
    title: { en: "Breastfeeding basics", sw: "Misingi ya kunyonyesha" },
    summary: { en: "Getting started and where to find support.", sw: "Kuanza na mahali pa kupata msaada." },
    body: {
      en: [
        "Starting breastfeeding soon after birth can help both mother and baby.",
        "Every mother and baby is different — it is normal to need support at the start.",
        "Ask a health worker for help if feeding is painful or your baby seems unwell.",
      ],
      sw: [
        "Kuanza kunyonyesha mapema baada ya kujifungua kunaweza kumsaidia mama na mtoto.",
        "Kila mama na mtoto ni tofauti — ni kawaida kuhitaji msaada mwanzoni.",
        "Omba msaada kwa mhudumu wa afya ikiwa kunyonyesha kuna maumivu au mtoto anaonekana mgonjwa.",
      ],
    },
  },
  {
    slug: "family-planning-options",
    topic: "reproductive",
    title: { en: "Family planning: knowing your options", sw: "Uzazi wa mpango: kujua chaguo zako" },
    summary: { en: "An overview to help you prepare for a conversation with a provider.", sw: "Muhtasari wa kukuandaa kuzungumza na mtoa huduma." },
    body: {
      en: [
        "There are many family planning methods, each with different benefits and considerations.",
        "The right choice depends on your health, preferences and plans.",
        "A trained provider can help you choose safely. This article is not a substitute for that advice.",
      ],
      sw: [
        "Kuna njia nyingi za uzazi wa mpango, kila moja ikiwa na faida na mambo ya kuzingatia.",
        "Chaguo sahihi linategemea afya yako, mapendeleo na mipango yako.",
        "Mtoa huduma aliyefunzwa anaweza kukusaidia kuchagua kwa usalama. Makala hii si mbadala wa ushauri huo.",
      ],
    },
  },
  {
    slug: "first-foods-for-babies",
    topic: "nutrition",
    title: { en: "First foods for babies", sw: "Vyakula vya kwanza kwa watoto" },
    summary: { en: "Introducing local, nutritious foods alongside breastfeeding.", sw: "Kuanzisha vyakula vya kienyeji vyenye lishe pamoja na kunyonyesha." },
    body: {
      en: [
        "Around six months, babies typically begin eating soft foods alongside breast milk.",
        "Local foods like mashed sweet potato, pumpkin and enriched porridge can be good starting points.",
        "Ask a health worker about your child's specific needs, allergies or growth concerns.",
      ],
      sw: [
        "Karibu miezi sita, watoto kwa kawaida huanza kula vyakula laini pamoja na maziwa ya mama.",
        "Vyakula vya kienyeji kama viazi vitamu vilivyopondwa, maboga na uji ulioboreshwa ni mwanzo mzuri.",
        "Muulize mhudumu wa afya kuhusu mahitaji ya mtoto wako, mzio au wasiwasi wa ukuaji.",
      ],
    },
  },
];

export const faqs: { q: Record<Lang, string>; a: Record<Lang, string> }[] = [
  { q: { en: "Is SautiSalama free?", sw: "Je, SautiSalama ni bure?" }, a: { en: "Educational content is free to read without an account.", sw: "Maudhui ya elimu ni bure kusoma bila akaunti." } },
  { q: { en: "Does SautiSalama replace my doctor?", sw: "Je, SautiSalama inachukua nafasi ya daktari?" }, a: { en: "No. It provides information and helps you find care. It does not diagnose, treat or prescribe.", sw: "Hapana. Inatoa taarifa na kukusaidia kupata huduma. Haitambui, haitibu wala kuandika dawa." } },
  { q: { en: "Who can create an account?", sw: "Nani anaweza kufungua akaunti?" }, a: { en: "During the pilot, accounts are for adults aged 18 and older.", sw: "Katika majaribio, akaunti ni kwa watu wazima wenye miaka 18 na zaidi." } },
  { q: { en: "Who can see my information?", sw: "Nani anaweza kuona taarifa zangu?" }, a: { en: "Only you, unless you explicitly consent to share specific information with a facility.", sw: "Wewe tu, isipokuwa ukitoa idhini ya kushiriki taarifa maalum na kituo." } },
  { q: { en: "Can I use it in Kiswahili?", sw: "Naweza kuitumia kwa Kiswahili?" }, a: { en: "Yes. Switch between Kiswahili and English anytime from the menu.", sw: "Ndiyo. Badilisha kati ya Kiswahili na Kiingereza wakati wowote kwenye menyu." } },
];
