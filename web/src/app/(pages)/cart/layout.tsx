import { Metadata } from "next";

export const metadata: Metadata = {
  title: "კალათა - FishHunt | Shopping Cart",
  description:
    "თქვენი საყიდლების კალათა Fishhunt-ში. დაათვალიერეთ შერჩეული პროდუქტები და განაგრძეთ შეძენა. Your shopping cart at FishHunt. Review selected products and proceed to checkout.",
  keywords: [
    "კალათა",
    "საყიდლები",
    "შეძენა",
    "შეკვეთა",
    "FishHunt",
    "მაიჰანტერი",
    "shopping cart",
    "cart",
    "purchase",
    "checkout",
    "order",
    "buy",
    "selected items",
  ],
  authors: [{ name: "FishHunt" }],
  creator: "FishHunt",
  publisher: "FishHunt",
  robots: {
    index: false, // კალათა private page-ია
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "კალათა - FishHunt | Shopping Cart",
    description:
      "თქვენი საყიდლების კალათა FishHunt-ში. დაათვალიერეთ შერჩეული პროდუქტები და განაგრძეთ შეძენა.",
    url: "https://FishHunt.ge/cart",
    siteName: "FishHunt",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "FishHunt კალათა",
      },
    ],
    locale: "ka_GE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "კალათა - FishHunt",
    description: "თქვენი საყიდლების კალათა FishHunt-ში.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://FishHunt.ge/cart",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
