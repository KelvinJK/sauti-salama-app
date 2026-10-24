import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { FaqList } from "@/components/site/sections";
import { useI18n } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => seo("FAQ", "Answers to common questions about SautiSalama, privacy and accounts."),
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
