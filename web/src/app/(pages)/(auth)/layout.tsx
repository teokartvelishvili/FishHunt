import { useCookieConsent } from "@/modules/auth/hooks/use-cookie-consent";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isConsentGiven, giveConsent } = useCookieConsent();

  const handleConsent = () => {
    giveConsent();
    localStorage.setItem("cookieConsent", "true");
  };

  return (
    <div>
      {!isConsentGiven && (
        <div className="cookie-banner">
          <p>We use cookies to improve your experience. By using our site, you agree to our cookie policy.</p>
          <button onClick={handleConsent}>Accept Cookies</button>
        </div>
      )}
      {children}
    </div>
  );
}
