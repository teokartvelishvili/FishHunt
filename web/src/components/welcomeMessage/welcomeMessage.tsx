"use client";

import { useState } from 'react';
import Typewriter from "../typewriter/typewriter";
import './welcomeMessage.css';

type AdventureType = 'fishing' | 'hunting' | 'camping' | null;
type LocationType = 'country-city' | 'share-location' | 'skip' | null;
type TimeFrame = 'today' | 'soon' | 'specific' | null;
type Step = 'welcome' | 'adventure-type' | 'location' | 'timeframe' | 'date-selection' | 'planning' | 'ai-result';

const WelcomeMessage = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [selectedAdventure, setSelectedAdventure] = useState<AdventureType>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType>(null);
  const [locationDetails, setLocationDetails] = useState<string>('');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // AI-თან დაკავშირებული state-ები
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiPlan, setAiPlan] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  
  // Follow-up კითხვებისთვის
  const [followUpQuestion, setFollowUpQuestion] = useState<string>('');
  const [isFollowUpLoading, setIsFollowUpLoading] = useState<boolean>(false);
  const [followUpSuccess, setFollowUpSuccess] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string}>>([]);

  // AI-სგან თავგადასავლის გეგმის მოთხოვნის ფუნქცია
  const generateAdventurePlan = async () => {
    setIsAiLoading(true);
    setAiError('');
    
    try {
      const response = await fetch('/api/adventure-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adventureType: getAdventureName(selectedAdventure),
          location: locationDetails || 'საქართველო',
          timeFrame: getTimeFrameText(selectedTimeFrame, selectedDate),
          userPreferences: 'FishHunt ვებსაიტის მომხმარებელი'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAiPlan(data.plan);
        setCurrentStep('ai-result');
      } else {
        setAiError(data.error || 'შეცდომა მოხდა AI-ს მხრიდან');
      }
    } catch (error) {
      console.error('AI API Error:', error);
      setAiError('ინტერნეტ კავშირის პრობლემა ან სერვერის შეცდომა');
    } finally {
      setIsAiLoading(false);
    }
  };

  // დამხმარე ფუნქცია დროის ფრეიმის ტექსტისთვის
  const getTimeFrameText = (timeFrame: TimeFrame, date?: string): string => {
    switch (timeFrame) {
      case 'today': return 'დღეს';
      case 'soon': return 'უახლოეს მომავალში';
      case 'specific': return date || 'კონკრეტული დღე';
      default: return 'უახლოეს მომავალში';
    }
  };

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
    setSelectedTimeFrame(timeframe);
    if (timeframe === 'specific') {
      setCurrentStep('date-selection');
    } else {
      setCurrentStep('planning');
      // AI-ს გამოძახება
      setTimeout(() => generateAdventurePlan(), 1000);
    }
  };

  const handleDateSelect = () => {
    if (selectedDate) {
      setSelectedTimeFrame('specific');
      setCurrentStep('planning');
      // AI-ს გამოძახება
      setTimeout(() => generateAdventurePlan(), 1000);
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

  // Follow-up კითხვის ფუნქცია
  const handleFollowUpQuestion = async () => {
    if (!followUpQuestion.trim()) return;
    
    setIsFollowUpLoading(true);
    
    try {
      const response = await fetch('/api/adventure-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adventureType: getAdventureName(selectedAdventure),
          location: locationDetails || 'საქართველო',
          timeFrame: getTimeFrameText(selectedTimeFrame, selectedDate),
          userPreferences: `დამატებითი კითხვა: ${followUpQuestion}. გთხოვთ FishHunt-ის პროდუქტებისა და სერვისების ხელშეწყობით უპასუხოთ.`,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // კონვერსაციის ისტორიაში დამატება
        setConversationHistory(prev => [...prev, {
          question: followUpQuestion,
          answer: data.plan
        }]);
        setFollowUpQuestion(''); // input-ის გასუფთავება
        setFollowUpSuccess(true); // success animation
        setTimeout(() => setFollowUpSuccess(false), 1000); // animation-ის გაუქმება 1 წამის შემდეგ
      } else {
        setAiError(data.error || 'შეცდომა მოხდა AI-ს მხრიდან');
      }
    } catch (error) {
      console.error('Follow-up API Error:', error);
      setAiError('ინტერნეტ კავშირის პრობლემა ან სერვერის შეცდომა');
    } finally {
      setIsFollowUpLoading(false);
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
            <p className="planning-details">
              {getAdventureEmoji(selectedAdventure)} {getAdventureName(selectedAdventure)} • 
              {getTimeFrameText(selectedTimeFrame, selectedDate)}
              {selectedLocation === 'country-city' && locationDetails ? ` • ${locationDetails}` : ''}
            </p>
            
            {isAiLoading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>🎣 FishHunt ამზადებს შენს პასუხს...</p>
              </div>
            )}
            
            {aiError && (
              <div className="error-message">
                <p>❌ {aiError}</p>
                <button 
                  className="retry-btn"
                  onClick={generateAdventurePlan}
                >
                  🔄 ხელახალი ცდა
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {currentStep === 'ai-result' && (
        <div className="question-container">
          <div className="ai-result-container">
            <h3 className="result-title">
              🌟 შენი პერსონალიზირებული თავგადასავლის გეგმა
            </h3>
            <div className="adventure-summary">
              {getAdventureEmoji(selectedAdventure)} {getAdventureName(selectedAdventure)} • 
              {getTimeFrameText(selectedTimeFrame, selectedDate)}
              {selectedLocation === 'country-city' && locationDetails ? ` • ${locationDetails}` : ''}
            </div>
            
            <div className="ai-plan-content">
              {aiPlan.split('\n').map((line, index) => (
                <p key={index} className="plan-line">
                  {line}
                </p>
              ))}
            </div>
            
            <div className="action-buttons">
              <button 
                className="new-plan-btn"
                onClick={() => {
                  setCurrentStep('welcome');
                  setSelectedAdventure(null);
                  setSelectedLocation(null);
                  setLocationDetails('');
                  setSelectedTimeFrame(null);
                  setSelectedDate('');
                  setAiPlan('');
                  setAiError('');
                  setFollowUpQuestion('');
                  setFollowUpSuccess(false);
                  setConversationHistory([]);
                }}
              >
                🎯 ახალი თავგადასავალი
              </button>
              <button 
                className="regenerate-btn"
                onClick={generateAdventurePlan}
              >
                🔄 ახალი გეგმა
              </button>
            </div>
            
            {/* კონვერსაციის ისტორია */}
            {conversationHistory.length > 0 && (
              <div className="conversation-history">
                <h4 className="history-title">🗨️ კითხვა-პასუხები:</h4>
                {conversationHistory.map((item, index) => (
                  <div key={index} className="conversation-item">
                    <div className="user-question">
                      <strong>❓ თქვენი კითხვა:</strong> {item.question}
                    </div>
                    <div className="ai-answer">
                      <strong>🤖 FishHunt AI:</strong> {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Follow-up კითხვების სექცია - ჩანს მხოლოდ AI-ის პირველი პასუხის შემდეგ */}
            {aiPlan && (
              <div className="follow-up-section">
                <h4 className="follow-up-title">
                  💬 გაქვთ დამატებითი კითხვები?
                </h4>
              <div className="follow-up-input-container">
                <input 
                  type="text"
                  className="follow-up-input"
                  placeholder="მაგ: რა ღირს თევზაობა? სად შევიძინო ინვენტარი?"
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleFollowUpQuestion()}
                  disabled={isFollowUpLoading}
                />
                <button 
                  className={`follow-up-btn ${isFollowUpLoading ? 'loading' : ''} ${followUpSuccess ? 'follow-up-success' : ''}`}
                  onClick={handleFollowUpQuestion}
                  disabled={!followUpQuestion.trim() || isFollowUpLoading}
                >
                  {isFollowUpLoading ? '' : followUpSuccess ? '✅ გაგზავნილია' : '📤 გაგზავნა'}
                </button>
              </div>
              <p className="follow-up-hint">
                💡 დამისვით რაც გნებავთ - ყველაფერი FishHunt-ის პროდუქტებისა და სერვისების შესახებ!
              </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeMessage;
