"use client";

import "./FishingRules.css";
import { useLanguage } from "@/hooks/LanguageContext";

const FishingRules = () => {
  const { t } = useLanguage();
  
  return (
    <section 
      className="fishing-rules-container"
      aria-labelledby="fishing-rules-heading"
      itemScope 
      itemType="https://schema.org/Article"
    >
      <meta itemProp="author" content="FishHunt Georgia" />
      <meta itemProp="publisher" content="FishHunt" />
      
      <h2 id="fishing-rules-heading" className="fishing-rules-title" itemProp="headline">
        {t("fishing.rulesTitle")}
      </h2>
      <p className="fishing-rules-subtitle" itemProp="description">
        {t("fishing.rulesSubtitle")}
      </p>

      <article className="fishing-rules-section" itemProp="articleBody">
        <h3 className="section-title allowed">{t("fishing.allowedTitle")}</h3>
        <p className="section-intro">{t("fishing.allowedIntro")}</p>
        <ul className="rules-list" role="list">
          <li role="listitem">{t("fishing.allowed1")}</li>
          <li role="listitem">{t("fishing.allowed2")}</li>
          <li role="listitem">{t("fishing.allowed3")}</li>
          <li role="listitem">{t("fishing.allowed4")}</li>
          <li role="listitem">{t("fishing.allowed5")}</li>
        </ul>
      </article>

      <article className="fishing-rules-section" itemProp="articleBody">
        <h3 className="section-title nets">{t("fishing.netsTitle")}</h3>
        <p className="section-intro">{t("fishing.netsIntro")}</p>
        <ul className="rules-list" role="list">
          <li role="listitem">{t("fishing.nets1")}</li>
          <li role="listitem">{t("fishing.nets2")}</li>
          <li role="listitem">{t("fishing.nets3")}</li>
          <li role="listitem">{t("fishing.nets4")}</li>
          <li role="listitem">{t("fishing.nets5")}</li>
        </ul>
        <p className="section-note">
          {t("fishing.netsNote")}
        </p>
      </article>

      <article className="fishing-rules-section" itemProp="articleBody">
        <h3 className="section-title forbidden">{t("fishing.forbiddenTitle")}</h3>
        <p className="section-intro">{t("fishing.forbiddenIntro")}</p>
        <ul className="rules-list" role="list">
          <li role="listitem">{t("fishing.forbidden1")}</li>
          <li role="listitem">{t("fishing.forbidden2")}</li>
          <li role="listitem">{t("fishing.forbidden3")}</li>
          <li role="listitem">{t("fishing.forbidden4")}</li>
          <li role="listitem">{t("fishing.forbidden5")}</li>
          <li role="listitem">{t("fishing.forbidden6")}</li>
          <li role="listitem">{t("fishing.forbidden7")}</li>
        </ul>
      </article>

      <article className="fishing-rules-section" itemProp="articleBody">
        <h3 className="section-title info">{t("fishing.infoTitle")}</h3>
        <p className="section-intro">{t("fishing.infoIntro")}</p>
        <ul className="rules-list" role="list">
          <li role="listitem">{t("fishing.info1")}</li>
          <li role="listitem">{t("fishing.info2")}</li>
          <li role="listitem">{t("fishing.info3")}</li>
        </ul>
      </article>

      <aside className="fishing-rules-sources">
        <h3 className="section-title sources">{t("fishing.sourcesTitle")}</h3>
        <ul className="sources-list" role="list">
          <li role="listitem">
            <a 
              href="https://matsne.gov.ge" 
              target="_blank" 
              rel="noopener noreferrer"
              itemProp="citation"
            >
              {t("fishing.source1")}
            </a>
          </li>
          <li role="listitem">
            <a 
              href="https://mepa.gov.ge" 
              target="_blank" 
              rel="noopener noreferrer"
              itemProp="citation"
            >
              {t("fishing.source2")}
            </a>
          </li>
        </ul>
      </aside>
    </section>
  );
};

export default FishingRules;
