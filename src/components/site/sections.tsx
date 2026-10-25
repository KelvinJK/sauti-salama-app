import { Link } from "@tanstack/react-router";
import { BookOpen, CalendarHeart, Baby, Sprout, Salad, NotebookPen, ShieldCheck, Lock, Download, ChevronDown } from "lucide-react";
import { useI18n, type TKey } from "@/lib/i18n";
import { faqs } from "@/lib/content";

const featureList: { k: TKey; d: TKey; icon: typeof BookOpen; bg: string; to: "/learn" | "/app" }[] = [
  { k: "f1", d: "f1d", icon: BookOpen, bg: "bg-lavender", to: "/learn" },
  { k: "f2", d: "f2d", icon: CalendarHeart, bg: "bg-pink", to: "/app" },
  { k: "f3", d: "f3d", icon: Baby, bg: "bg-peach", to: "/app" },
  { k: "f4", d: "f4d", icon: Sprout, bg: "bg-mint", to: "/app" },
  { k: "f5", d: "f5d", icon: Salad, bg: "bg-peach", to: "/app" },
  { k: "f6", d: "f6d", icon: NotebookPen, bg: "bg-lavender", to: "/app" },
];

export function Features() {
  const { t } = useI18n();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {featureList.map(({ k, d, icon: Icon, bg, to }) => (
        <Link key={k} to={to} className="card-soft group p-6 transition hover:-translate-y-1 hover:shadow-soft">
          <span className={`grid h-14 w-14 place-items-center rounded-2xl ${bg} shadow-emboss`}>
            <Icon className="h-7 w-7 text-primary" />
          </span>
          <h3 className="mt-5 text-lg font-bold">{t(k)}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t(d)}</p>
        </Link>
      ))}
    </div>
  );
}

export function HowSteps() {
  const { t } = useI18n();
  const steps: [TKey, TKey][] = [["how1", "how1d"], ["how2", "how2d"], ["how3", "how3d"]];
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {steps.map(([h, d], i) => (
        <li key={h} className="card-soft p-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-extrabold text-primary-foreground shadow-emboss">{i + 1}</span>
          <h3 className="mt-4 text-lg font-bold">{t(h)}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t(d)}</p>
        </li>
      ))}
    </ol>
  );
}

export function PrivacyPoints() {
  const { t } = useI18n();
  const pts: [TKey, typeof Lock][] = [["p1", ShieldCheck], ["p2", Lock], ["p3", Download]];
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {pts.map(([k, Icon]) => (
        <li key={k} className="flex items-center gap-3 rounded-2xl bg-card/10 p-4 font-semibold">
          <Icon className="h-6 w-6 shrink-0 text-secondary" /> {t(k)}
        </li>
      ))}
    </ul>
  );
}

export function FaqList() {
  const { lang } = useI18n();
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <details key={f.q.en} className="card-soft group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
            {f.q[lang]}
            <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-muted-foreground">{f.a[lang]}</p>
        </details>
      ))}
    </div>
  );
}

export function SectionHead({ title, sub }: { title: string; sub?: string | undefined }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="text-3xl font-extrabold text-plum dark:text-foreground md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}
