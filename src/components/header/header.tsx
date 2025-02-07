"use client";

import React, { useContext } from "react";
import { LanguageContext } from "../../hooks/LanguageContext"; // Import LanguageContext
import Image from "next/image"; // Import Next.js Image component
import geoFlag from "../../assets/geoFlag.png";
import engFlag from "../../assets/engFlag.png";
// import Navbar from "../navbar/navbar";
import "./header.css";

const Header: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext); // Access LanguageContext

  const handleLangClick = () => {
    const newLanguage = language === "ge" ? "en" : "ge"; // Toggle language
    setLanguage(newLanguage); // Update language in context
  };

  return (
    <div className="header">
      <div className="ThemeToggle">
        <div className="toggles">
          <div>
            <Image
              className="lang"
              src={language === "ge" ? engFlag : geoFlag} // Toggle between flags
              alt={language === "ge" ? "English Flag" : "Georgian Flag"}
              width={50}
              height={35}
              onClick={handleLangClick} // Make image clickable
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
      {/* <Navbar /> */}
    </div>
  );
};

export default Header;
