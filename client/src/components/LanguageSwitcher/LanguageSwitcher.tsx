import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { currentLanguage, type Language } from '../../i18n';
import './LanguageSwitcher.scss';

const languageOptions: { code: Language; name: string }[] = [
  { code: 'cs', name: 'Čeština' },
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Українська' },
  { code: 'ru', name: 'Русский' },
];

type LanguageSwitcherProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LanguageSwitcher({ open, onOpenChange }: LanguageSwitcherProps) {
  const languageRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) onOpenChange(false);
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [open, onOpenChange]);

  return (
    <div
      className="language-switcher"
      ref={languageRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          onOpenChange(false);
          languageButtonRef.current?.focus();
        }
      }}
    >
      <button
        className="language-switcher__trigger"
        type="button"
        ref={languageButtonRef}
        aria-label={`${t('common.language')}: ${currentLanguage().toUpperCase()}`}
        aria-expanded={open}
        aria-controls="language-options"
        onClick={() => onOpenChange(!open)}
      >
        <span>{currentLanguage().toUpperCase()}</span>
        <svg aria-hidden="true" viewBox="0 0 12 8" width="12" height="8">
          <path d="m1 1 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="language-switcher__menu" id="language-options" role="group" aria-label={t('common.language')}>
          {languageOptions.map(({ code, name }) => (
            <button
              className="language-switcher__option"
              type="button"
              key={code}
              aria-current={currentLanguage() === code ? 'true' : undefined}
              onClick={() => {
                i18n.changeLanguage(code);
                onOpenChange(false);
                languageButtonRef.current?.focus();
              }}
            >
              <span>{code.toUpperCase()}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
