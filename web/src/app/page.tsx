import HomePageForum from "@/components/homePageForum/homePageForum";
import HomePagesHead from "@/components/homePagesHead/homePagesHead";
import TopItems from "@/components/TopItems/TopItems";

const Home = () => {
  

  return (
    <div>
      <HomePagesHead/>
      <TopItems/>
      <HomePageForum/>
    </div>
  );
};

export default Home;