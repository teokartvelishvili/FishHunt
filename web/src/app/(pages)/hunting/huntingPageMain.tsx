import Image from "next/image";
import Link from "next/link";
import "./huntingPageMain.css";
import mapImage from "../../../assets/map.png";
import noPhoto from "../../../assets/nophoto.webp";
import AnserAnser from "../../../assets/birds/AnserAnser.jpg";
import MarecaStrepera from "../../../assets/birds/MarecaStrepera.png";
import AnasCrecca from "../../../assets/birds/Anas crecca.png";

const category1 = [
  { name: "Anser anser", geo: "რუხი ბატი (Anser anser)", limit: 5, image: AnserAnser },
  { name: "Mareca strepera", geo: "რუხი იხვი (Mareca strepera)", limit: 3, image: MarecaStrepera },
  { name: "Anas crecca", geo: "ჭიკვარა (სტვენია იხვი) (Anas crecca)", limit: 5, image: AnasCrecca },
  { name: "Anas platyrhynchos", geo: "გარეული იხვი (Anas platyrhynchos)", limit: 6, image: noPhoto },
  { name: "Spatula clypeata", geo: "იხვინჯა (ჭახჭახა იხვი) (Spatula clypeata)", limit: 3, image: noPhoto },
  { name: "Spatula clypeata", geo: "ფართოცხვირა (განიერნისკარტა) იხვი (Spatula clypeata)", limit: 3, image: noPhoto },
  { name: "Fulica atra", geo: "მელოტა (Fulica atra)", limit: 6, image: noPhoto },
  { name: "Anas acuta", geo: "კუდსადგისა (ბოლოსადგისა) იხვი (Anas acuta)", limit: 3, image: noPhoto },
  { name: "Mareca Penelope", geo: "თეთრშუბლა იხვი (Mareca Penelope)", limit: 6, image: noPhoto },
  { name: "Anser albifrons", geo: "დიდი თეთრშუბლა ბატი (Anser albifrons)", limit: 5, image: noPhoto },
  { name: "Aythya fuligula", geo: "ქოჩორა ყვინთია (Aythya fuligula)", limit: 5, image: noPhoto }
];

const category2 = [
  { name: "Anser anser", geo: "რუხი ბატი (Anser anser)", limit: 3, image: AnserAnser },
  { name: "Mareca strepera", geo: "რუხი იხვი (Mareca strepera)", limit: 2, image: MarecaStrepera },
  { name: "Anas crecca", geo: "ჭიკვარა (სტვენია იხვი) (Anas crecca)", limit: 3, image: AnasCrecca },
  { name: "Anas platyrhynchos", geo: "გარეული იხვი (Anas platyrhynchos)", limit: 5, image: noPhoto },
  { name: "Spatula clypeata", geo: "იხვინჯა (ჭახჭახა იხვი) (Spatula clypeata)", limit: 2, image: noPhoto },
  { name: "Spatula clypeata", geo: "ფართოცხვირა (განიერნისკარტა) იხვი (Spatula clypeata)", limit: 2, image: noPhoto },
  { name: "Fulica atra", geo: "მელოტა (Fulica atra)", limit: 5, image: noPhoto },
  { name: "Anas acuta", geo: "კუდსადგისა (ბოლოსადგისა) იხვი (Anas acuta)", limit: 2, image: noPhoto },
  { name: "Mareca Penelope", geo: "თეთრშუბლა იხვი (Mareca Penelope)", limit: 3, image: noPhoto },
  { name: "Anser albifrons", geo: "დიდი თეთრშუბლა ბატი (Anser albifrons)", limit: 3, image: noPhoto },
  { name: "Aythya fuligula", geo: "ქოჩორა ყვინთია (Aythya fuligula)", limit: 3, image: noPhoto }
];

const category3 = [
  { name: "Scolopax rusticola", geo: "ტყის ქათამი (Scolopax rusticola)", limit: 5, image: noPhoto },
  { name: "Gallinago gallinago", geo: "ჩიბუხა (Gallinago gallinago)", limit: 5, image: noPhoto },
  { name: "Coturnix coturnix", geo: "მწყერი (Coturnix coturnix)", limit: 20, image: noPhoto },
  { name: "Columba palumbus", geo: "ქედანი (Columba palumbus)", limit: 10, image: noPhoto },
  { name: "Columba livia", geo: "გარეული მტრედი (Columba livia)", limit: 10, image: noPhoto },
  { name: "Columba oenas", geo: "გულიო (გვიძინი) (Columba oenas)", limit: 10, image: noPhoto },
  { name: "Streptopelia decaocto", geo: "საყელოიანი გვრიტი (Streptopelia decaocto)", limit: 5, image: noPhoto },
  { name: "Crex crex", geo: "ღალღა (Crex crex)", limit: 5, image: noPhoto },
  { name: "Lymnocryptes minimus", geo: "ჩიბუხელა (გარშნეპი) (Lymnocryptes minimus)", limit: 5, image: noPhoto }
];



const getSeasonStatus = (startDate: Date, endDate: Date): string => {
  const now = new Date();
  if (now >= startDate && now <= endDate) {
    const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `ნადირობის სეზონი გახსნილია - დარჩენილია ${remainingDays} დღე`;
  } else if (now < startDate) {
    const daysUntilOpen = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `ნადირობის სეზონი დახურულია - გაიხსნება ${daysUntilOpen} დღეში`;
  } else {
    return "ნადირობის სეზონი დახურულია";
  }
};

const getFourthSaturdayOfAugust = (year: number) => {
  const date = new Date(year, 7, 22);
  while (date.getDay() !== 6) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

const HuntingPageMain = () => {
  const currentYear = new Date().getFullYear();
  const seasonStartWaterfowl = new Date(currentYear, 10, 1);
  const seasonEndWaterfowl = new Date(currentYear + 1, 2, 1);
  const seasonStartOthers = getFourthSaturdayOfAugust(currentYear);
  const seasonEndOthers = new Date(currentYear + 1, 1, 15);
  const seasonStartLimitedWaterfowl = new Date(currentYear, 8, 10);
  const seasonEndLimitedWaterfowl = new Date(currentYear, 11, 31);

  const statusWaterfowl = getSeasonStatus(seasonStartWaterfowl, seasonEndWaterfowl);
  const statusOthers = getSeasonStatus(seasonStartOthers, seasonEndOthers);
  const statusLimitedWaterfowl = getSeasonStatus(seasonStartLimitedWaterfowl, seasonEndLimitedWaterfowl);
  
  const seasonDates = [
    { start: seasonStartWaterfowl, end: seasonEndWaterfowl },
    { start: seasonStartOthers, end: seasonEndOthers },
    { start: seasonStartLimitedWaterfowl, end: seasonEndLimitedWaterfowl },
  ];

  const now = new Date();
  const openSeasons = seasonDates.filter(({ start, end }) => now >= start && now <= end);
  const upcomingSeasons = seasonDates.filter(({ start }) => now < start);

  let mainStatus = "ნადირობის სეზონი დახურულია";
  if (openSeasons.length > 0) {
    const closingDates = openSeasons.map(({ end }) => end);
    const earliestClosing = new Date(Math.min(...closingDates.map(date => date.getTime())));
    const daysUntilClose = Math.ceil((earliestClosing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    mainStatus = `ნადირობის სეზონი გახსნილია - დაიხურება ${daysUntilClose} დღეში`;
  } else if (upcomingSeasons.length > 0) {
    const openingDates = upcomingSeasons.map(({ start }) => start);
    const earliestOpening = new Date(Math.min(...openingDates.map(date => date.getTime())));
    const daysUntilOpen = Math.ceil((earliestOpening.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    mainStatus = `ნადირობის სეზონი დახურულია - გაიხსნება ${daysUntilOpen} დღეში`;
  }

  return (
    <div className="hunting-main-container">
      {/* <h1 className="hunting-main-title1">ნადირობა</h1> */}
      <h1 className="hunting-main-title">{mainStatus}</h1>
      
      <h3 className="hunting-main-list-title">ნადირობისათვის დაშვებული ფრინველები:</h3>

      <h4 className="hunting-main-list-category">წყალმცურავი ფრინველები </h4>
      <p className="hunting-main-list-category-p"> (საქართველოს ტერიტორიაზე, გარდა ახალქალაქის, ნინოწმინდის, წალკის და დმანისის მუნიციპალიტეტების ტერიტორიებისა) </p>
      <h3 className="status">{statusWaterfowl}</h3>
      <p className="status"> (01.11 – 01.03) </p>
      <ul className="hunting-main-list">
        {category1.map((bird, index) => (
          <li key={index} className="bird-item">
            <Image src={bird.image} alt={bird.geo} width={100} height={100} />
            {bird.geo} (დღიური ლიმიტი: {bird.limit} ცალი)
          </li>
        ))}
      </ul>

      <h4 className="hunting-main-list-category">წყალმცურავი ფრინველები - სპეციალური ზონები </h4>
      <p className="hunting-main-list-category-p">(მხოლოდ ახალქალაქის, ნინოწმინდის, წალკის და დმანისის მუნიციპალიტეტების  ტერიტორიებზე)</p>
      <h3 className="status">{statusLimitedWaterfowl}</h3>
        <p className="status" >(10.09 – 31.12)</p>
      <ul className="hunting-main-list">

        {category2.map((bird, index) => (
          <li key={index} className="bird-item">
            <Image src={bird.image} alt={bird.geo} width={100} height={100} />
            {bird.geo} (დღიური ლიმიტი: {bird.limit} ცალი)
          </li>
        ))}
      </ul>

      <h4 className="hunting-main-list-category">სხვა ფრინველები</h4>
      <h3 className="status">{statusOthers}</h3>
      <p className="status"> (აგვისტოს მეოთხე შაბათიდან – 15 თებერვლამდე)</p>
      <ul className="hunting-main-list">
        {category3.map((bird, index) => (
          <li key={index} className="bird-item">
            <Image src={bird.image} alt={bird.geo} width={100} height={100} />
            {bird.geo} (დღიური ლიმიტი: {bird.limit} ცალი)
          </li>
        ))}
      </ul>

      <div className="hunting-main-map">
        <h5 className="hunting-main-map-title">იპოვე რუკაზე სანადირო ლოკაციები საქართველოში</h5>
        <Image src={mapImage} alt="Hunting Map" className="hunting-main-map-image" width={600} height={400} />
      </div>

      <Link href="/hunting-permits" className="hunting-main-permit-link">
        იარაღის ნებართვა და საგამოცდო ბილეთები
      </Link>
    </div>
  );
};

export default HuntingPageMain;
