import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { FaqList } from "@/components/site/sections";
import { useI18n } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { faqs } from "@/lib/content";

export const Route = createFileRoute("/faq")({ staticData: { sitemap: true },
  head: () => seo("FAQ", "Answers to common questions about Sauti Salama, privacy and accounts.", "/faq", {
    sw: "Majibu ya maswali yanayoulizwa mara kwa mara kuhusu Sauti Salama, faragha na akaunti.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q.en, acceptedAnswer: { "@type": "Answer", text: f.a.en } })),
    },
  }),
  component: () => {
    const { t } = useI18n();
    return (
      <SiteLayout>
        <PageHero title={t("faq_title")} />
        <section className="container-page max-w-3xl py-14"><FaqList /></section>
      </SiteLayout>
    );
  },
});
