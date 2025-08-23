import MainPhoto from "../mainPhoto/mainPhoto";
import "./homePagesHead.css";
// import DiscountCard from "../discountCard/discountCard";
// import campImage from '../../assets/camp.webp'
// import rifleImage from '../../assets/rifle.jpg'
// import PatternBackground from "../patternBackground/patternBackground";
// import WelcomeMessage from "../welcomeMessage/welcomeMessage";

const HomePagesHead = () => {
  return (
    <div className="HomePageshead">
      {/* <PatternBackground imageSize={350} /> */}
      {/* <WelcomeMessage /> */}
      {/* <div><Navbar/></div> */}
      <div className="main-photo-container"><MainPhoto/></div>
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
        imageSrc={rifleImage} 
        altText="Camping Tent"
      />
      </div> */}
    </div>
  );
};

export default HomePagesHead;
