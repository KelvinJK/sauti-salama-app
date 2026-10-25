import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { seo } from "@/lib/seo";
import { Link } from '@tanstack/react-router';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute("/privacy")({ staticData: { sitemap: true },
  head: () => seo("Privacy policy", "How Sauti Salama protects and handles your information.", "/privacy"),
  component: Privacy,
});

function Privacy() {
  const { lang } = useI18n();
  const text = (en: string, sw: string) => lang === 'en' ? en : sw;
  return <InfoPage title={text('Privacy policy', 'Sera ya faragha')} sub={text('How Sauti Salama handles your information.', 'Jinsi Sauti Salama inavyoshughulikia taarifa zako.')}>
    <p className="rounded-lg bg-peach p-4 text-base font-semibold">{text("Draft — pending legal review under Tanzania’s Personal Data Protection Act.", 'Rasimu — inasubiri ukaguzi wa kisheria chini ya Sheria ya Ulinzi wa Taarifa Binafsi ya Tanzania.')}</p>
    <h2>{text('What you choose to provide', 'Taarifa unazochagua kutoa')}</h2>
    <p>{text('You can read the public health library without an account. If you register, you provide account and profile information. Personal tools store the health notes, cycle logs and child measurements you choose to enter.', 'Unaweza kusoma maktaba ya afya bila akaunti. Ukijisajili, unatoa taarifa za akaunti na wasifu. Zana binafsi huhifadhi maelezo ya afya, rekodi za mzunguko na vipimo vya mtoto unavyochagua kuingiza.')}</p>
    <h2>{text('Where records are stored', 'Mahali kumbukumbu zinapohifadhiwa')}</h2>
    <p>{text('Guest records stay encrypted on your device behind your PIN. Account records use authenticated cloud storage with owner-scoped access controls. Device-only records cannot be recovered if you forget your PIN or clear the browser’s app data.', 'Kumbukumbu za mgeni hubaki zimesimbwa kwenye kifaa na kulindwa kwa PIN. Kumbukumbu za akaunti huhifadhiwa mtandaoni kwa udhibiti wa ufikiaji wa mwenyewe. Kumbukumbu za kifaa haziwezi kurejeshwa ukisahau PIN au kufuta data ya programu kwenye kivinjari.')}</p>
    <h2>{text('Sharing and your choices', 'Kushiriki na chaguo zako')}</h2>
    <p>{text('Our principle is not to sell personal records. Care referrals remain unavailable; consent-based sharing must be in place before that service launches. If you authorize an agent integration, it can access the tools you approve; only approve services you trust.', 'Kanuni yetu ni kutouza kumbukumbu binafsi. Rufaa bado hazipatikani; kushiriki kwa idhini lazima kuwepo kabla ya huduma hiyo kuanza. Ukiidhinisha muunganisho wa wakala, anaweza kutumia zana unazoidhinisha; idhinisha huduma unazoziamini tu.')}</p>
    <h2>{text('Privacy controls', 'Udhibiti wa faragha')}</h2>
    <p>{text('Profile settings provide record export and deletion controls. Keep downloaded records secure because they are no longer inside the app’s protected storage. Never share your PIN or account password.', 'Mipangilio ya wasifu ina udhibiti wa kupakua na kufuta kumbukumbu. Linda kumbukumbu zilizopakuliwa kwa sababu haziko tena kwenye hifadhi iliyolindwa ya programu. Usishiriki PIN au nenosiri lako.')}</p>
    <h2>{text('Questions about your data', 'Maswali kuhusu taarifa zako')}</h2>
    <p>{text('If a question about how your information is handled is not answered here, or you want help using your privacy controls, contact the team.', 'Ikiwa swali kuhusu jinsi taarifa zako zinavyoshughulikiwa halijajibiwa hapa, au unataka msaada wa kutumia udhibiti wako wa faragha, wasiliana na timu.')}</p>
    <p><Link to="/data-protection" className="font-semibold text-primary underline underline-offset-4">{text('Data protection policy', 'Sera ya ulinzi wa data')}</Link></p>
  </InfoPage>;
}
