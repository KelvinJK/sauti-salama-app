import type { ReactNode } from "react";
import { SiteLayout, PageHero } from "./SiteLayout";

export function InfoPage({ title, sub, children }: { title: string; sub?: string | undefined; children: ReactNode }) {
  return (
    <SiteLayout>
      <PageHero title={title} sub={sub} />
      <section className="container-page max-w-3xl space-y-5 py-14 text-lg leading-relaxed [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-extrabold">
        {children}
      </section>
    </SiteLayout>
  );
}
