


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import pa from '../locales/pa.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LANGUAGE_KEY = 'LANG';

// Accept language **code** directly
export const setAppLanguage = async (langCode) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, langCode);
    i18n.changeLanguage(langCode);
  } catch (err) {
    console.error('Error setting language:', err);
  }
};

// Load saved language on app start
export const loadAppLanguage = async () => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang) i18n.changeLanguage(savedLang);
    else {
      // detect device language if no saved language
      const bestLang = Localization.findBestAvailableLanguage(['en','hi','pa']);
      i18n.changeLanguage(bestLang?.languageTag || 'en');
    }
  } catch (err) {
    console.error('Error loading language:', err);
  }
};

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  pa: { translation: pa },
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources,
    interpolation: { escapeValue: false },
  });

export default i18n;
