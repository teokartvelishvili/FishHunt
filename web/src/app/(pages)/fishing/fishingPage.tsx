import "./fishingPage.css";
import GoogleMap from "./GoogleMap";
import RiverList from "./RiverList";

const FishingPage = () => {
  return (
    <div>
      <RiverList/>
      <GoogleMap />
    </div>
  );
};

export default FishingPage;
