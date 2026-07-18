import { createContext, useState, useContext, useEffect } from 'react';
import i18n from '@/locales/i18n';
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'es';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (newLanguage !== 'es' && newLanguage !== 'en') {
      console.error('Invalid language');
      return;
    }
    setLanguage(newLanguage);
    
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
