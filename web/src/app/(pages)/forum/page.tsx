import ForumPage from "./ForumPage";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { postId?: string };
}): Promise<Metadata> {
  const postId = searchParams.postId;

  if (postId) {
    try {
      // Fetch post data for Open Graph meta tags
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/forums/${postId}`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const post = await response.json();
        
        const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
        const postUrl = `${siteUrl}/forum?postId=${postId}`;
        
        // Extract meaningful title from content
        const title = post.content?.substring(0, 60).trim() || 'ფორუმის პოსტი';
        const description = post.content?.substring(0, 160).trim() || 'იხილეთ ეს პოსტი FishHunt ფორუმში';
        
        // Categories for keywords
        const categories = post.category?.join(', ') || '';
        const keywords = `${categories}, თევზაობა, მონადირება, კემპინგი, ფორუმი, საქართველო, fishhunt`.split(', ');
        
        return {
          title: `${title} - FishHunt ფორუმი`,
          description: description,
          keywords: keywords,
          authors: [{ name: post.user?.name || 'FishHunt User' }],
          openGraph: {
            title: title,
            description: description,
            url: postUrl,
            siteName: 'FishHunt - თევზაობა, მონადირება, კემპინგი',
            images: post.image ? [
              {
                url: post.image,
                width: 1200,
                height: 630,
                alt: title,
              }
            ] : [],
            type: 'article',
            publishedTime: post.createdAt,
            authors: [post.user?.name || 'FishHunt User'],
          },
          twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: post.image ? [post.image] : [],
            creator: '@fishhunt',
          },
          alternates: {
            canonical: postUrl,
          },
          robots: {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
        };
      }
    } catch (error) {
      console.error('Error fetching post metadata:', error);
    }
  }

  // Default metadata for forum page
  return {
    title: 'ფორუმი - FishHunt | თევზაობა, მონადირება, კემპინგი',
    description: 'შემოუერთდით ჩვენს საზოგადოებას - განიხილეთ თევზაობა, მონადირება და კემპინგი. გაიზიარეთ გამოცდილება, მიიღეთ რჩევები და იპოვეთ მეგობრები.',
    keywords: ['ფორუმი', 'თევზაობა', 'მონადირება', 'კემპინგი', 'საქართველო', 'fishhunt', 'fishing', 'hunting', 'camping'],
    openGraph: {
      title: 'ფორუმი - FishHunt',
      description: 'შემოუერთდით ჩვენს საზოგადოებას - განიხილეთ თევზაობა, მონადირება და კემპინგი',
      siteName: 'FishHunt - თევზაობა, მონადირება, კემპინგი',
      type: 'website',
      locale: 'ka_GE',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ფორუმი - FishHunt',
      description: 'შემოუერთდით ჩვენს საზოგადოებას - განიხილეთ თევზაობა, მონადირება და კემპინგი',
      creator: '@fishhunt',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

const Forum = () => {

  return (
    <div>
    <ForumPage/>
    </div>
  );
};

export default Forum;
