"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import jeep from "../../assets/icons/jeep.png";

interface MenuItem {
  href: string;
  text: string;
  icon: StaticImageData;
}

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { href: "/", text: t("navigation.home"), icon: homeIcon },
    { href: "/fishing", text: t("navbar.fishing"), icon: fishing },
    { href: "/hunting", text: t("navbar.hunting"), icon: hunting },
    { href: "/camping", text: t("navbar.camping"), icon: camping },
    { href: "/shop", text: t("navigation.shop"), icon: shopping },
    { href: "/rentcar", text: t("navbar.rentCar"), icon: jeep },
    { href: "/video", text: t("navbar.video"), icon: video },
    { href: "/forum", text: t("navigation.forum"), icon: forum },
    { href: "/about", text: t("navigation.about"), icon: about },
  ];

  const handleClick = (e: React.MouseEvent, index: number, href: string) => {
    e.preventDefault();

    if (activeItem === index) {
      // თუ იგივე აიტემზე დავაკლიკეთ მეორედ, გადავდივართ ლინკზე
      router.push(href);
      setActiveItem(null); // ვასუფთავებთ აქტიურ აიტემს
    } else {
      // პირველი კლიკი - ვააქტიურებთ აიტემს
      setActiveItem(index);
    }
  };

  return (
    <div className="NavCont">
      <ul className="UlCont">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={activeItem === index ? "active" : ""}
              onClick={(e) => handleClick(e, index, item.href)}
              aria-label={item.text}
              title={item.text}
            >
              <Image
                src={item.icon}
                alt={item.text}
                width={20}
                height={20}
                className="icon"
              />
              <span>{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
