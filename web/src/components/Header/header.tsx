"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/logo.png";
import SearchBox from "../SearchBox/search-box";
import { CartIcon } from "@/modules/cart/components/cart-icon";
import UserMenu from "./user-menu";
import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="left-section">
            <Link href="/" className="logo">
              Fish
              <Image className="logoImage" src={logo} alt="" />
              Hunt
            </Link>
          </div>

          {/* Search box for desktop */}
          <div className="search-box desktop-only">
            <SearchBox />
          </div>

          {/* Cart and User Menu */}
          <nav className="nav-menu">
            <CartIcon />
            <UserMenu />
          </nav>
        </div>
      </div>

      {/* Search box for mobile */}
      <div className="search-box mobile-only">
        <SearchBox />
      </div>
    </header>
  );
}
