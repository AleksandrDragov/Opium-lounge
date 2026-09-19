import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../app/AuthContext';
import { currentLanguage, type Language } from '../i18n';
import { BrandLogo } from './BrandLogo';
import { CloseIcon, MenuIcon, UserIcon } from './Icons';

declare const __GITHUB_PAGES__: boolean;

export function Layout() {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const close = () => setOpen(false);
  return (
    <div className="site-shell">
      <header className="header">
        <Link to="/" className="brand" onClick={close} aria-label={`Opium Lounge — ${t('common.navHome')}`}>
          <BrandLogo />
        </Link>
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label={t('common.openMenu')} aria-expanded={open}>{open ? <CloseIcon /> : <MenuIcon />}</button>
        <nav className={open ? 'nav nav--open' : 'nav'} aria-label={t('common.mainNavigation')}>
          <NavLink to="/" onClick={close}>{t('common.navHome')}</NavLink>
          <NavLink to="/booking" onClick={close}>{t('common.navMap')}</NavLink>
          <NavLink to="/menu" onClick={close}>{t('common.navMenu')}</NavLink>
          <NavLink to="/profile" onClick={close} className="nav-profile"><UserIcon size={18}/>{user ? user.name.split(' ')[0] : t('common.navProfile')}</NavLink>
          <label className="language-switcher"><span className="sr-only">{t('common.language')}</span><select aria-label={t('common.language')} value={currentLanguage()} onChange={(event) => i18n.changeLanguage(event.target.value as Language)}><option value="cs">CZ</option><option value="en">EN</option><option value="uk">UA</option><option value="ru">RU</option></select></label>
        </nav>
      </header>
      <main><Outlet /></main>
      {__GITHUB_PAGES__ && <aside className="pages-preview" role="note">{t('pagesPreview.notice')}</aside>}
      <footer className="footer">
        <div className="footer-brand" role="img" aria-label="Opium Lounge"><BrandLogo /></div>
        <p>{t('common.footerMotto')}</p>
        <div><span>{t('common.openingSoon')}</span><span>© {new Date().getFullYear()} Opium Lounge</span></div>
      </footer>
    </div>
  );
}
