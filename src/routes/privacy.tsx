import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({ staticData: { sitemap: true },
  head: () => seo("Privacy policy", "How Sauti Salama protects and handles your information.", "/privacy"),
  component: () => (
    <InfoPage title="Privacy policy" sub="How Sauti Salama protects and handles your information.">
      <p className="rounded-2xl bg-peach p-4 text-base font-semibold">Draft — pending legal review under Tanzania's Personal Data Protection Act.</p><h2>Our principles</h2><p>You own your data. We collect only what is needed, never sell it, and share information with a facility only with your explicit consent.</p><h2>Your controls</h2><p>Account holders will be able to export and permanently delete their data at any time.</p>
    </InfoPage>
  ),
});
