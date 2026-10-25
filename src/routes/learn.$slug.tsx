import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { articles } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/learn/$slug")({ staticData: { sitemap: true },
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) =>
    loaderData ? seo(loaderData.article.title.en, loaderData.article.summary.en, `/learn/${loaderData.article.slug}`) : { meta: [{ title: "Article | SautiSalama" }, { name: "robots", content: "noindex" }] },
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const { t, lang } = useI18n();
  return (
    <SiteLayout>
      <article className="container-page max-w-3xl py-14">
        <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" /> {t("back")}</Link>
        <h1 className="mt-6 text-4xl font-extrabold text-plum dark:text-foreground">{article.title[lang]}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{article.summary[lang]}</p>
        <p className="mt-6 rounded-2xl bg-peach p-4 text-sm font-semibold">⚠ {t("review_pending")}</p>
        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          {article.body[lang].map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <p className="mt-10 rounded-2xl bg-lavender p-4 text-sm">{t("disclaimer")}</p>
      </article>
    </SiteLayout>
  );
}
