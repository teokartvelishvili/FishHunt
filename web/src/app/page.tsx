import HomePageForum from "@/components/homePageForum/homePageForum";
import HomePagesHead from "@/components/homePagesHead/homePagesHead";
import HomePageShop from "@/components/homePageShop/homePageShop";
import TopItems from "@/components/TopItems/TopItems";
// import LiveChat from "@/components/liveChat/liveChat";
import BrandLogos from "@/components/BrandLogos/BrandLogos";
// import DiscountCard from "../components/discountCard/discountCard";
// import campImage from '../assets/camp.webp'
// import rifleImage from '../assets/rifle.jpg'

const Home = () => {
  return (
    <div>
      {/* <LiveChat /> */}
      <HomePagesHead />
      {/* <div className="discount-cards-container">
        <DiscountCard
          title="Special Offer"
          description="Get 50% Off on Camping Gear"
          imageSrc={campImage}
          altText="Camping Tent"
        />
        <DiscountCard
          title="Special Offer"
          description="Get 50% Off on Camping Gear"
          imageSrc={rifleImage}
          altText="Camping Tent"
        />
            <DiscountCard
          title="Special Offer"
          description="Get 50% Off on Camping Gear"
          imageSrc={campImage}
          altText="Camping Tent"
        />
        <DiscountCard
          title="Special Offer"
          description="Get 50% Off on Camping Gear"
          imageSrc={rifleImage}
          altText="Camping Tent"
        />
      </div>
  */}
      <TopItems />

      <HomePageShop />
      <HomePageForum />
      <BrandLogos />
    </div>
  );
};

export default Home;
