import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../Icons/Icons';
import './About.scss';

export function About() {
  const { t } = useTranslation();
  return (
    <section className="about section container">
      <div className="section-heading"><p className="eyebrow"><span/> {t('home.atmosphere')}</p><h2>{t('home.aboutLine1')}<br/><em>{t('home.aboutLine2')}</em></h2></div>
      <div className="about-grid">
        <div className="visual-card visual-card--main"><span className="visual-number">01</span><div className="neon-sign">{t('home.noRulesLine1')}<br/>{t('home.noRulesLine2')}</div></div>
        <div className="about-copy"><p>{t('home.aboutText1')}</p><p>{t('home.aboutText2')}</p><Link to="/booking" className="text-link">{t('home.chooseTable')} <ArrowIcon/></Link></div>
      </div>
    </section>
  );
}
