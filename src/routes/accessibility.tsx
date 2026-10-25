import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/accessibility")({ staticData: { sitemap: true },
  head: () => seo("Accessibility", "Our commitment to making Sauti Salama usable for everyone.", "/accessibility"),
  component: () => (
    <InfoPage title="Accessibility" sub="Our commitment to making Sauti Salama usable for everyone.">
      <p>We aim to meet WCAG 2.2 AA: readable contrast, keyboard navigation, visible focus states and screen-reader support, in both Kiswahili and English.</p><p>Found a barrier? Please tell us through the contact page.</p>
    </InfoPage>
  ),
});
