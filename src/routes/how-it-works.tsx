import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { HowSteps } from "@/components/site/sections";
import { useI18n } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/how-it-works")({
  head: () => seo("How it works", "Learn freely, create a private space and find the right care with SautiSalama."),
  component: () => {
    const { t } = useI18n();
    return (
      <SiteLayout>
        <PageHero title={t("how_title")} sub={t("hero_sub")} />
        <section className="container-page py-14"><HowSteps /></section>
      </SiteLayout>
    );
  },
});
