import HomePageForum from "@/components/homePageForum/homePageForum";
import HomePagesHead from "@/components/homePagesHead/homePagesHead";
import HomePageShop from "@/components/homePageShop/homePageShop";
import TopItems from "@/components/TopItems/TopItems";
import LiveChat from "@/components/liveChat/liveChat";
const Home = () => {
  return (
    <div>
      <LiveChat/>
      <HomePagesHead/>
      <TopItems/>
      <HomePageShop/>
      <HomePageForum/>
    </div>
  );
};

export default Home;