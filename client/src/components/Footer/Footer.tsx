import { useTranslation } from 'react-i18next';
import { BrandLogo } from '../BrandLogo/BrandLogo';
import './Footer.scss';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-brand" role="img" aria-label="Opium Lounge"><BrandLogo /></div>
      <p>{t('common.footerMotto')}</p>
      <div>
        <span>{t('common.openingSoon')}</span>
        <span>© {new Date().getFullYear()} Opium Lounge</span>
      </div>
    </footer>
  );
}
