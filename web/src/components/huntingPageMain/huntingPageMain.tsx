import Image from "next/image";
import Link from "next/link";
import "./huntingPageMain.css";
import mapImage from "../../assets/map.png";

const HuntingPageMain = () => {
  return (
    <div className="hunting-main-container">
      <h1 className="hunting-main-title">Hunting</h1>
      <h3 className="hunting-main-season">ნადირობის სეზონი გახსნილია</h3>
      <p className="hunting-main-description">
        საუკეთესო გზაა ბუნებასთან კავშირის დასამყარებლად. ყოველი ნაბიჯი, ყოველი თავგადასავალი სავსეა სიწყნარით, 
        ადრენალინით და დაუვიწყარი მომენტებით. ეს არის ცხოვრების სტილი, რომელიც გაძლევს თავისუფლებას, 
        გაკავშირებს ბუნების სულთან და გახსენებს, რა არის ნამდვილი ჰარმონია.
      </p>

      <div className="hunting-main-map">
        <h5 className="hunting-main-map-title">იპოვე რუკაზე სანადირო ლოკაციები საქართველოში</h5>
        <Image src={mapImage} alt="Hunting Map" className="hunting-main-map-image"/>
      </div>

      <Link href="/hunting-permits" className="hunting-main-permit-link">
        იარაღის ნებართვა და საგამოცდო ბილეთები
      </Link>
    </div>
  );
};

export default HuntingPageMain;

