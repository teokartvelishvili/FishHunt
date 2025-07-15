import { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ keyword: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ keyword: string }>;
}): Promise<Metadata> {
  const { keyword } = await params;

  const decodedKeyword = decodeURIComponent(keyword || "");

  return {
    title: `ძიება: ${decodedKeyword} - FishHunt | Search: ${decodedKeyword}`,
    description: `ძიების შედეგები "${decodedKeyword}" - სანადირო და სათევზაო აღჭურვილობა FishHunt-ში. Search results for "${decodedKeyword}" - hunting and fishing equipment at FishHunt.`,
    keywords: [
      decodedKeyword,
      "ძიება",
      "სანადირო",
      "სათევზაო",
      "აღჭურვილობა",
      "პროდუქტები",
      "FishHunt",
      "მაიჰანტერი",
      "search",
      "hunting",
      "fishing",
      "equipment",
      "products",
      "find",
      "results",
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
      title: `ძიება: ${decodedKeyword} - FishHunt`,
      description: `ძიების შედეგები "${decodedKeyword}" - სანადირო და სათევზაო აღჭურვილობა FishHunt-ში.`,
      url: `https://FishHunt.ge/search/${encodeURIComponent(decodedKeyword)}`,
      siteName: "FishHunt",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: `FishHunt ძიება - ${decodedKeyword}`,
        },
      ],
      locale: "ka_GE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `ძიება: ${decodedKeyword} - FishHunt`,
      description: `ძიების შედეგები "${decodedKeyword}" - სანადირო და სათევზაო აღჭურვილობა FishHunt-ში.`,
      images: ["/logo.png"],
    },
    alternates: {
      canonical: `https://FishHunt.ge/search/${encodeURIComponent(
        decodedKeyword
      )}`,
    },
  };
}

export default function SearchLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
