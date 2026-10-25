import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({ staticData: { sitemap: true },
  head: () => seo("About Sauti Salama", "A health information and care-navigation app for women and families in Tanzania.", "/about"),
  component: () => (
    <InfoPage title="About Sauti Salama" sub="A health information and care-navigation app for women and families in Tanzania.">
      <p>Sauti Salama helps women and families understand their health, document their journey and find appropriate care — in Kiswahili and English.</p><p>It is not a diagnosis, treatment or prescription service. It is designed to support, not replace, conversations with qualified health workers.</p>
    </InfoPage>
  ),
});
