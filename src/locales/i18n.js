import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import esCommon from './es/common.json';
import esAuth from './es/auth.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth
  },
  es: {
    common: esCommon,
    auth: esAuth
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
  
    ns: ['common', 'auth'],
    defaultNS: 'common',
  
    lng: 'es',
    fallbackLng: 'es',
  
    interpolation: {
      escapeValue: false,
    },
  })
export default i18n;
