"use client";
import Link from "next/link";
// import Pattern from "../../../components/pattern/pattern";
import React from "react";
import "./about.css";
import { useLanguage } from "../../../hooks/LanguageContext";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";


export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="about-container">
      {/* <Pattern imageSize={250}/> */}
      <div className="about-content">
        <h1 className="about-title">{t("aboutUs.title")}</h1>
        <p className="about-slogan">{t("aboutUs.slogan")}</p>
        
        <div className="about-section">
          <h2 className="section-subtitle">{t("aboutUs.sectionTitle")}</h2>
          <p className="section-text">
            {t("aboutUs.sectionText")}
          </p>
        </div>

        <div className="about-section">
          <h2 className="section-subtitle">{t("aboutUs.whatWeOfferTitle")}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>{t("aboutUs.wideRange")}</h3>
              <p>{t("aboutUs.wideRangeDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>{t("aboutUs.communityForum")}</h3>
              <p>{t("aboutUs.communityForumDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>{t("aboutUs.locationMap")}</h3>
              <p>{t("aboutUs.locationMapDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌤️</div>
              <h3>{t("aboutUs.weatherForecast")}</h3>
              <p>{t("aboutUs.weatherForecastDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🐟</div>
              <h3>{t("aboutUs.riversLakes")}</h3>
              <p>{t("aboutUs.riversLakesDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🦆</div>
              <h3>{t("aboutUs.huntingSeasons")}</h3>
              <p>{t("aboutUs.huntingSeasonsDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>{t("aboutUs.officialLaws")}</h3>
              <p>{t("aboutUs.officialLawsDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>{t("aboutUs.weaponExam")}</h3>
              <p>{t("aboutUs.weaponExamDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚙</div>
              <h3>{t("aboutUs.offroadRental")}</h3>
              <p>{t("aboutUs.offroadRentalDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎥</div>
              <h3>{t("aboutUs.videoPortal")}</h3>
              <p>{t("aboutUs.videoPortalDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>{t("aboutUs.fastDelivery")}</h3>
              <p>{t("aboutUs.fastDeliveryDesc")}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>{t("aboutUs.securePayment")}</h3>
              <p>{t("aboutUs.securePaymentDesc")}</p>
            </div>
          </div>
        </div>

        <div className="about-section highlight-section">
          <h2 className="section-subtitle">{t("aboutUs.expandBusinessTitle")}</h2>
          <p className="section-text">
            {t("aboutUs.expandBusinessText")}
          </p>
          
          <div className="benefits-list">
            <h3 className="benefits-title">{t("aboutUs.benefitsTitle")}</h3>
            <ul>
              <li>✅ <strong>{t("aboutUs.freeRegistration")}</strong> - {t("aboutUs.freeRegistrationDesc")}</li>
              <li>✅ <strong>{t("aboutUs.wideAudience")}</strong> - {t("aboutUs.wideAudienceDesc")}</li>
              <li>✅ <strong>{t("aboutUs.easyManagement")}</strong> - {t("aboutUs.easyManagementDesc")}</li>
              <li>✅ <strong>{t("aboutUs.orderManagement")}</strong> - {t("aboutUs.orderManagementDesc")}</li>
              <li>✅ <strong>{t("aboutUs.analyticsStats")}</strong> - {t("aboutUs.analyticsStatsDesc")}</li>
              <li>✅ <strong>{t("aboutUs.support247")}</strong> - {t("aboutUs.support247Desc")}</li>
              <li>✅ <strong>{t("aboutUs.promotionOptions")}</strong> - {t("aboutUs.promotionOptionsDesc")}</li>
            </ul>
          </div>

          <div className="cta-section">
            <p className="cta-text">
              {t("aboutUs.ctaText")}
            </p>
            <Link href="/become-seller" className="cta-button">
              {t("aboutUs.ctaButton")}
            </Link>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-subtitle">{t("aboutUs.missionTitle")}</h2>
          <p className="section-text">
            {t("aboutUs.missionText")}
          </p>
        </div>

        <div className="about-section">
          <h2 className="section-subtitle">{t("aboutUs.contactTitle")}</h2>
          <p className="section-text">
            {t("aboutUs.contactText")}
          </p>
          <div className="contact-info">
            <p>{t("aboutUs.email")}</p>
            <p>{t("aboutUs.phone")}</p>
            <p>{t("aboutUs.address")}</p>
          </div>
        </div>

        <div className="about-section social-media-section">
          <h2 className="section-subtitle">{t("aboutUs.socialMediaTitle")}</h2>
          <p className="section-text">
            {t("aboutUs.socialMediaText")}
          </p>
          <div className="social-media-links">
            <a 
              href="https://www.facebook.com/profile.php?id=100064347472899" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link facebook"
            >
              <FaFacebook className="social-icon" />
              <span>{t("aboutUs.facebook")}</span>
            </a>
            <a 
              href="https://www.instagram.com/fishhunt.ge?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
            >
              <FaInstagram className="social-icon" />
              <span>{t("aboutUs.instagram")}</span>
            </a>
            <a 
              href="https://www.youtube.com/@FishHuntge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link youtube"
            >
              <FaYoutube className="social-icon" />
              <span>{t("aboutUs.youtube")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
