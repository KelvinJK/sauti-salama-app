import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { articles } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/learn/")({ staticData: { sitemap: true },
  head: () => seo("Health education library", "Free reproductive, maternal and child health articles in Kiswahili and English.", "/learn"),
  component: Learn,
});

const tone: Record<string, string> = { reproductive: "bg-lavender", menstrual: "bg-pink", maternal: "bg-peach", child: "bg-mint", nutrition: "bg-peach" };

function Learn() {
  const { t, lang } = useI18n();
  return (
    <SiteLayout>
      <PageHero title={t("learn_title")} sub={t("learn_sub")} />
      <section className="container-page grid gap-5 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link key={a.slug} to="/learn/$slug" params={{ slug: a.slug }} className="card-soft overflow-hidden transition-colors hover:border-primary">
            <div className={`h-3 ${tone[a.topic]}`} />
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">{a.topic}</p>
              <h2 className="mt-2 text-lg font-bold">{a.title[lang]}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{a.summary[lang]}</p>
              <p className="mt-4 text-xs font-semibold text-muted-foreground">⚠ {t("review_pending")}</p>
            </div>
          </Link>
        ))}
      </section>
    </SiteLayout>
  );
}
