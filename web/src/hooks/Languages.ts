"use client";

export interface TranslationContent {
  [key: string]: string | string[] | TranslationContent;
}

export interface Translations {
  [key: string]: TranslationContent;
}

export const TRANSLATIONS: Translations = {
  ge: {
    home: "მთავარი",
    homeContent: 'ეს არის "მთავარი" გვერდი.', // ქართული აღწერა
    about: "ჩვენს შესახებ",
    aboutContent: 'ეს არის "ჩვენს შესახებ" გვერდი.', // ქართული აღწერა
    contact: "კონტაქტი",
    contactContent: "დაგვიკავშირდით აქ.", // ქართული აღწერა
  },
  en: {
    home: "HOME",
    homeContent: "This is the 'Home' page.", // ინგლისური აღწერა
    about: "About",
    aboutContent: "This is the 'About' page.", // ინგლისური აღწერა
    contact: "Contact",
    contactContent: "Contact us here.", // ინგლისური აღწერა
  },
};
