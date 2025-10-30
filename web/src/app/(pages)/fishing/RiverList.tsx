"use client";

import './RiverList.css';
import { GEORGIAN_RIVERS } from './rivers';
import { GEORGIAN_LAKES } from './lakes';
import { FaRuler, FaWater, FaChevronDown, FaExpand } from 'react-icons/fa';
import { useState } from 'react';

const RiverList = () => {
  const [openFishSections, setOpenFishSections] = useState<{ [key: string]: boolean }>({});
  const [showRivers, setShowRivers] = useState(false);
  const [showLakes, setShowLakes] = useState(false);

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
    <>
        {/* Rivers Section */}
        <div className="section-container">
          <div 
            className="section-header"
            onClick={() => setShowRivers(!showRivers)}
          >
            <h1 className="page-title">🏞️ უდიდესი მდინარეები საქართველოში</h1>
            <FaChevronDown className={`section-arrow ${showRivers ? 'open' : ''}`} />
          </div>

          <div className={`section-content ${showRivers ? 'open' : ''}`}>
            <div className="river-list">
                {GEORGIAN_RIVERS.map((river) => (
                    <div key={river.id} className="river-card">
                      <div className="river-info">
                        <h3 className="river-name">{river.name}</h3>
                        <div className="river-details">
                          <div className="river-stat">
                            <FaRuler />
                            <span>სრული სიგრძე: {river.totalLength} კმ</span>
                          </div>
                          <div className="river-stat">
                            <FaRuler />
                            <span>საქართველოში: {river.lengthInGeorgia} კმ</span>
                          </div>
                          <div className="river-stat">
                            <FaWater />
                            <span>აუზი: {river.basin}</span>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="fish-section-header"
                        onClick={() => toggleFishSection(river.id)}
                      >
                        <div className="fish-header-content">
                          <h4 className="fish-title">🐟 მობინადრე თევზები</h4>
                          <span className="species-count">({river.fish.reduce((total, family) => total + family.species.length, 0)}+ სახეობა)</span>
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
                      >
                        �️ ნახე რუკაზე
                      </button>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Lakes Section */}
        <div className="section-container">
          <div 
            className="section-header"
            onClick={() => setShowLakes(!showLakes)}
          >
            <h1 className="page-title">🏔️ უდიდესი ტბები საქართველოში</h1>
            <FaChevronDown className={`section-arrow ${showLakes ? 'open' : ''}`} />
          </div>

          <div className={`section-content ${showLakes ? 'open' : ''}`}>
            <div className="river-list">
                {GEORGIAN_LAKES.map((lake) => (
                    <div key={lake.id} className="river-card">
                      <div className="river-info">
                        <h3 className="river-name">{lake.name}</h3>
                        <div className="river-details">
                          <div className="river-stat">
                            <FaExpand />
                            <span>ფართობი: {lake.area} კმ²</span>
                          </div>
                          <div className="river-stat">
                            <FaWater />
                            <span>მაქს. სიღრმე: {lake.maxDepth} მ</span>
                          </div>
                          <div className="river-stat">
                            <FaWater />
                            <span>მდებარეობა: {lake.location}</span>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="fish-section-header"
                        onClick={() => toggleFishSection(lake.id)}
                      >
                        <div className="fish-header-content">
                          <h4 className="fish-title">🐟 მობინადრე თევზები</h4>
                          <span className="species-count">({lake.fish.reduce((total, family) => total + family.species.length, 0)}+ სახეობა)</span>
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
                      >
                        �️ ნახე რუკაზე
                      </button>
                    </div>
                ))}
            </div>
          </div>
        </div>
    </>
  );
};

export default RiverList;
