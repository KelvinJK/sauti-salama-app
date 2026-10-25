import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";
import { Link } from '@tanstack/react-router';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute("/terms")({ staticData: { sitemap: true },
  head: () => seo("Terms and conditions", "The terms and conditions for using Sauti Salama.", "/terms"),
  component: Terms,
});

function Terms() {
  const { lang } = useI18n();
  const text = (en: string, sw: string) => lang === 'en' ? en : sw;
  return <InfoPage title={text('Terms and conditions', 'Vigezo na masharti')} sub={text('Using Sauti Salama responsibly.', 'Kutumia Sauti Salama kwa uwajibikaji.')}>
    <p className="rounded-lg bg-peach p-4 text-base font-semibold">{text('Draft — pending legal review. These terms must be finalized before launch.', 'Rasimu — inasubiri ukaguzi wa kisheria. Masharti haya lazima yakamilishwe kabla ya uzinduzi.')}</p>
    <h2>{text('Information, not medical treatment', 'Taarifa, si matibabu')}</h2>
    <p>{text('Sauti Salama provides health information and care navigation only. It does not diagnose, treat or prescribe, and is not a substitute for a qualified health professional. Draft articles remain marked clinical review pending.', 'Sauti Salama inatoa taarifa za afya na mwongozo wa huduma pekee. Haitambui, haitibu wala kuagiza dawa, na si mbadala wa mtaalamu wa afya. Makala za rasimu zinaendelea kuonyeshwa kuwa zinasubiri ukaguzi wa kitabibu.')}</p>
    <h2>{text('Who can use personal accounts', 'Wanaoweza kutumia akaunti binafsi')}</h2>
    <p>{text('Personal accounts are available to adults aged 18 and older during the pilot. Provide accurate registration information and keep your sign-in details and PIN private.', 'Akaunti binafsi zinapatikana kwa watu wazima wenye miaka 18 au zaidi katika kipindi cha majaribio. Toa taarifa sahihi za usajili na linda taarifa zako za kuingia na PIN.')}</p>
    <h2>{text('Your records and responsibilities', 'Kumbukumbu na wajibu wako')}</h2>
    <p>{text('Only enter information you are entitled to record. Do not use the service to harass others, gain unauthorized access or misuse another person’s health information. Guest records are device-only; a forgotten PIN or cleared browser data can mean permanent loss.', 'Ingiza taarifa ambazo una haki ya kurekodi tu. Usitumie huduma kuwanyanyasa wengine, kupata ufikiaji usioidhinishwa au kutumia vibaya taarifa za afya za mtu mwingine. Kumbukumbu za mgeni ziko kwenye kifaa pekee; kusahau PIN au kufuta data ya kivinjari kunaweza kusababisha upotevu wa kudumu.')}</p>
    <h2>{text('Pilot availability', 'Upatikanaji wakati wa majaribio')}</h2>
    <p>{text('Tools marked Coming soon are not yet available. Example facility listings are test data, not real care destinations. The app is not an emergency response service.', 'Zana zilizoandikwa Zinakuja hivi karibuni bado hazipatikani. Orodha za vituo vya mfano ni taarifa za majaribio, si maeneo halisi ya kupata huduma. Programu si huduma ya kushughulikia dharura.')}</p>
    <p className="rounded-lg bg-mint p-4 text-base font-semibold">{text('In an emergency, call 112 or go to the nearest health facility.', 'Katika dharura, piga 112 au nenda kituo cha afya kilicho karibu.')}</p>
    <h2>{text('Privacy and legal review', 'Faragha na ukaguzi wa kisheria')}</h2>
    <p>{text('Read the privacy and data protection policies for storage and privacy controls. Final terms still need the responsible organisation’s identity and reviewed provisions for applicable law, complaints and liability.', 'Soma sera za faragha na ulinzi wa data kuhusu hifadhi na udhibiti wa faragha. Masharti ya mwisho bado yanahitaji utambulisho wa taasisi inayowajibika na vipengele vilivyokaguliwa kuhusu sheria husika, malalamiko na dhima.')}</p>
    <p><Link to="/privacy" className="font-semibold text-primary underline underline-offset-4">{text('Privacy policy', 'Sera ya faragha')}</Link></p>
  </InfoPage>;
}
