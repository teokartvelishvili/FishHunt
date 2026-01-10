"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Store, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import "./BecomeSellerPopup.css";

const POPUP_STORAGE_KEY = "become_seller_popup_shown";
const POPUP_EXPIRY_DAYS = 7; // Show popup again after 7 days

export function BecomeSellerPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    // Don't show popup if user is already a seller or admin
    if (user?.role === "seller" || user?.role === "admin") {
      return;
    }

    // Check if popup was already shown
    const storedData = localStorage.getItem(POPUP_STORAGE_KEY);
    if (storedData) {
      const { timestamp } = JSON.parse(storedData);
      const daysSinceShown = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
      if (daysSinceShown < POPUP_EXPIRY_DAYS) {
        return; // Don't show popup yet
      }
    }

    // Show popup after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(
      POPUP_STORAGE_KEY,
      JSON.stringify({ timestamp: Date.now() })
    );
  };

  const handleBecomeSellerClick = () => {
    handleClose();
    router.push("/sellers-register");
  };

  if (!isVisible) return null;

  const translations = {
    ka: {
      title: "გახდი გამყიდველი!",
      subtitle: "შექმენი პირადი ონლაინ მაღაზია",
      description: "გაყიდე შენი პროდუქტები ათასობით მომხმარებელზე. რეგისტრაცია უფასოა!",
      benefits: [
        "უფასო რეგისტრაცია",
        "საკუთარი მაღაზიის გვერდი",
        "სწრაფი გაყიდვები",
      ],
      button: "დაიწყე ახლავე",
      later: "მოგვიანებით",
    },
    en: {
      title: "Become a Seller!",
      subtitle: "Create Your Own Online Store",
      description: "Sell your products to thousands of customers. Registration is free!",
      benefits: [
        "Free registration",
        "Your own store page",
        "Quick sales",
      ],
      button: "Start Now",
      later: "Maybe Later",
    },
    ru: {
      title: "Стань продавцом!",
      subtitle: "Создай свой онлайн-магазин",
      description: "Продавай свои товары тысячам покупателей. Регистрация бесплатна!",
      benefits: [
        "Бесплатная регистрация",
        "Собственная страница магазина",
        "Быстрые продажи",
      ],
      button: "Начать сейчас",
      later: "Позже",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.ka;

  return (
    <div className="become-seller-overlay" onClick={handleClose}>
      <div className="become-seller-popup" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={handleClose}>
          <X size={24} />
        </button>

        <div className="popup-icon-wrapper">
          <Store size={48} className="popup-store-icon" />
          <Sparkles size={24} className="popup-sparkle" />
        </div>

        <h2 className="popup-title">{t.title}</h2>
        <p className="popup-subtitle">{t.subtitle}</p>
        <p className="popup-description">{t.description}</p>

        <ul className="popup-benefits">
          {t.benefits.map((benefit, index) => (
            <li key={index} className="popup-benefit-item">
              <span className="benefit-check">✓</span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="popup-actions">
          <button className="popup-cta-btn" onClick={handleBecomeSellerClick}>
            {t.button}
            <ArrowRight size={20} />
          </button>
          <button className="popup-later-btn" onClick={handleClose}>
            {t.later}
          </button>
        </div>
      </div>
    </div>
  );
}
