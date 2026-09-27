import './LoadingPage.scss';
import { useTranslation } from 'react-i18next';

export function LoadingPage() {
  const { t } = useTranslation();
  return <div className="loader page">{t('common.loading')}</div>;
}
