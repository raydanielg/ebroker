import { getTranslationByLocale } from "@/utils/translation";
import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const TranslationContext = createContext();

export const useTranslation = () => {
  return useContext(TranslationContext);
};

export const TranslationProvider = ({ children }) => {
  // Use current_language for translations from Redux
  const translations = useSelector(
    (state) => state.LanguageSettings?.current_language?.file_name
  );
  
  // Use active_language as the current locale (user selected or default)
  const activeLocale = useSelector(
    (state) => state.LanguageSettings?.active_language
  );
  
  // Fallback to default_language if active_language is not set
  const defaultLocale = useSelector(
    (state) => state.LanguageSettings?.default_language
  );
  
  const currentLocale = activeLocale || defaultLocale;
  
  const t = (label) => {
    // First try to use translations from Redux
    if (translations && translations[label]) {
      return translations[label];
    } 
    
    // Fallback to local translations if Redux translations are missing
    const localTranslations = getTranslationByLocale(currentLocale);
    if (localTranslations && localTranslations[label]) {
      return localTranslations[label];
    }
    
    // Return the label itself as last resort
    return label;
  };
  
  return (
    <TranslationContext.Provider value={t}>
      {children}
    </TranslationContext.Provider>
  );
};
