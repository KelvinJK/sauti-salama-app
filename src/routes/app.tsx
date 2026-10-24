import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/app")({
  head: () => seo("The SautiSalama app", "Personal tracking, journal and referrals for adults 18+."),
  component: () => (
    <InfoPage title="The SautiSalama app" sub="Personal tracking, journal and referrals for adults 18+.">
      <p>Personal tools — cycle tracking, pregnancy and postnatal support, child growth, journal and referrals — need secure accounts. These are being set up in the next stage. Nothing you enter is stored until then.</p><p><a href="/learn" className="btn-primary">Browse the library</a></p>
    </InfoPage>
  ),
});
