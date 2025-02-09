import Image from "next/image";
import Link from "next/link";
import "./huntingPage.css";
import mapImage from "../../assets/map.png";

const HuntingPage = () => {
  return (
    <div className="hunting-container">
      <h1>Hunting</h1>
      <h3>ნადირობის სეზონი გახსნილია</h3>
      <p>
        საუკეთესო გზაა ბუნებასთან კავშირის დასამყარებლად. ყოველი ნაბიჯი, ყოველი თავგადასავალი სავსეა სიწყნარით, 
        ადრენალინით და დაუვიწყარი მომენტებით. ეს არის ცხოვრების სტილი, რომელიც გაძლევს თავისუფლებას, 
        გაკავშირებს ბუნების სულთან და გახსენებს, რა არის ნამდვილი ჰარმონია.
      </p>

      <div className="map">
        <h5>იპოვე რუკაზე სანადირო ლოკაციები საქართველოში</h5>
        <Image src={mapImage} alt="Hunting Map" />
      </div>

      <Link href="/hunting-permits" className="permit-link">
        იარაღის ნებართვა და საგამოცდო ბილეთები
      </Link>
    </div>
  );
};

export default HuntingPage;
