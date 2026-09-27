import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';
import { BrandLogo } from '../BrandLogo/BrandLogo';
import { CloseIcon, MenuIcon, UserIcon } from '../Icons/Icons';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import './Header.scss';

export function Header() {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const close = () => {
    setOpen(false);
    setLanguageOpen(false);
  };

  return (
    <header className="header">
      <Link to="/" className="brand" onClick={close} aria-label={`Opium Lounge — ${t('common.navHome')}`}>
        <BrandLogo />
      </Link>
      <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label={t('common.openMenu')} aria-expanded={open}>
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      <nav className={open ? 'nav nav--open' : 'nav'} aria-label={t('common.mainNavigation')}>
        <NavLink to="/" onClick={close}>{t('common.navHome')}</NavLink>
        <NavLink to="/booking" onClick={close}>{t('common.navMap')}</NavLink>
        <NavLink to="/menu" onClick={close}>{t('common.navMenu')}</NavLink>
        <NavLink to="/profile" onClick={close} className="nav-profile">
          <UserIcon size={18} />{user ? user.name.split(' ')[0] : t('common.navProfile')}
        </NavLink>
        <LanguageSwitcher open={languageOpen} onOpenChange={setLanguageOpen} />
      </nav>
    </header>
  );
}
