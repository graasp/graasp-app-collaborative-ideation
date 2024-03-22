import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';

import mainEn from '../langs/en/main.json';
import promptsEn from '../langs/en/prompts.json';

import mainFr from '../langs/fr/main.json';
import promptsFr from '../langs/fr/prompts.json';

import mainEs from '../langs/es/main.json';
import promptsEs from '../langs/es/prompts.json';

import { DEFAULT_LANG } from './constants';

export const TRANSLATIONS_NS = 'translations';
export const PROMPTS_NS = 'prompts';
export const defaultNS = TRANSLATIONS_NS;

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANG,
  // debug only when not in production
  debug: import.meta.env.DEV,
  ns: [defaultNS],
  defaultNS,
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  fallbackLng: 'en',
});

i18n.addResourceBundle('en', TRANSLATIONS_NS, mainEn);
i18n.addResourceBundle('en', PROMPTS_NS, promptsEn);
i18n.addResourceBundle('fr', TRANSLATIONS_NS, mainFr);
i18n.addResourceBundle('fr', PROMPTS_NS, promptsFr);
i18n.addResourceBundle('es', TRANSLATIONS_NS, mainEs);
i18n.addResourceBundle('es', PROMPTS_NS, promptsEs);

export default i18n;
