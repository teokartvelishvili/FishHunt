import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "კონფიდენციალურობის პოლიტიკა - FishHunt | Privacy Policy",
  description:
    "გაეცანით FishHunt-ის კონფიდენციალურობის პოლიტიკას. როგორ ვიყენებთ და ვიცავთ თქვენს პირად ინფორმაციას. GDPR შესაბამისი მონაცემთა დაცვის პოლიტიკა. Privacy Policy - FishHunt data protection.",
  keywords: [
    "კონფიდენციალურობის პოლიტიკა",
    "მონაცემთა დაცვა",
    "პირადი ინფორმაცია",
    "უსაფრთხოება",
    "GDPR",
    "FishHunt",
    "მაიჰანტერი",
    "privacy policy",
    "data protection",
    "personal information",
    "security",
    "privacy",
    "terms",
    "conditions",
  ],
  authors: [{ name: "FishHunt" }],
  creator: "FishHunt",
  publisher: "FishHunt",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "კონფიდენციალურობის პოლიტიკა - FishHunt | Privacy Policy",
    description:
      "გაეცანით FishHunt-ის კონფიდენციალურობის პოლიტიკას. როგორ ვიყენებთ და ვიცავთ თქვენს პირად ინფორმაციას.",
    url: "https://FishHunt.ge/privacy-policy",
    siteName: "FishHunt",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "FishHunt კონფიდენციალურობის პოლიტიკა",
      },
    ],
    locale: "ka_GE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "კონფიდენციალურობის პოლიტიკა - FishHunt",
    description:
      "გაეცანით FishHunt-ის კონფიდენციალურობის პოლიტიკას. როგორ ვიყენებთ და ვიცავთ თქვენს პირად ინფორმაციას.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://FishHunt.ge/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
