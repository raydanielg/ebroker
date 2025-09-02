"use client";
import enTranslation from "./en.json";
export const getTranslationByLocale = (locale) => {
  switch (locale) {
    case "en-new":
      return enTranslation;
    default:
      return enTranslation;
  }
};
