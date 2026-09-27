import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../Icons/Icons';
import './VipRooms.scss';

export function VipRooms() {
  const { t } = useTranslation();
  return (
    <section className="vip section container">
      <div className="vip-visual"><div className="vip-tag">{t('home.vipTag1')}<br/>{t('home.vipTag2')}</div><span>{t('home.vipCaption')}</span></div>
      <div className="vip-copy"><p className="eyebrow"><span/> {t('home.vipKicker')}</p><h2>{t('home.vipLine1')}<br/><em>{t('home.vipLine2')}</em></h2><p>{t('home.vipText')}</p><Link to="/booking" className="button button--outline">{t('home.vipButton')} <ArrowIcon/></Link></div>
    </section>
  );
}
