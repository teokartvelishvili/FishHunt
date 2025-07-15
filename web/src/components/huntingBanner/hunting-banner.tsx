"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/hooks/LanguageContext";
import "./hunting-banner.css";

export const HuntingBanner: React.FC = () => {
  const { language } = useLanguage();
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Function to check if an element is in viewport
    const isInViewport = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) *
            0.85 && rect.bottom >= 0
      );
    };

    const checkScroll = () => {
      contentRefs.current.forEach((element) => {
        if (element && isInViewport(element)) {
          // Add active class to make elements visible
          element.classList.add("active");
        }
      });
    };

    // Run initial check after a small delay to ensure DOM is ready
    setTimeout(checkScroll, 300);

    // Check on scroll with debounce
    const handleScroll = () => {
      checkScroll();
    };

    window.addEventListener("scroll", handleScroll);
    // Also check on window resize
    window.addEventListener("resize", handleScroll);

    // Force check visibility on load
    window.addEventListener("load", checkScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("load", checkScroll);
    };
  }, []);

  return (
    <div className="hunting-banner-container">
      <div
        className="hunting-banner-content reveal"
        ref={(el) => {
          contentRefs.current[0] = el;
        }}
      >
        <div className="hunting-banner-text">
          <h2>
            {language === "ge"
              ? "რომელია ყველაზე პოპულარული იარაღი ნადირობისთვის?"
              : "What is the most popular weapon for hunting?"}
          </h2>
          <p>
            {language === "ge"
              ? "აღმოაჩინე ჩვენს მაღაზიაში ყველაზე საჭირო და პოპულარული ნივთები"
              : "Discover the most essential and popular items in our store"}
          </p>
          <Link href="/shop" className="hunting-banner-button">
            {language === "ge" ? "აღმოაჩინე" : "Discover"}
          </Link>
        </div>
        <div className="hunting-banner-image">
          <Image
            src="/Rectangle 9.png"
            alt={language === "ge" ? "სანადირო იარაღი" : "Hunting Weapon"}
            width={500}
            height={300}
            priority={true}
          />
        </div>
      </div>

      <div
        className="hunting-banner-footer reveal"
        ref={(el) => {
          contentRefs.current[1] = el;
        }}
      >
        <h2>
          {language === "ge"
            ? "ექსკლუზიური შეთავაზებებისთვის დარეგისტრირდი ჩვენს საიტზე"
            : "Register on our site for exclusive offers"}
        </h2>
        <Link href="/register" className="hunting-banner-button">
          {language === "ge" ? "დარეგისტრირდი" : "Register"}
        </Link>
      </div>

      <div
        className="hunting-banner-content reveal"
        ref={(el) => {
          contentRefs.current[2] = el;
        }}
      >
        <div className="hunting-banner-image">
          <Image
            src="/banner2.png"
            alt={language === "ge" ? "სანადირო იარაღი" : "Hunting Weapon"}
            width={500}
            height={300}
          />
        </div>
        <div className="hunting-banner-text">
          <h2>
            {language === "ge" ? "გიყვარს თევზაობა?" : "Do you love fishing?"}
          </h2>
          <p>
            {language === "ge"
              ? "აღმოაჩინე საუკეთესო სათევზაო აღჭურვილობა ჩვენთან!"
              : "Discover the best fishing equipment with us!"}
          </p>
          <Link href="/shop" className="hunting-banner-button">
            {language === "ge" ? "აღმოაჩინე" : "Discover"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HuntingBanner;
