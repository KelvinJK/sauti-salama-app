import { useI18n } from './i18n';
export function useAppText() {
  const { lang } = useI18n();
  return (en: string, sw: string) => lang === 'sw' ? sw : en;
}