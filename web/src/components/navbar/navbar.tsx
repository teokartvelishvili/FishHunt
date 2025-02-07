"use client";

import { useContext } from "react";
import { LanguageContext } from "../../hooks/LanguageContext";
import { TEXTS } from "../../hooks/Languages";
import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image"; // StaticImageData ტიპის იმპორტი
import "./navbar.css";

import homeIcon from "../../assets/icons/home.png";
import fishing from "../../assets/icons/fishing.png";
import hunting from "../../assets/icons/hunting.png";
import camping from "../../assets/icons/camping.png";
import shopping from "../../assets/icons/shopping.png";
import video from "../../assets/icons/video.png";
import forum from "../../assets/icons/forum.png";
import about from "../../assets/icons/about.png";

interface MenuItem {
  href: string;
  text: string;
  icon: StaticImageData;
}

const Navbar: React.FC = () => {
  const { language } = useContext(LanguageContext);

  const menuItems: MenuItem[] = [
    { href: "/", text: TEXTS[language].home, icon: homeIcon },
    { href: "/fishing", text: "Fishing", icon: fishing },
    { href: "/hunting", text: "Hunting", icon: hunting },
    { href: "/camping", text: "Camping", icon: camping },
    { href: "/shop", text: "Shopping", icon: shopping },
    { href: "/video", text: "Video", icon: video },
    { href: "/forum", text: "Forum", icon: forum },
    { href: "/about", text: TEXTS[language].about, icon: about },
  ];

  return (
    <div className="NavCont">
      <ul className="UlCont">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link href={item.href}>
              <Image src={item.icon} alt={item.text} width={20} height={20} className="icon" />
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
