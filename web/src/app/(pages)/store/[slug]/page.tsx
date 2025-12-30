import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import StorePage from "./StorePage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stores/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        title: "Store Not Found | FishHunt",
        description: "The store you are looking for could not be found.",
      };
    }

    const data = await response.json();

    return {
      title: `${data.store.name} | FishHunt`,
      description: `Shop ${data.store.name} products on FishHunt. ${
        data.store.address || ""
      }`,
      openGraph: {
        title: `${data.store.name} | FishHunt`,
        description: `Shop ${data.store.name} products on FishHunt.`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/store/${slug}`,
        siteName: "FishHunt",
        images: data.store.logo ? [data.store.logo] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.store.name} | FishHunt`,
        description: `Shop ${data.store.name} products on FishHunt.`,
        images: data.store.logo ? [data.store.logo] : [],
      },
    };
  } catch (error) {
    return {
      title: "Store | FishHunt",
      description: "Shop unique products on FishHunt.",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StorePage slug={slug} />
    </Suspense>
  );
}
