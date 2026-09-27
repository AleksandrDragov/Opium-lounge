import { useTranslation } from 'react-i18next';
import './Gallery.scss';

export function Gallery() {
  const { t } = useTranslation();
  return (
    <section className="gallery section">
      <div className="container"><div className="section-heading row"><div><p className="eyebrow"><span/> {t('home.galleryKicker')}</p><h2>{t('home.galleryTitle')} <em>OPIUM.</em></h2></div><span className="hand-note">{t('home.galleryNote1')}<br/>{t('home.galleryNote2')}</span></div></div>
      <div className="gallery-strip"><div className="gallery-shot shot-1"><span>{t('home.galleryBar')}</span></div><div className="gallery-shot shot-2"><span>{t('home.galleryMain')}</span></div><div className="gallery-shot shot-3"><span>{t('home.galleryVip')}</span></div></div>
    </section>
  );
}
