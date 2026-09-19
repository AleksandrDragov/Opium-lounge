import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import cs from './locales/cs.json';
import en from './locales/en.json';
import uk from './locales/uk.json';
import ru from './locales/ru.json';

export type Language = 'cs' | 'en' | 'uk' | 'ru';
const supported: Language[] = ['cs', 'en', 'uk', 'ru'];
const storageKey = 'opium-language';

function storedLanguage(): Language {
  try {
    const value = window.localStorage.getItem(storageKey);
    if (supported.includes(value as Language)) return value as Language;
  } catch { /* Private browsing can block storage. */ }
  return 'cs';
}

export function currentLanguage(): Language {
  const value = i18n.resolvedLanguage || i18n.language;
  return supported.includes(value as Language) ? value as Language : 'cs';
}

export function currentLocale() {
  return { cs: 'cs-CZ', en: 'en-US', uk: 'uk-UA', ru: 'ru-RU' }[currentLanguage()];
}

function updateDocument(language: string) {
  document.documentElement.lang = language;
  document.title = i18n.t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t('meta.description'));
  try { window.localStorage.setItem(storageKey, language); } catch { /* Language still works for this visit. */ }
}

i18n.use(initReactI18next).init({
  resources: { cs: { translation: cs }, en: { translation: en }, uk: { translation: uk }, ru: { translation: ru } },
  lng: storedLanguage(),
  fallbackLng: 'cs',
  supportedLngs: supported,
  interpolation: { escapeValue: false },
  initAsync: false,
  returnEmptyString: true,
});

i18n.on('languageChanged', updateDocument);
updateDocument(currentLanguage());

export default i18n;
