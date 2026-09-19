import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export function NotFoundPage() { const { t } = useTranslation(); return <section className="empty-state page"><span>404</span><h1>{t('notFound.title')}</h1><p>{t('notFound.text')}</p><Link className="button button--primary" to="/">{t('notFound.home')}</Link></section>; }
