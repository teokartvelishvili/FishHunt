'use client';

import "./footer.css";
import Link from "next/link";
import { useLanguage } from "@/hooks/LanguageContext";
import { FaFacebook, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-title">{t('footer.about')}</h3>
          <p className="footer-description">
            {t('footer.aboutText')}
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-title">{t('footer.quickLinks')}</h3>
          <ul className="footer-links">
            <li><Link href="/">{t('navbar.home')}</Link></li>
            <li><Link href="/fishing">{t('navbar.fishing')}</Link></li>
            <li><Link href="/hunting">{t('navbar.hunting')}</Link></li>
            <li><Link href="/camping">{t('navbar.camping')}</Link></li>
            <li><Link href="/shop">{t('navbar.shop')}</Link></li>
            <li><Link href="/forum">{t('navbar.forum')}</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h3 className="footer-title">{t('footer.legal')}</h3>
          <ul className="footer-links">
            <li><Link href="/privacy-policy">{t('footer.privacyPolicy')}</Link></li>
            <li><Link href="/terms-conditions">{t('footer.termsConditions')}</Link></li>
            <li><Link href="/return-policy">{t('footer.returnPolicy')}</Link></li>
            <li><Link href="/shipping-info">{t('footer.shippingInfo')}</Link></li>
            <li><Link href="/faq">{t('footer.faq')}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3 className="footer-title">{t('footer.contact')}</h3>
          <ul className="footer-contact">
            <li>
              <FaPhone />
              <a href="tel:+995551999055">+995 551 999 055</a>
            </li>
            <li>
              <FaEnvelope />
              <a href="mailto:info@fishhunt.ge">info@fishhunt.ge</a>
            </li>
            <li>
              <FaMapMarkerAlt />
              <span>{t('footer.address')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} FishHunt.ge - {t('footer.rightsReserved')}</p>
        {/* <p className="footer-developer">
          {t('footer.developedBy')} <a href="https://portfolio.example.com" target="_blank" rel="noopener noreferrer">Teo Kartvelishvili</a>
        </p> */}
      </div>
    </footer>
  );
}