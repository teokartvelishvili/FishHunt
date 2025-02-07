"use client";

import { useContext } from "react";
import { LanguageContext } from "@/hooks/LanguageContext";
import { TEXTS } from "@/hooks/Languages";

const AboutPage = () => {
  const { language } = useContext(LanguageContext);  // Get the current language

  return (
    <div>
      <h1>{TEXTS[language].about}</h1>
      <p>{TEXTS[language].aboutContent}</p>
    </div>
  );
}

export default AboutPage;
