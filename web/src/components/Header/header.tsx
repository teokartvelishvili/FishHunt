"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/logo.png";
import SearchBox from "../SearchBox/search-box";
import { CartIcon } from "@/modules/cart/components/cart-icon";
import UserMenu from "./user-menu";
import LanguageSelector from "./language-selector";
// import Pattern from "../pattern/pattern"; 
import "./header.css";
import Navbar from "../navbar/navbar";

export default function Header() {
  return (
    <header className="main-header">
      {/* Header 1 - Main content */}
      <div className="header1">
        {/* <Pattern imageSize={140}  /> */}
        <div className="container relative z-10">
          <div className="header-content">
            <div className="left-section">
              <Link href="/" className="logo">
                Fish
                <Image className="logoImage" src={logo} alt="" />
                Hunt
              </Link>
            </div>

            {/* Search box - desktop in header, mobile separate line */}
            <div className="search-box search-desktop">
              <SearchBox />
            </div>

            <div className="cart-user-menu">
              <CartIcon />
              <UserMenu />
              <LanguageSelector />
            </div>
            {/* Cart and User Men.u */}
            {/* <nav className="nav-menu">
            </nav> */}
          </div>
        </div>
        
        {/* Search box for mobile - separate line */}
        <div className="search-mobile-container">
          <SearchBox />
        </div>
      </div>

      {/* Header 2 - Navigation */}
      <div className="header2">
        <Navbar />
      </div>
    </header>
  );
}
