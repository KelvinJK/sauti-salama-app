import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({ staticData: { sitemap: true },
  head: () => seo("Terms of use", "The terms for using Sauti Salama.", "/terms"),
  component: () => (
    <InfoPage title="Terms of use" sub="The terms for using Sauti Salama.">
      <p className="rounded-2xl bg-peach p-4 text-base font-semibold">Draft — pending legal review.</p><p>Sauti Salama provides health information and care navigation only. It does not diagnose, treat or prescribe. In an emergency, call 112 or go to the nearest health facility.</p><p>Personal accounts are available to adults aged 18 and older during the pilot.</p>
    </InfoPage>
  ),
});
