import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../Icons/Icons';
import './Contacts.scss';

export function Contacts() {
  const { t } = useTranslation();
  return (
    <section className="contact section container">
      <div><p className="eyebrow"><span/> {t('home.contactKicker')}</p><h2>{t('home.contactLine1')}<br/><em>{t('home.contactLine2')}</em></h2></div>
      <div className="contact-card"><p>{t('home.contactText')}</p><Link to="/booking" className="button button--primary">{t('home.contactButton')} <ArrowIcon/></Link></div>
    </section>
  );
}
