"use client";
import Link from "next/link";
import Pattern from "../../../components/pattern/pattern";
import React from "react";
import "./become-seller.css";
import { useLanguage } from "../../../hooks/LanguageContext";

export default function BecomeSellerPage() {
  const { t } = useLanguage();

  return (
    <div className="become-seller-container">
      <Pattern imageSize={250}/>
      <div className="become-seller-content">
        <h1 className="seller-title">{t("becomeSeller.title")}</h1>
        
        <div className="hero-section">
          <p className="hero-text">
            {t("becomeSeller.heroText")}
          </p>
        </div>

        <div className="seller-section">
          <h2 className="section-title">{t("becomeSeller.whyFishHuntTitle")}</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <h3>{t("becomeSeller.specializedAudience")}</h3>
              <p>{t("becomeSeller.specializedAudienceDesc")}</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">💳</div>
              <h3>{t("becomeSeller.flexiblePricing")}</h3>
              <p>{t("becomeSeller.flexiblePricingDesc")}</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">📊</div>
              <h3>{t("becomeSeller.easyManagement")}</h3>
              <p>{t("becomeSeller.easyManagementDesc")}</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">🚚</div>
              <h3>{t("becomeSeller.deliveryService")}</h3>
              <p>{t("becomeSeller.deliveryServiceDesc")}</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">📈</div>
              <h3>{t("becomeSeller.discountSystem")}</h3>
              <p>{t("becomeSeller.discountSystemDesc")}</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <h3>{t("becomeSeller.freeAds")}</h3>
              <p>{t("becomeSeller.freeAdsDesc")}</p>
            </div>
          </div>
        </div>

        <div className="seller-section highlight-section">
          <h2 className="section-title">{t("becomeSeller.howItWorksTitle")}</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>{t("becomeSeller.step1Title")}</h3>
              <p>{t("becomeSeller.step1Desc")}</p>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>{t("becomeSeller.step2Title")}</h3>
              <p>{t("becomeSeller.step2Desc")}</p>
            </div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>{t("becomeSeller.step3Title")}</h3>
              <p>{t("becomeSeller.step3Desc")}</p>
            </div>
            
            <div className="step-item">
              <div className="step-number">4</div>
              <h3>{t("becomeSeller.step4Title")}</h3>
              <p>{t("becomeSeller.step4Desc")}</p>
            </div>
          </div>
        </div>

        <div className="seller-section">
          <h2 className="section-title">{t("becomeSeller.sellerPanelTitle")}</h2>
          <div className="features-list">
            <div className="feature-row">
              <span className="feature-check">✅</span>
              <div className="feature-content">
                <h4>{t("becomeSeller.productManagement")}</h4>
                <p>{t("becomeSeller.productManagementDesc")}</p>
              </div>
            </div>
            
            <div className="feature-row">
              <span className="feature-check">✅</span>
              <div className="feature-content">
                <h4>{t("becomeSeller.priceChange")}</h4>
                <p>{t("becomeSeller.priceChangeDesc")}</p>
              </div>
            </div>
            
            <div className="feature-row">
              <span className="feature-check">✅</span>
              <div className="feature-content">
                <h4>{t("becomeSeller.initialPriceDiscount")}</h4>
                <p>{t("becomeSeller.initialPriceDiscountDesc")}</p>
              </div>
            </div>
            
            <div className="feature-row">
              <span className="feature-check">✅</span>
              <div className="feature-content">
                <h4>{t("becomeSeller.temporaryDiscounts")}</h4>
                <p>{t("becomeSeller.temporaryDiscountsDesc")}</p>
              </div>
            </div>
            
            <div className="feature-row">
              <span className="feature-check">✅</span>
              <div className="feature-content">
                <h4>{t("becomeSeller.orderManagement")}</h4>
                <p>{t("becomeSeller.orderManagementDesc")}</p>
              </div>
            </div>
            
            <div className="feature-row">
              <span className="feature-check">✅</span>
              <div className="feature-content">
                <h4>{t("becomeSeller.salesAnalytics")}</h4>
                <p>{t("becomeSeller.salesAnalyticsDesc")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="seller-section pricing-section">
          <h2 className="section-title">{t("becomeSeller.pricingTitle")}</h2>
          <div className="pricing-info">
            <div className="pricing-card">
              <h3>{t("becomeSeller.standardPackage")}</h3>
              <div className="price">10%</div>
              <ul className="pricing-features">
                <li>{t("becomeSeller.commission10")}</li>
                <li>{t("becomeSeller.productPlacement")}</li>
                <li>{t("becomeSeller.priceChangeAbility")}</li>
                <li>{t("becomeSeller.discountPlanning")}</li>
                <li>{t("becomeSeller.initialPriceIndication")}</li>
                <li>{t("becomeSeller.salesAnalyticsIncluded")}</li>
                <li>{t("becomeSeller.noDelivery")}</li>
              </ul>
            </div>
            
            <div className="pricing-card premium">
              <div className="badge">{t("becomeSeller.recommended")}</div>
              <h3>{t("becomeSeller.premiumPackage")}</h3>
              <div className="price">20%</div>
              <ul className="pricing-features">
                <li>{t("becomeSeller.commission20")}</li>
                <li>{t("becomeSeller.allStandardFeatures")}</li>
                <li>{t("becomeSeller.fishHuntDelivery")}</li>
                <li>{t("becomeSeller.freeFacebookGroupAds")}</li>
                <li>{t("becomeSeller.freeFacebookPageAds")}</li>
                <li>{t("becomeSeller.priorityVisibility")}</li>
                <li>{t("becomeSeller.salesAnalyticsIncluded")}</li>
              </ul>
            </div>
          </div>
          
          <p className="pricing-note">
            {t("becomeSeller.pricingNote")}
          </p>
        </div>

        <div className="seller-section faq-section">
          <h2 className="section-title">{t("becomeSeller.faqTitle")}</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>{t("becomeSeller.faq1Question")}</summary>
              <p>{t("becomeSeller.faq1Answer")}</p>
            </details>
            
            <details className="faq-item">
              <summary>{t("becomeSeller.faq2Question")}</summary>
              <p>{t("becomeSeller.faq2Answer")}</p>
            </details>
            
            <details className="faq-item">
              <summary>{t("becomeSeller.faq3Question")}</summary>
              <p>{t("becomeSeller.faq3Answer")}</p>
            </details>
            
            <details className="faq-item">
              <summary>{t("becomeSeller.faq4Question")}</summary>
              <p>{t("becomeSeller.faq4Answer")}</p>
            </details>
            
            <details className="faq-item">
              <summary>{t("becomeSeller.faq5Question")}</summary>
              <p>{t("becomeSeller.faq5Answer")}</p>
            </details>
            
            <details className="faq-item">
              <summary>{t("becomeSeller.faq6Question")}</summary>
              <p>
                {t("becomeSeller.faq6Answer")}
              </p>
            </details>
          </div>
        </div>

        <div className="cta-final-section">
          <h2 className="cta-final-title">{t("becomeSeller.ctaFinalTitle")}</h2>
          <p className="cta-final-text">
            {t("becomeSeller.ctaFinalText")}
          </p>
          <div className="cta-buttons">
            <Link href="/sellers-register" className="btn-primary">
              {t("becomeSeller.registerNowButton")}
            </Link>
            <Link href="tel:551999055" className="btn-secondary">
              {t("becomeSeller.callButton")}
            </Link>
          </div>
          <p className="cta-note">
            {t("becomeSeller.ctaNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
