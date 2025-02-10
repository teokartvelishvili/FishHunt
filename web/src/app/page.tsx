import HomePagesHead from "@/components/homePagesHead/homePagesHead";
import TopItems from "@/components/TopItems/TopItems";
import HomePageForum from "@/components/homePageForum/homePageForum";


const HomePage = () => {

  return (
    <div>
      <HomePagesHead/>
      <TopItems/>
      <HomePageForum/>
    </div>
  );
};

export default HomePage;
