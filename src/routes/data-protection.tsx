import { createFileRoute, Link } from '@tanstack/react-router';
import { InfoPage } from '@/components/site/InfoPage';
import { useI18n } from '@/lib/i18n';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/data-protection')({
  staticData: { sitemap: true },
  head: () => seo('Data protection policy', 'How Sauti Salama safeguards personal records and device-only data.', '/data-protection'),
  component: DataProtection,
});

function DataProtection() {
  const { lang } = useI18n();
  const text = (en: string, sw: string) => lang === 'en' ? en : sw;
  return <InfoPage title={text('Data protection policy', 'Sera ya ulinzi wa data')} sub={text('Safeguarding your personal health records.', 'Kulinda kumbukumbu zako binafsi za afya.')}>
    <h2>{text('Device-only records', 'Kumbukumbu kwenye kifaa pekee')}</h2>
    <p>{text('Guest personal records are encrypted on your device and protected by a six-digit PIN. The unlock key is kept in memory, not persistent browser storage. If you forget your PIN, these local records cannot be recovered.', 'Kumbukumbu binafsi za mgeni husimbwa kwenye kifaa chako na kulindwa kwa PIN ya tarakimu sita. Ufunguo wa kufungua huhifadhiwa kwenye kumbukumbu ya muda, si hifadhi ya kudumu ya kivinjari. Ukisahau PIN, kumbukumbu hizi haziwezi kurejeshwa.')}</p>
    <h2>{text('Account records and access', 'Kumbukumbu za akaunti na ufikiaji')}</h2>
    <p>{text('Account records are stored through authenticated access controls that restrict personal records to their owner. Adult registration and consent are required before saving personal data. Do not share your account credentials or PIN.', 'Kumbukumbu za akaunti huhifadhiwa kwa udhibiti wa ufikiaji unaohitaji uthibitisho na unaozuia ufikiaji wa kumbukumbu binafsi kwa mwenyewe. Usajili wa mtu mzima na idhini vinahitajika kabla ya kuhifadhi taarifa binafsi. Usishiriki taarifa za kuingia au PIN yako.')}</p>
    <h2>{text('Locking and privacy', 'Kufunga na faragha')}</h2>
    <p>{text('Device-only storage locks after five minutes in the background. Five incorrect PIN attempts trigger a 30-second wait. Quick exit clears the in-memory unlock key; it does not erase browser history or previously downloaded files.', 'Hifadhi ya kifaa hufungwa baada ya dakika tano programu ikiwa chinichini. Majaribio matano ya PIN isiyo sahihi husababisha kusubiri sekunde 30. Kutoka haraka huondoa ufunguo wa muda; hakufuti historia ya kivinjari au faili zilizopakuliwa awali.')}</p>
    <h2>{text('Your controls', 'Udhibiti wako')}</h2>
    <p>{text('Use the privacy controls in your profile to export or delete your records. Downloads are outside the protected app storage, so keep them secure. Referrals remain unavailable until a consent-based sharing process is ready.', 'Tumia udhibiti wa faragha kwenye wasifu kupakua au kufuta kumbukumbu zako. Faili zilizopakuliwa ziko nje ya hifadhi iliyolindwa ya programu, hivyo zilinde. Rufaa bado hazipatikani hadi mchakato wa kushiriki kwa idhini uwe tayari.')}</p>
    <h2>{text('Questions about this policy', 'Maswali kuhusu sera hii')}</h2>
    <p>{text('If a question about how your records are protected is not answered here, contact the team.', 'Ikiwa swali kuhusu jinsi kumbukumbu zako zinavyolindwa halijajibiwa hapa, wasiliana na timu.')}</p>
    <p><Link to="/privacy" className="font-semibold text-primary underline underline-offset-4">{text('Privacy policy', 'Sera ya faragha')}</Link> · <Link to="/contact" className="font-semibold text-primary underline underline-offset-4">{text('Contact the team', 'Wasiliana na timu')}</Link></p>
  </InfoPage>;
}