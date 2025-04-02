"use client";

import { useCookieConsent } from "@/modules/auth/hooks/use-cookie-consent";
import Link from "next/link";

interface ClientAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function ClientAuthLayout({ children, title, subtitle }: ClientAuthLayoutProps) {
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
      <div className="auth-layout">
        <div className="auth-bg"></div>
        <Link href="/" className="logo">
          FishHunt
        </Link>
        <div className="auth-layout-inner">
          <div className="auth-layout-header">
            <h1 className="auth-layout-title">{title}</h1>
            <p className="auth-layout-subtitle">{subtitle}</p>
          </div>
          <div className="auth-layout-children">{children}</div>
        </div>
      </div>
    </div>
  );
}
