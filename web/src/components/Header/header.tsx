"use client";

import React, { useContext, useState } from "react";
import { LanguageContext } from "../../hooks/LanguageContext"; // ენის კონტექსტი
import Image from "next/image"; // Next.js-ის Image კომპონენტი
import geoFlag from "../../assets/geoFlag.png"; // ქართული დროშა
import engFlag from "../../assets/engFlag.png"; // ინგლისური დროშა
import Link from "next/link";

// import { UserMenu } from '../navbar/user-menu';
// import { CartIcon } from '@/modules/cart/components/cart-icon';

import "./Header.css";
import SearchBox from "../SearchBox/search-box";
import { CartIcon } from "@/modules/cart/components/cart-icon";
import UserMenu from "./user-menu";

// import { SearchBox } from "../SearchBox/search-box";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext); // ენის კონტროლი

  const handleLangClick = () => {
    const newLanguage = language === "ge" ? "en" : "ge"; // ენების გადართვა
    setLanguage(newLanguage); // ახალი ენის დაყენება
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="left-section">
            <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "✖" : "☰"}
            </button>
            <Link href="/" className="logo">
              FishHant
            </Link>
          </div>

          <div className="search-box">
            <SearchBox />
          </div>

          <nav className="nav-menu">
            <CartIcon />
            <UserMenu />
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="mobile-menu">
          <div className="container">
            <div className="mobile-menu-content">
              <SearchBox />
              <div className="menu-icons">
                <div className="header__actions">
                  <Image
                    src={language === "ge" ? engFlag : geoFlag}
                    alt={language === "ge" ? "English Flag" : "Georgian Flag"}
                    width={35}
                    height={25}
                    onClick={handleLangClick}
                    className="header__lang"
                  />
                </div>
                <CartIcon />
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
