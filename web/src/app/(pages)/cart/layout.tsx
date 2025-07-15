import { Metadata } from "next";

export const metadata: Metadata = {
  title: "კალათა - MyHunter | Shopping Cart",
  description:
    "თქვენი საყიდლების კალათა MyHunter-ში. დაათვალიერეთ შერჩეული პროდუქტები და განაგრძეთ შეძენა. Your shopping cart at MyHunter. Review selected products and proceed to checkout.",
  keywords: [
    "კალათა",
    "საყიდლები",
    "შეძენა",
    "შეკვეთა",
    "MyHunter",
    "მაიჰანტერი",
    "shopping cart",
    "cart",
    "purchase",
    "checkout",
    "order",
    "buy",
    "selected items",
  ],
  authors: [{ name: "MyHunter" }],
  creator: "MyHunter",
  publisher: "MyHunter",
  robots: {
    index: false, // კალათა private page-ია
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "კალათა - MyHunter | Shopping Cart",
    description:
      "თქვენი საყიდლების კალათა MyHunter-ში. დაათვალიერეთ შერჩეული პროდუქტები და განაგრძეთ შეძენა.",
    url: "https://myhunter.ge/cart",
    siteName: "MyHunter",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "MyHunter კალათა",
      },
    ],
    locale: "ka_GE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "კალათა - MyHunter",
    description: "თქვენი საყიდლების კალათა MyHunter-ში.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://myhunter.ge/cart",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
