import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({ staticData: { sitemap: true },
  head: () => seo("About SautiSalama", "A health information and care-navigation app for women and families in Tanzania.", "/about"),
  component: () => (
    <InfoPage title="About SautiSalama" sub="A health information and care-navigation app for women and families in Tanzania.">
      <p>SautiSalama helps women and families understand their health, document their journey and find appropriate care — in Kiswahili and English.</p><p>It is not a diagnosis, treatment or prescription service. It is designed to support, not replace, conversations with qualified health workers.</p>
    </InfoPage>
  ),
});
