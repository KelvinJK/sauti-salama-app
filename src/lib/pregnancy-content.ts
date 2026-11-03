import type { Lang } from "./i18n";

export type WeekInfo = {
  week: number;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  tips: Record<Lang, string[]>;
};

export const pregnancyWeeks: WeekInfo[] = [
  {
    week: 4,
    title: { en: "Week 4: Early signs", sw: "Wiki 4: Ishara za awali" },
    summary: { en: "Your body is preparing. Some people notice missed periods or mild symptoms.", sw: "Mwili wako unaandaa. Baadhi ya watu wanaona hedhi iliyochelewa au dalili kidogo." },
    tips: {
      en: ["Take a pregnancy test if you missed your period.", "Start prenatal vitamins with folic acid if confirmed.", "Avoid alcohol and smoking."],
      sw: ["Fanya kipimo cha ujauzito ikiwa hedhi imechelewa.", "Anza vitamini za ujauzito zenye asidi folic ikiwa umethibitishwa.", "Epuka pombe na sigara."]
    }
  },
  {
    week: 8,
    title: { en: "Week 8: Baby is growing", sw: "Wiki 8: Mtoto anakua" },
    summary: { en: "The embryo is developing rapidly. Many start feeling more tired or nauseous.", sw: "Kijusi kinakua haraka. Wengi huanza kuhisi uchovu au kichefuchefu." },
    tips: {
      en: ["Eat small frequent meals if nauseous.", "Schedule your first antenatal visit.", "Rest when you need to."],
      sw: ["Kula milo midogo mara kwa mara ikiwa una kichefuchefu.", "Panga ziara yako ya kwanza ya kliniki.", "Pumzika unapohitaji."]
    }
  },
  {
    week: 12,
    title: { en: "Week 12: End of first trimester", sw: "Wiki 12: Mwisho wa theluthi ya kwanza" },
    summary: { en: "Risk of miscarriage decreases. Baby's major organs are forming.", sw: "Hatari ya kuharibika kwa mimba inapungua. Viungo vikuu vya mtoto vinaunda." },
    tips: {
      en: ["Continue antenatal care.", "Ask about screening tests.", "Stay hydrated."],
      sw: ["Endelea na huduma ya kliniki.", "Uliza kuhusu vipimo vya uchunguzi.", "Kunywе maji ya kutosha."]
    }
  },
  {
    week: 20,
    title: { en: "Week 20: Halfway there", sw: "Wiki 20: Nusu ya njia" },
    summary: { en: "You may feel baby movements. Ultrasound often done around now.", sw: "Unaweza kuhisi mtoto akicheza. Ultrasound mara nyingi hufanywa sasa." },
    tips: {
      en: ["Note baby movements and report changes.", "Discuss birth preferences with your provider.", "Wear comfortable clothes."],
      sw: ["Angalia michezo ya mtoto na ripoti mabadiliko.", "Jadili mapendeleo ya kujifungua na mhudumu.", "Vaa nguo zenye starehe."]
    }
  },
  {
    week: 28,
    title: { en: "Week 28: Third trimester begins", sw: "Wiki 28: Theluthi ya tatu inaanza" },
    summary: { en: "Baby is growing faster. You may feel more discomfort or Braxton Hicks.", sw: "Mtoto anakua haraka zaidi. Unaweza kuhisi usumbufu zaidi au mikazo ya Braxton Hicks." },
    tips: {
      en: ["Count kicks daily.", "Prepare for labour signs.", "Rest with feet elevated if swollen."],
      sw: ["Hesabu mikwaju kila siku.", "Jitayarishe kwa ishara za uchungu.", "Pumzika na miguu iliyoinuliwa ikiwa kuvimba."]
    }
  },
  {
    week: 36,
    title: { en: "Week 36: Almost ready", sw: "Wiki 36: Karibu tayari" },
    summary: { en: "Baby is nearly full term. Weekly visits often start.", sw: "Mtoto ni karibu kamili. Ziara za kila wiki mara nyingi zinaanza." },
    tips: {
      en: ["Know the signs of labour.", "Pack your hospital bag.", "Discuss pain relief options."],
      sw: ["Jua ishara za uchungu.", "Andaa begi la hospitali.", "Jadili chaguo za kupunguza maumivu."]
    }
  }
];
