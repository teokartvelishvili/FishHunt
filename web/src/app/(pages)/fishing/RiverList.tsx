"use client";

import './RiverList.css';
import { GEORGIAN_RIVERS } from './rivers';
import { FaRuler, FaWater, FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

const RiverList = () => {
  const [openFishSections, setOpenFishSections] = useState<{ [key: string]: boolean }>({});

  const toggleFishSection = (riverId: string) => {
    setOpenFishSections(prev => ({
      ...prev,
      [riverId]: !prev[riverId]
    }));
  };

  const getUserLocation = (searchQuery: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const destination = encodeURIComponent(searchQuery);
        
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destination}&travelmode=walking`;
        
        window.open(googleMapsUrl, "_blank");
      });
    } else {
      alert("გეოლოკაცია არ არის მხარდაჭერილი ამ ბრაუზერში");
    }
  };

  return (
    <>
        <h1 className="page-title">უდიდესი მდინარეები საქართველოში</h1>
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
                      <span className="species-count">({river.speciesCount}+ სახეობა)</span>
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
                    🚶 წასვლა უახლოეს სანაპიროზე
                  </button>
                </div>
            ))}
        </div>
    </>
  );
};

export default RiverList;
