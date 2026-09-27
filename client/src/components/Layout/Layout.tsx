import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import './Layout.scss';

declare const __GITHUB_PAGES__: boolean;

export function Layout() {
  const { t } = useTranslation();

  return (
    <div className="site-shell">
      <Header />
      <main><Outlet /></main>
      {__GITHUB_PAGES__ && <aside className="pages-preview" role="note">{t('pagesPreview.notice')}</aside>}
      <Footer />
    </div>
  );
}
