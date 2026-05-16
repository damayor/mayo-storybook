import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';

const SUPPORTED = ['en', 'es', 'de'];
const saved = localStorage.getItem('i18n-lang');
const browser = navigator.language.split('-')[0];
const initialLang = SUPPORTED.includes(saved!) ? saved!
  : SUPPORTED.includes(browser) ? browser
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      de: { translation: de },
    },
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18n-lang', lng);
});

export default i18n;
