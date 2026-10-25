import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/find-care")({ staticData: { sitemap: true },
  head: () => seo("Find care", "Locate health facilities and services in Tanzania.", "/find-care"),
  component: () => (
    <InfoPage title="Find care" sub="Locate health facilities and services in Tanzania.">
      <p>The facility directory is being prepared. We only list facilities once their details have been verified, so none are shown yet.</p><p className="rounded-2xl bg-mint p-4 text-base font-semibold">In an emergency, call 112 or go to the nearest health facility.</p>
    </InfoPage>
  ),
});
