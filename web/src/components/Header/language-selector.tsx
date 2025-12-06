"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/LanguageContext";
import "./language-selector.css";
import Image from "next/image";
import geoFlag from "../../assets/geoFlag.png";
import engFlag from "../../assets/engFlag.png";

// TODO: დაამატეთ რუსული დროშა assets-ში (rusFlag.png)
// დროებით გამოიყენება ინგლისური დროშა
const rusFlag = engFlag;

const LANGUAGES = [
  { code: "ge", name: "ქართული", flag: geoFlag },
  { code: "en", name: "English", flag: engFlag },
  { code: "ru", name: "Русский", flag: rusFlag },
] as const;

type LanguageCode = "ge" | "en" | "ru";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <Image
          src={currentLanguage.flag}
          alt={currentLanguage.name}
          width={24}
          height={16}
          className="language-flag"
        />
        <span className="language-code">{language.toUpperCase()}</span>
        <svg
          className={`language-arrow ${isOpen ? "open" : ""}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${
                language === lang.code ? "active" : ""
              }`}
              onClick={() => handleLanguageChange(lang.code as LanguageCode)}
            >
              <Image
                src={lang.flag}
                alt={lang.name}
                width={24}
                height={16}
                className="language-flag"
              />
              <span className="language-name">{lang.name}</span>
              {language === lang.code && (
                <svg
                  className="language-check"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
