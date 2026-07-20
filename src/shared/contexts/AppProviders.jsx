import { LanguageProvider } from './LanguageContext';
const AppProviders = ({ children }) => {
  return (
      <LanguageProvider>
          {children}
      </LanguageProvider>
  );
};
export default AppProviders