import { useState, useEffect } from "react";

export function useCookieConsent() {
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    setIsConsentGiven(consent === "true");
  }, []);

  const giveConsent = () => {
    localStorage.setItem("cookieConsent", "true");
    document.cookie = "cookieConsent=true; path=/; SameSite=None; Secure"; // ქუქის დამატება
    setIsConsentGiven(true);
  };

  return { isConsentGiven, giveConsent };
}
