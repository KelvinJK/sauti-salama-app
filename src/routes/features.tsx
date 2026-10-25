import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Features } from "@/components/site/sections";
import { useI18n } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/features")({ staticData: { sitemap: true },
  head: () => seo("Features", "Reproductive health, cycle tracking, maternal care, child growth, nutrition and a private journal.", "/features"),
  component: () => {
    const { t } = useI18n();
    return (
      <SiteLayout>
        <PageHero title={t("features_title")} sub={t("features_sub")} />
        <section className="container-page py-14"><Features /></section>
      </SiteLayout>
    );
  },
});
