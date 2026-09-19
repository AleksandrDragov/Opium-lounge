import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowIcon, CalendarIcon, LocationIcon, MusicIcon, SmokeIcon, StarIcon } from '../components/Icons';

const perks = [
  { icon: <SmokeIcon/>, number: '01', title: 'home.perk1Title', text: 'home.perk1Text' },
  { icon: <MusicIcon/>, number: '02', title: 'home.perk2Title', text: 'home.perk2Text' },
  { icon: <StarIcon/>, number: '03', title: 'home.perk3Title', text: 'home.perk3Text' },
];

export function HomePage() {
  const { t } = useTranslation();
  return <>
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

    <section className="marquee" aria-label={t('home.whyOpium')}><div>{t('home.marquee')}</div></section>

    <section className="about section container">
      <div className="section-heading"><p className="eyebrow"><span/> {t('home.atmosphere')}</p><h2>{t('home.aboutLine1')}<br/><em>{t('home.aboutLine2')}</em></h2></div>
      <div className="about-grid">
        <div className="visual-card visual-card--main"><span className="visual-number">01</span><div className="neon-sign">{t('home.noRulesLine1')}<br/>{t('home.noRulesLine2')}</div></div>
        <div className="about-copy"><p>{t('home.aboutText1')}</p><p>{t('home.aboutText2')}</p><Link to="/booking" className="text-link">{t('home.chooseTable')} <ArrowIcon/></Link></div>
      </div>
    </section>

    <section className="perks section">
      <div className="container"><p className="eyebrow"><span/> {t('home.whyOpium')}</p><div className="perks-grid">{perks.map((perk) => <article className="perk" key={perk.title}><div className="perk-top">{perk.icon}<span>{perk.number}</span></div><h3>{t(perk.title)}</h3><p>{t(perk.text)}</p></article>)}</div></div>
    </section>

    <section className="vip section container">
      <div className="vip-visual"><div className="vip-tag">{t('home.vipTag1')}<br/>{t('home.vipTag2')}</div><span>{t('home.vipCaption')}</span></div>
      <div className="vip-copy"><p className="eyebrow"><span/> {t('home.vipKicker')}</p><h2>{t('home.vipLine1')}<br/><em>{t('home.vipLine2')}</em></h2><p>{t('home.vipText')}</p><Link to="/booking" className="button button--outline">{t('home.vipButton')} <ArrowIcon/></Link></div>
    </section>

    <section className="gallery section">
      <div className="container"><div className="section-heading row"><div><p className="eyebrow"><span/> {t('home.galleryKicker')}</p><h2>{t('home.galleryTitle')} <em>OPIUM.</em></h2></div><span className="hand-note">{t('home.galleryNote1')}<br/>{t('home.galleryNote2')}</span></div></div>
      <div className="gallery-strip"><div className="gallery-shot shot-1"><span>{t('home.galleryBar')}</span></div><div className="gallery-shot shot-2"><span>{t('home.galleryMain')}</span></div><div className="gallery-shot shot-3"><span>{t('home.galleryVip')}</span></div></div>
    </section>

    <section className="contact section container">
      <div><p className="eyebrow"><span/> {t('home.contactKicker')}</p><h2>{t('home.contactLine1')}<br/><em>{t('home.contactLine2')}</em></h2></div>
      <div className="contact-card"><p>{t('home.contactText')}</p><Link to="/booking" className="button button--primary">{t('home.contactButton')} <ArrowIcon/></Link></div>
    </section>
  </>;
}
