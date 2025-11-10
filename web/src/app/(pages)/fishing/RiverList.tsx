"use client";

import './RiverList.css';
import { GEORGIAN_RIVERS } from './rivers';
import { GEORGIAN_LAKES } from './lakes';
import { FaRuler, FaWater, FaChevronDown, FaExpand } from 'react-icons/fa';
import { useState } from 'react';
import { useLanguage } from '@/hooks/LanguageContext';

const RiverList = () => {
  const { t } = useLanguage();
  const [openFishSections, setOpenFishSections] = useState<{ [key: string]: boolean }>({});
  const [showRivers, setShowRivers] = useState(false);
  const [showLakes, setShowLakes] = useState(false);

  // Helper function to get translated river name
  const getRiverName = (riverId: string, georgianName: string) => {
    const riverKey = `fishing.river${riverId.charAt(0).toUpperCase() + riverId.slice(1)}`;
    const translated = t(riverKey);
    return translated === riverKey ? georgianName : translated;
  };

  // Helper function to get translated lake name
  const getLakeName = (lakeId: string, georgianName: string) => {
    const lakeKey = `fishing.lake${lakeId.charAt(0).toUpperCase() + lakeId.slice(1)}`;
    const translated = t(lakeKey);
    return translated === lakeKey ? georgianName : translated;
  };

  // Helper function to get translated basin/sea name
  const getBasinName = (georgianBasin: string) => {
    if (georgianBasin === 'კასპიის ზღვა') return t('fishing.seaCaspian');
    if (georgianBasin === 'შავი ზღვა') return t('fishing.seaBlack');
    return georgianBasin; // Return river names as is (like მტკვარი, რიონი)
  };

  // Helper function to get translated location
  const getLocation = (georgianLocation: string) => {
    if (georgianLocation.includes('ჯავახეთი, სამცხე-ჯავახეთი (საქართველო-თურქეთის საზღვარი)')) {
      return t('fishing.locationGeorgiaTurkeyBorder');
    }
    if (georgianLocation === 'ჯავახეთი, სამცხე-ჯავახეთი') return t('fishing.locationJavakheti');
    if (georgianLocation === 'სამცხე-ჯავახეთი (ბორჯომი/ახალქალაქი)') return t('fishing.locationSamtskheJavakheti');
    if (georgianLocation === 'ჯავახეთი (ნინოწმინდა)') return t('fishing.locationNinotsminda');
    if (georgianLocation === 'აფხაზეთი') return t('fishing.locationAbkhazia');
    if (georgianLocation === 'რაჭა, რაჭა-ლეჩხუმი და ქვემო სვანეთი') return t('fishing.locationRacha');
    if (georgianLocation === 'თბილისი') return t('fishing.locationTbilisi');
    if (georgianLocation.includes('კოლხეთი')) return t('fishing.locationKolkheti');
    if (georgianLocation === 'გარდაბანი, ქვემო ქართლი') return t('fishing.locationGardabani');
    if (georgianLocation.includes('ყაზბეგი')) return t('fishing.locationKazbegi');
    if (georgianLocation.includes('თუშეთი') || georgianLocation.includes('ომალო')) return t('fishing.locationTushetiOmalo');
    return georgianLocation; // Return as is if not in translation list
  };

  const toggleFishSection = (id: string) => {
    setOpenFishSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getUserLocation = (searchQuery: string) => {
    // Simply open Google Maps search for the river/lake
    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <article itemScope itemType="https://schema.org/Article">
      <meta itemProp="name" content="თევზაობა საქართველოში - მდინარეები და ტბები" />
      <meta itemProp="description" content="საქართველოს მდინარეების და ტბების სრული სია თევზაობისთვის" />
      
        {/* Rivers Section */}
        <section 
          className="section-container" 
          aria-labelledby="rivers-heading"
          itemScope 
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="name" content="საქართველოს მდინარეები" />
          <div 
            className="section-header"
            onClick={() => setShowRivers(!showRivers)}
            role="button"
            aria-expanded={showRivers}
            tabIndex={0}
          >
            <h1 id="rivers-heading" className="page-title" itemProp="headline">
              {t("fishing.riversTitle")}
            </h1>
            <FaChevronDown className={`section-arrow ${showRivers ? 'open' : ''}`} aria-hidden="true" />
          </div>

          <div className={`section-content ${showRivers ? 'open' : ''}`}>
            <div className="river-list">
                {GEORGIAN_RIVERS.map((river, index) => (
                    <article 
                      key={river.id} 
                      className="river-card"
                      itemScope 
                      itemType="https://schema.org/Place"
                      itemProp="itemListElement"
                    >
                      <meta itemProp="position" content={String(index + 1)} />
                      <div className="river-info">
                        <h3 className="river-name" itemProp="name">
                          {getRiverName(river.id, river.name)}
                        </h3>
                        <div className="river-details" itemProp="description">
                          <div className="river-stat">
                            <FaRuler aria-hidden="true" />
                            <span>
                              {t("fishing.totalLength")} 
                              <span itemProp="size">{river.totalLength}</span> {t("fishing.km")}
                            </span>
                          </div>
                          <div className="river-stat">
                            <FaRuler aria-hidden="true" />
                            <span>{t("fishing.lengthInGeorgia")} {river.lengthInGeorgia} {t("fishing.km")}</span>
                          </div>
                          <div className="river-stat">
                            <FaWater aria-hidden="true" />
                            <span>{t("fishing.basin")} {getBasinName(river.basin)}</span>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="fish-section-header"
                        onClick={() => toggleFishSection(river.id)}
                      >
                        <div className="fish-header-content">
                          <h4 className="fish-title">{t("fishing.residentFish")}</h4>
                          <span className="species-count">({river.fish.reduce((total, family) => total + family.species.length, 0)}+ {t("fishing.species")})</span>
                        </div>
                        <FaChevronDown 
                          className={`arrow-icon ${openFishSections[river.id] ? 'open' : ''}`}
                        />
                      </div>

                      <div className={`fish-content ${openFishSections[river.id] ? 'open' : ''}`}>
                        <div className="fish-families">
                          {river.fish.map((fishFamily, index) => (
                            <div key={index} className="fish-family">
                              <h5 className="fish-family-name">
                                🐠 {fishFamily.family}
                              </h5>
                              <ul className="fish-list">
                                {fishFamily.species.map((species, idx) => (
                                  <li key={idx}>{species}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => getUserLocation(river.searchQuery)}
                        className="river-nav-button"
                        aria-label={`${getRiverName(river.id, river.name)} - ${t("fishing.viewOnMap")}`}
                      >
                        {t("fishing.viewOnMap")}
                      </button>
                    </article>
                ))}
            </div>
          </div>
        </section>

        {/* Lakes Section */}
        <section 
          className="section-container"
          aria-labelledby="lakes-heading"
          itemScope 
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="name" content="საქართველოს ტბები" />
          <div 
            className="section-header"
            onClick={() => setShowLakes(!showLakes)}
            role="button"
            aria-expanded={showLakes}
            tabIndex={0}
          >
            <h1 id="lakes-heading" className="page-title" itemProp="headline">
              {t("fishing.lakesTitle")}
            </h1>
            <FaChevronDown className={`section-arrow ${showLakes ? 'open' : ''}`} aria-hidden="true" />
          </div>

          <div className={`section-content ${showLakes ? 'open' : ''}`}>
            <div className="river-list">
                {GEORGIAN_LAKES.map((lake, index) => (
                    <article 
                      key={lake.id} 
                      className="river-card"
                      itemScope 
                      itemType="https://schema.org/Place"
                      itemProp="itemListElement"
                    >
                      <meta itemProp="position" content={String(index + 1)} />
                      <div className="river-info">
                        <h3 className="river-name" itemProp="name">
                          {getLakeName(lake.id, lake.name)}
                        </h3>
                        <div className="river-details" itemProp="description">
                          <div className="river-stat">
                            <FaExpand aria-hidden="true" />
                            <span>
                              {t("fishing.area")} 
                              <span itemProp="size">{lake.area}</span> {t("fishing.km2")}
                            </span>
                          </div>
                          <div className="river-stat">
                            <FaWater aria-hidden="true" />
                            <span>{t("fishing.maxDepth")} {lake.maxDepth} {t("fishing.m")}</span>
                          </div>
                          <div className="river-stat">
                            <FaWater aria-hidden="true" />
                            <span itemProp="address">{t("fishing.location")} {getLocation(lake.location)}</span>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="fish-section-header"
                        onClick={() => toggleFishSection(lake.id)}
                      >
                        <div className="fish-header-content">
                          <h4 className="fish-title">{t("fishing.residentFish")}</h4>
                          <span className="species-count">({lake.fish.reduce((total, family) => total + family.species.length, 0)}+ {t("fishing.species")})</span>
                        </div>
                        <FaChevronDown 
                          className={`arrow-icon ${openFishSections[lake.id] ? 'open' : ''}`}
                        />
                      </div>

                      <div className={`fish-content ${openFishSections[lake.id] ? 'open' : ''}`}>
                        <div className="fish-families">
                          {lake.fish.map((fishFamily, index) => (
                            <div key={index} className="fish-family">
                              <h5 className="fish-family-name">
                                🐠 {fishFamily.family}
                              </h5>
                              <ul className="fish-list">
                                {fishFamily.species.map((species, idx) => (
                                  <li key={idx}>{species}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => getUserLocation(lake.searchQuery)}
                        className="river-nav-button"
                        aria-label={`${getLakeName(lake.id, lake.name)} - ${t("fishing.viewOnMap")}`}
                      >
                        {t("fishing.viewOnMap")}
                      </button>
                    </article>
                ))}
            </div>
          </div>
        </section>
    </article>
  );
};

export default RiverList;
