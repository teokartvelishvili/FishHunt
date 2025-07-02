"use client";

import { useState } from 'react';
import Typewriter from "../typewriter/typewriter";
import './welcomeMessage.css';

type AdventureType = 'fishing' | 'hunting' | 'camping' | null;
type LocationType = 'country-city' | 'share-location' | 'skip' | null;
type TimeFrame = 'today' | 'soon' | 'specific' | null;
type Step = 'welcome' | 'adventure-type' | 'location' | 'timeframe' | 'date-selection' | 'planning';

const WelcomeMessage = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [selectedAdventure, setSelectedAdventure] = useState<AdventureType>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType>(null);
  const [locationDetails, setLocationDetails] = useState<string>('');
//   const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handlePlanAdventure = () => {
    setCurrentStep('adventure-type');
  };

  const handleAdventureSelect = (adventure: AdventureType) => {
    setSelectedAdventure(adventure);
    setCurrentStep('location');
  };

  const handleLocationSelect = (location: LocationType) => {
    setSelectedLocation(location);
    if (location === 'country-city') {
      // დარჩება location step-ზე input field-ისთვის
    } else {
      setCurrentStep('timeframe');
    }
  };

  const handleLocationConfirm = () => {
    if (locationDetails.trim()) {
      setCurrentStep('timeframe');
    }
  };

  const handleLocationSkip = () => {
    setSelectedLocation('skip');
    setCurrentStep('timeframe');
  };

  const handleTimeFrameSelect = (timeframe: TimeFrame) => {
    // setSelectedTimeFrame(timeframe);
    if (timeframe === 'specific') {
      setCurrentStep('date-selection');
    } else {
      setCurrentStep('planning');
    }
  };

  const handleDateSelect = () => {
    if (selectedDate) {
      setCurrentStep('planning');
    }
  };

  const getAdventureEmoji = (adventure: AdventureType) => {
    switch (adventure) {
      case 'fishing': return '🎣';
      case 'hunting': return '🦌';
      case 'camping': return '🏕️';
      default: return '';
    }
  };

  const getAdventureName = (adventure: AdventureType) => {
    switch (adventure) {
      case 'fishing': return 'თევზაობა';
      case 'hunting': return 'ნადირობა';
      case 'camping': return 'ლაშქრობა';
      default: return '';
    }
  };

  return (
    <div className="welcome-message">
      {currentStep === 'welcome' && (
        <>
          <Typewriter 
            text="მოგესალმები თავგადასავლების სამყაროში! გინდა ერთად დავგეგმოთ შენი თავგადასავალი?"
            speed={80}
            className="main-welcome-text"
          />
          <div className="welcome-button">
            <button 
              className="plan-adventure-btn"
              onClick={handlePlanAdventure}
            >
              🌟 მოდი დავგეგმოთ 🗺️
            </button>
          </div>
        </>
      )}

      {currentStep === 'adventure-type' && (
        <div className="question-container">
          <h3 className="question-text">რა გირჩევნია?</h3>
          <div className="options-container">
            <button 
              className="option-btn"
              onClick={() => handleAdventureSelect('fishing')}
            >
              🎣 თევზაობა
            </button>
            <button 
              className="option-btn"
              onClick={() => handleAdventureSelect('hunting')}
            >
              🦌 ნადირობა
            </button>
            <button 
              className="option-btn"
              onClick={() => handleAdventureSelect('camping')}
            >
              🏕️ ლაშქრობა
            </button>
          </div>
        </div>
      )}

      {currentStep === 'location' && (
        <div className="question-container">
          <h3 className="question-text">სად იმყოფები ამჟამად?</h3>
          
          {!selectedLocation && (
            <div className="options-container">
              <button 
                className="option-btn"
                onClick={() => handleLocationSelect('country-city')}
              >
                🌍 ქვეყანა/ქალაქი
              </button>
              <button 
                className="option-btn"
                onClick={() => handleLocationSelect('share-location')}
              >
                📍 გამიზიარე ლოკაცია
              </button>
              <button 
                className="option-btn skip-btn"
                onClick={handleLocationSkip}
              >
                ⏭️ გამოტოვება
              </button>
            </div>
          )}

          {selectedLocation === 'country-city' && (
            <div className="location-input-container">
              <input 
                type="text"
                className="location-input"
                placeholder="მაგ: საქართველო, თბილისი"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
              />
              <button 
                className="confirm-btn"
                onClick={handleLocationConfirm}
                disabled={!locationDetails.trim()}
              >
                ✅ დადასტურება
              </button>
            </div>
          )}

          {selectedLocation === 'share-location' && (
            <div className="location-share-container">
              <p className="location-info">
                📱 ბრაუზერი მოგთხოვთ ლოკაციის გაზიარებას
              </p>
              <button 
                className="confirm-btn"
                onClick={() => {
                  navigator.geolocation?.getCurrentPosition(
                    () => setCurrentStep('timeframe'),
                    () => setCurrentStep('timeframe')
                  );
                }}
              >
                🎯 ლოკაციის გაზიარება
              </button>
            </div>
          )}
        </div>
      )}

      {currentStep === 'timeframe' && (
        <div className="question-container">
          <h3 className="question-text">
            {getAdventureEmoji(selectedAdventure)} {getAdventureName(selectedAdventure)} როდის?
          </h3>
          <div className="options-container">
            <button 
              className="option-btn"
              onClick={() => handleTimeFrameSelect('today')}
            >
              📅 დღეს
            </button>
            <button 
              className="option-btn"
              onClick={() => handleTimeFrameSelect('soon')}
            >
              ⏰ უახლოეს მომავალში
            </button>
            <button 
              className="option-btn"
              onClick={() => handleTimeFrameSelect('specific')}
            >
              🗓️ კონკრეტული დღე
            </button>
          </div>
        </div>
      )}

      {currentStep === 'date-selection' && (
        <div className="question-container">
          <h3 className="question-text">აირჩიეთ თარიღი:</h3>
          <div className="date-container">
            <input 
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <button 
              className="confirm-btn"
              onClick={handleDateSelect}
              disabled={!selectedDate}
            >
              ✅ დადასტურება
            </button>
          </div>
        </div>
      )}

      {currentStep === 'planning' && (
        <div className="question-container">
          <div className="planning-message">
            <h3 className="planning-text">
              🎯 დამელოდე, ახლა შეგიდგენ საუკეთესო გეგმას შენი დაუვიწყარი თავგადასავლებისთვის!
            </h3>
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeMessage;
