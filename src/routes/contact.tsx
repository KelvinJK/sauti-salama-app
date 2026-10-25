import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";
import { MapPin, ArrowUpRight } from 'lucide-react';

export const Route = createFileRoute("/contact")({ staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): { topic?: string } => search['topic'] === 'partnership' ? { topic: 'partnership' } : {},
  head: () => seo("Contact", "Get in touch with the Sauti Salama team.", "/contact"),
  component: () => (
    <InfoPage title="Contact" sub="Get in touch with the Sauti Salama team.">
      <h2>Our office</h2>
      <p>Dar es Salaam, Tanzania</p>
      <a href="https://maps.app.goo.gl/54UWyBLi3qX3Mhb29" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"><MapPin className="size-5" />View office on Google Maps<ArrowUpRight className="size-4" /></a>
      <p>A contact form and official email address will be published before launch.</p><p>For medical emergencies, do not wait — call 112 or go to the nearest health facility.</p>
    </InfoPage>
  ),
});
