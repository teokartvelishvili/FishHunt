"use client";

import MainPhoto from "../mainPhoto/mainPhoto";
import "./homePagesHead.css";
import DiscountCard from "../discountCard/discountCard";
import { useQuery } from "@tanstack/react-query";
import { getActiveBanners } from "@/modules/admin/api/banner";
import { useLanguage } from "@/hooks/LanguageContext";
import HeartLoading from "../HeartLoading/HeartLoading";

const HomePagesHead = () => {
  const { language } = useLanguage();

  const { data: bannersResponse, isLoading } = useQuery({
    queryKey: ["activeBanners"],
    queryFn: getActiveBanners,
  });

  const banners = bannersResponse?.data || [];

  return (
    <div className="HomePageshead">
      <div className="main-photo-container"><MainPhoto/></div>
      <div className="discount-cards-container">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '2rem' }}>
            <HeartLoading size="medium" />
          </div>
        ) : banners.length > 0 ? (
          banners.slice(0, 4).map((banner) => (
            <DiscountCard
              key={banner._id}
              title={language === 'en' ? banner.titleEn : banner.title}
              description={language === 'en' ? banner.buttonTextEn : banner.buttonText}
              imageSrc={banner.imageUrl}
              altText={language === 'en' ? banner.titleEn : banner.title}
              link={banner.buttonLink}
            />
          ))
        ) : (
          <p style={{ color: '#e6cd9f', textAlign: 'center', width: '100%' }}>
            ბანერები არ მოიძებნა
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePagesHead;
