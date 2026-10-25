import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({ staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): { topic?: string } => search['topic'] === 'partnership' ? { topic: 'partnership' } : {},
  head: () => seo("Contact", "Get in touch with the Sauti Salama team.", "/contact"),
  component: () => (
    <InfoPage title="Contact" sub="Get in touch with the Sauti Salama team.">
      <p>A contact form and official email address will be published before launch.</p><p>For medical emergencies, do not wait — call 112 or go to the nearest health facility.</p>
    </InfoPage>
  ),
});
