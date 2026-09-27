import { useTranslation } from 'react-i18next';
import './Marquee.scss';

export function Marquee() {
  const { t } = useTranslation();
  return (
    <section className="marquee" aria-label={t('home.whyOpium')}><div>{t('home.marquee')}</div></section>
  );
}
