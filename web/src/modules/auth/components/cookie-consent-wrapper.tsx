"use client";

import { useCookieConsent } from "../hooks/use-cookie-consent";

export function CookieConsentWrapper({ children }: { children: React.ReactNode }) {
  const { isConsentGiven, giveConsent } = useCookieConsent();

  return (
    <>
      {!isConsentGiven && (
        <div className="cookie-banner">
          <p>We use cookies to improve your experience. By using our site, you agree to our cookie policy.</p>
          <button onClick={giveConsent}>Accept Cookies</button>
        </div>
      )}
      {children}
    </>
  );
}
