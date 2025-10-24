import translations from '../../../data/lang.json';

export type Language = 'en' | 'bn';

export type TranslationType = typeof translations.en;

export const languages = translations;

export const getTranslations = (lang: Language): TranslationType => {
  return translations[lang];
};
