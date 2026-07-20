import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import esCommon from './es/common.json';
import esAuth from './es/auth.json';
import enClasses from './en/classes.json';
import esClasses from './es/classes.json';
import enPlans from './en/plans.json';
import esPlans from './es/plans.json';
import enProfile from './en/profile.json';
import esProfile from './es/profile.json';
import enAdmin from './en/admin.json';
import esAdmin from './es/admin.json';
import enValidation from './en/validation.json';
import esValidation from './es/validation.json';
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    classes: enClasses,
    plans: enPlans,
    profile: enProfile,
    admin: enAdmin,
    validation: enValidation
  },
  es: {
    common: esCommon,
    auth: esAuth,
    classes: esClasses,
    plans: esPlans,
    profile: esProfile,
    admin: esAdmin,
    validation: esValidation
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
