import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import { Providers } from "./providers";
// import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/modules/cart/context/cart-context";
import { CheckoutProvider } from "@/modules/checkout/context/checkout-context";
import { satoshi } from "./fonts";
import Footer from "@/components/footer/footer";
import { LanguageProvider } from "@/hooks/LanguageContext";
import Header from "@/components/Header/header";
import { VisitorTracker } from "@/components/visitor-tracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
// import SiteTimer from "@/components/SiteTimer/SiteTimer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_CLIENT_URL || "https://fishhunt.ge"
  ),
  title: {
    default: "FishHunt - თევზაობა, მონადირება, კემპინგი | ონლაინ მაღაზია",
    template: "%s | FishHunt",
  },
  description:
    "FishHunt - საქართველოს უმსხვილესი ონლაინ მაღაზია თევზაობის, მონადირების და კემპინგის ინვენტარისთვის. ფართო ასორტიმენტი, საუკეთესო ფასები, სწრაფი მიწოდება.",
  keywords: [
    "თევზაობა",
    "მონადირება",
    "კემპინგი",
    "თევზაობის აღჭურვილობა",
    "მონადირების ინვენტარი",
    "კემპინგის აქსესუარები",
    "ონლაინ მაღაზია",
    "საქართველო",
    "fishing",
    "hunting",
    "camping",
    "FishHunt",
  ],
  authors: [{ name: "FishHunt" }],
  creator: "FishHunt",
  publisher: "FishHunt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/android-chrome-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "ka_GE",
    url: "https://fishhunt.ge/",
    siteName: "FishHunt - თევზაობა, მონადირება, კემპინგი",
    title: "FishHunt - თევზაობა, მონადირება, კემპინგი",
    description:
      "საქართველოს უმსხვილესი ონლაინ მაღაზია თევზაობის, მონადირების და კემპინგის ინვენტარისთვის",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FishHunt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FishHunt - თევზაობა, მონადირება, კემპინგი",
    description: "საქართველოს უმსხვილესი ონლაინ მაღაზია",
    creator: "@fishhunt",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // შეცვალეთ Google Search Console-დან მიღებული კოდით
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Facebook SDK */}
        <script
          async
          defer
          crossOrigin="anonymous"
          src={`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v13.0&appid=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&autoLogAppEvents=1`}
        />
      </head>
      <body
        className={`${satoshi.variable} antialiased min-h-screen flex flex-col`}
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        <GoogleAnalytics />
        <Providers>
          <AuthProvider>
            <CartProvider>
              <CheckoutProvider>
                <LanguageProvider>
                  <VisitorTracker />
                  {/* <SiteTimer /> */}
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </LanguageProvider>
              </CheckoutProvider>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
