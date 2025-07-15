import HomePageForum from "@/components/homePageForum/homePageForum";
import HomePagesHead from "@/components/homePagesHead/homePagesHead";
import HomePageShop from "@/components/homePageShop/homePageShop";
import TopItems from "@/components/TopItems/TopItems";
import LiveChat from "@/components/liveChat/liveChat";
import BrandLogos from "@/components/BrandLogos/BrandLogos";

const Home = () => {
  return (
    <div>
      <LiveChat />
      <HomePagesHead />
      <TopItems />

      <HomePageShop />
      <HomePageForum />
      <BrandLogos />
    </div>
  );
};

export default Home;
