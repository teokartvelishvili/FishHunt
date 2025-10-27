"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/LanguageContext";
import "./user-menu.css";
import { Role } from "@/types/role";
import hunterIcon from "../../assets/icons/hunter.png";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import {
  User,
  ShoppingBag,
  Package,
  Users,
  ClipboardList,
  FolderTree,
  ImageIcon,
  LogOut,
  X,
} from "lucide-react";

export default function UserMenu() {
  const { t } = useLanguage();
  const { user, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    } else {
      setProfileImage("/avatar.jpg");
    }
    console.log("User profile updated:", user);
  }, [user]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen && window.innerWidth <= 768) {
      document.body.classList.add('mobile-menu-open');
      
      // Scroll to top when menu opens on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <div className="loader"></div>;
  }

  if (!user) {
    return (
      <Link href="/login" className="button sign-in-button">
        <span className="icon">
          <Image src={hunterIcon} alt="hunterIcon" width={28} height={28} />
        </span>
        <span className="sign-in-text">{t("navigation.login")}</span>
      </Link>
    );
  }

  // Extract first name (before space)
  const firstName = user.name?.split(" ")[0] || "მომხმარებელი";

  return (
    <div className="dropdown" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="button user-button"
        aria-label="Toggle user menu"
      >
        <div className="user-avatar">
          <Image
            src={profileImage || "/avatar.jpg"}
            alt={user.name}
            width={32}
            height={32}
            className="avatar-image"
          />
        </div>
        <span className="username desktop-name">
          {user.name || "მომხმარებელი"}
        </span>
        <span className="username mobile-name">{firstName}</span>
      </button>
      {isOpen && (
        <div
          className="dropdown-menu"
          onClick={(e) => {
            // Close on backdrop click (mobile full-screen)
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <button
            className="mobile-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          <div className="dropdown-label">{t("userMenu.myAccount")}</div>
          <hr />
          <Link
            href="/profile"
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <User size={20} />
            {t("navigation.profile")}
          </Link>
          <Link
            href="/profile/orders"
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag size={20} />
            {t("navigation.orders")}
          </Link>

          {(user.role === Role.Admin || user.role === Role.Seller) && (
            <>
              <hr />
              <div className="dropdown-label">
                {t("userMenu.adminDashboard")}
              </div>
              <Link
                href="/admin/products"
                className="dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                <Package size={20} />
                {t("navigation.products")}
              </Link>
            </>
          )}

          {user.role === Role.Admin && (
            <>
              <Link
                href="/admin/users"
                className="dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                <Users size={20} />
                {t("navigation.users")}
              </Link>
              <Link
                href="/admin/orders"
                className="dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                <ClipboardList size={20} />
                {t("navigation.orders")}
              </Link>
              <Link
                href="/admin/categories"
                className="dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                <FolderTree size={20} />
                {t("navigation.categories")}
              </Link>
              <Link
                href="/admin/banners"
                className="dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                <ImageIcon size={20} />
                {t("navigation.banners")}
              </Link>
            </>
          )}

          <hr />
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="dropdown-item logout-button"
          >
            <LogOut size={20} />
            {t("navigation.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
