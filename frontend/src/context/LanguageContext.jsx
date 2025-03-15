// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en.json';
import teTranslations from '../locales/te.json';
import taTranslations from '../locales/ta.json';
import hiTranslations from '../locales/hi.json';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const resources = {
  en: { translation: enTranslations },
  te: { translation: teTranslations },
  ta: { translation: taTranslations },
  hi: { translation: hiTranslations }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};