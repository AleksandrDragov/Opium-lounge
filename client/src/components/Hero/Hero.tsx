import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowIcon, CalendarIcon, LocationIcon } from '../Icons/Icons';
import './Hero.scss';

export function Hero() {
  const { t } = useTranslation();
  return (
    <section className="hero">
      <div className="hero-noise"/><div className="hero-orb hero-orb--one"/><div className="hero-orb hero-orb--two"/>
      <div className="hero-art" aria-hidden="true" data-tagline={t('home.afterDark')}><span>OPIUM</span><i>{t('home.afterDark')}</i></div>
      <div className="hero-content container">
        <p className="eyebrow"><span/> {t('home.kicker')}</p>
        <h1>{t('home.heroLine1')}<br/><em>{t('home.heroLine2')}</em></h1>
        <p className="hero-copy">{t('home.heroDescription')}</p>
        <div className="hero-actions">
          <Link to="/booking" className="button button--primary">{t('home.reserve')} <ArrowIcon/></Link>
          <Link to="/menu" className="text-link">{t('home.viewMenu')} <span>↗</span></Link>
        </div>
        <div className="hero-meta"><span><CalendarIcon/> {t('home.scheduleSoon')}</span><span><LocationIcon/> {t('home.locationSoon')}</span></div>
      </div>
      <span className="scroll-label">{t('home.scroll')}</span>
    </section>
  );
}
