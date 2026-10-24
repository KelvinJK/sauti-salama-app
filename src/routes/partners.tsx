import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/partners")({
  head: () => seo("Partners", "Building partnerships with healthcare facilities and organisations in Tanzania."),
  component: () => (
    <InfoPage title="Partners" sub="Building partnerships with healthcare facilities and organisations in Tanzania.">
      <p>We are actively seeking partnerships with health facilities, NGOs and public health organisations. No partnerships have been announced yet.</p><p>Interested? Reach us through the contact page.</p>
    </InfoPage>
  ),
});
