import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi) // Use the backend to load files
  .init({
    supportedLngs: ["en", "hi", "or"],
    fallbackLng: "en",
    detection: {
      order: ["cookie", "htmlTag", "localStorage"],
      caches: ["cookie"],
    },
    backend: {
      // Path to your translation files
      loadPath: "/locales/{{lng}}/translation.json",
    },
    // This is important for loading files and avoiding race conditions
    react: {
      useSuspense: true,
    },
  });

export default i18n;