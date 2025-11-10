"use client";

import Image from "next/image";
import Link from "next/link";
import "./huntingPageMain.css";
import AnserAnser from "../../../assets/birds/AnserAnser.jpg";
import MarecaStrepera from "../../../assets/birds/MarecaStrepera.png";
import AnasCrecca from "../../../assets/birds/Anas crecca.png";
import AnasPlatyrhynchos from "../../../assets/birds/AnasPlatyrhynchos.jpg";
import AnasQuerquedula from "../../../assets/birds/Anas querquedula.jpg";
import AnasClypeata from "../../../assets/birds/Anas clypeata.jpeg";
import FulicaAtra from "../../../assets/birds/Fulica atra.png";
import AnasAcuta from "../../../assets/birds/Anas acuta.png";
import MarecaPenelope from "../../../assets/birds/Mareca Penelope.jpg";
import AnserAlbifrons from "../../../assets/birds/Anser albifrons.jpg";
import AythyaFuligula from "../../../assets/birds/Aythya fuligula.jpeg";
import ScolopaxRusticola from "../../../assets/birds/Scolopax rusticola.jpeg";
import GallinagoGallinago from "../../../assets/birds/Gallinago gallinago.png";
import Coturnix from "../../../assets/birds/Coturnix coturnix.png";
import ColumbaPalumbus from "../../../assets/birds/Columba palumbus.jpeg";
import ColumbaLivia from "../../../assets/birds/Columba livia.png";
import ColumbaOenas from "../../../assets/birds/Columba oenas.jpeg";
import StreptopeliaDecaocto from "../../../assets/birds/Streptopelia decaocto.png";
import Crex from "../../../assets/birds/Crex crex.png";
import LymnocryptesMinimus from "../../../assets/birds/Lymnocryptes minimus.jpeg";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useLanguage } from "@/hooks/LanguageContext";

const category1 = [
  { name: "Anser anser", geo: "რუხი ბატი (Anser anser)", limit: 5, image: AnserAnser },
  { name: "Mareca strepera", geo: "რუხი იხვი (Mareca strepera (Anas strepera))", limit: 3, image: MarecaStrepera },
  { name: "Anas crecca", geo: "ჭიკვარა (სტვენია იხვი) (Anas crecca)", limit: 5, image: AnasCrecca },
  { name: "Anas platyrhynchos", geo: "გარეული იხვი (Anas platyrhynchos)", limit: 6, image: AnasPlatyrhynchos },
  { name: "Anas querquedula", geo: "იხვინჯა (ჭახჭახა იხვი) (Spatula clypeata (Anas querquedula))", limit: 3, image: AnasQuerquedula },
  { name: "Anas clypeata", geo: "ფართოცხვირა (განიერნისკარტა) იხვი (Spatula clypeata (Anas clypeata))", limit: 3, image: AnasClypeata },
  { name: "Fulica atra", geo: "მელოტა (Fulica atra)", limit: 6, image: FulicaAtra },
  { name: "Anas acuta", geo: "კუდსადგისა (ბოლოსადგისა) იხვი (Anas acuta)", limit: 3, image: AnasAcuta },
  { name: "Mareca Penelope", geo: "თეთრშუბლა იხვი (Mareca Penelope (Anas penelope))", limit: 6, image: MarecaPenelope },
  { name: "Anser albifrons", geo: "დიდი თეთრშუბლა ბატი (Anser albifrons)", limit: 5, image: AnserAlbifrons},
  { name: "Aythya fuligula", geo: "ქოჩორა ყვინთია (Aythya fuligula)", limit: 5, image: AythyaFuligula }
];

const category2 = [
  { name: "Anser anser", geo: "რუხი ბატი (Anser anser)", limit: 3, image: AnserAnser },
  { name: "Mareca strepera", geo: "რუხი იხვი (Mareca strepera (Anas strepera))", limit: 2, image: MarecaStrepera },
  { name: "Anas crecca", geo: "ჭიკვარა (სტვენია იხვი) (Anas crecca)", limit: 3, image: AnasCrecca },
  { name: "Anas platyrhynchos", geo: "გარეული იხვი (Anas platyrhynchos)", limit: 5, image: AnasPlatyrhynchos },
  { name: "Anas querquedula", geo: "იხვინჯა (ჭახჭახა იხვი) (Spatula clypeata (Anas querquedula))", limit: 2, image: AnasQuerquedula },
  { name: "Anas clypeata", geo: "ფართოცხვირა (განიერნისკარტა) იხვი (Spatula clypeata (Anas clypeata))", limit: 2, image: AnasClypeata },
  { name: "Fulica atra", geo: "მელოტა (Fulica atra)", limit: 5, image: FulicaAtra },
  { name: "Anas acuta", geo: "კუდსადგისა (ბოლოსადგისა) იხვი (Anas acuta)", limit: 2, image: AnasAcuta },
  { name: "Mareca Penelope", geo: "თეთრშუბლა იხვი (Mareca Penelope (Anas penelope))", limit: 3, image: MarecaPenelope },
  { name: "Anser albifrons", geo: "დიდი თეთრშუბლა ბატი (Anser albifrons)", limit: 3, image: AnserAlbifrons },
  { name: "Aythya fuligula", geo: "ქოჩორა ყვინთია (Aythya fuligula)", limit: 3, image: AythyaFuligula }
];

const category3 = [
  { name: "Scolopax rusticola", geo: "ტყის ქათამი (Scolopax rusticola)", limit: 5, image: ScolopaxRusticola },
  { name: "Gallinago gallinago", geo: "ჩიბუხა (Gallinago)", limit: 5, image: GallinagoGallinago },
  { name: "Coturnix coturnix", geo: "მწყერი (Coturnix)", limit: 20, image: Coturnix },
  { name: "Columba palumbus", geo: "ქედანი (Columba palumbus)", limit: 10, image: ColumbaPalumbus },
  { name: "Columba livia", geo: "გარეული მტრედი (Columba livia)", limit: 10, image: ColumbaLivia },
  { name: "Columba oenas", geo: "გულიო (გვიძინი) (Columba oenas)", limit: 10, image: ColumbaOenas },
  { name: "Streptopelia decaocto", geo: "საყელოიანი გვრიტი (Streptopelia decaocto)", limit: 5, image: StreptopeliaDecaocto },
  { name: "Crex crex", geo: "ღალღა (Crex)", limit: 5, image: Crex },
  { name: "Lymnocryptes minimus", geo: "ჩიბუხელა (გარშნეპი) (Lymnocryptes minimus)", limit: 5, image: LymnocryptesMinimus }
];



const getSeasonStatus = (startDate: Date, endDate: Date, t: (key: string) => string): string => {
  const now = new Date();
  if (now >= startDate && now <= endDate) {
    const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `${t("hunting.seasonOpen")} ${remainingDays} ${t("hunting.days")}`;
  } else if (now < startDate) {
    const daysUntilOpen = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `${t("hunting.seasonWillOpen")} ${daysUntilOpen} ${t("hunting.daysIn")}`;
  } else {
    return t("hunting.seasonClosed");
  }
};

const getFourthSaturdayOfAugust = (year: number) => {
  const date = new Date(year, 7, 22);
  while (date.getDay() !== 6) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

function HuntingPageMain() {
  const { t } = useLanguage();
  const [showCategory1, setShowCategory1] = useState(false);
  const [showCategory2, setShowCategory2] = useState(false);
  const [showCategory3, setShowCategory3] = useState(false);

  const currentYear = new Date().getFullYear();
  const seasonStartWaterfowl = new Date(currentYear, 10, 1);
  const seasonEndWaterfowl = new Date(currentYear + 1, 2, 1);
  const seasonStartOthers = getFourthSaturdayOfAugust(currentYear);
  const seasonEndOthers = new Date(currentYear + 1, 1, 15);
  const seasonStartLimitedWaterfowl = new Date(currentYear, 8, 10);
  const seasonEndLimitedWaterfowl = new Date(currentYear, 11, 31);

  const statusWaterfowl = getSeasonStatus(seasonStartWaterfowl, seasonEndWaterfowl, t);
  const statusOthers = getSeasonStatus(seasonStartOthers, seasonEndOthers, t);
  const statusLimitedWaterfowl = getSeasonStatus(seasonStartLimitedWaterfowl, seasonEndLimitedWaterfowl, t);
  
  const seasonDates = [
    { start: seasonStartWaterfowl, end: seasonEndWaterfowl },
    { start: seasonStartOthers, end: seasonEndOthers },
    { start: seasonStartLimitedWaterfowl, end: seasonEndLimitedWaterfowl },
  ];

  const now = new Date();
  const openSeasons = seasonDates.filter(({ start, end }) => now >= start && now <= end);
  const upcomingSeasons = seasonDates.filter(({ start }) => now < start);

  let mainStatus = t("hunting.seasonClosed");
  if (openSeasons.length > 0) {
    const closingDates = openSeasons.map(({ end }) => end);
    const earliestClosing = new Date(Math.min(...closingDates.map(date => date.getTime())));
    const daysUntilClose = Math.ceil((earliestClosing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    mainStatus = `${t("hunting.seasonWillClose")} ${daysUntilClose} ${t("hunting.daysIn")}`;
  } else if (upcomingSeasons.length > 0) {
    const openingDates = upcomingSeasons.map(({ start }) => start);
    const earliestOpening = new Date(Math.min(...openingDates.map(date => date.getTime())));
    const daysUntilOpen = Math.ceil((earliestOpening.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    mainStatus = `${t("hunting.seasonWillOpen")} ${daysUntilOpen} ${t("hunting.daysIn")}`;
  }

  return (
    <div className="hunting-main-container">
      {/* <h1 className="hunting-main-title1">ნადირობა</h1> */}
      <h1 className="hunting-main-title">{mainStatus}</h1>
      
      <h3 className="hunting-main-list-title">{t("hunting.allowedBirdsTitle")}</h3>

      {/* Category 1 - Waterfowl */}
      <div className="section-container">
        <h3 className="status">{statusWaterfowl}</h3>
        <p className="status">(01.11 – 01.03)</p>
        
        <div 
          className="section-header"
          onClick={() => setShowCategory1(!showCategory1)}
        >
          <div>
            <h4 className="hunting-main-list-category" style={{margin: 0, textAlign: 'left'}}>
              {t("hunting.waterfowlCategory")}
            </h4>
            <p className="hunting-main-list-category-p" style={{margin: '5px 0', fontSize: '0.9em', textAlign: 'left'}}>
              {t("hunting.waterfowlZone")}
            </p>
          </div>
          <FaChevronDown 
            className={`section-arrow ${showCategory1 ? 'open' : ''}`}
          />
        </div>
        
        <div className={`section-content ${showCategory1 ? 'open' : ''}`}>
          <ul className="hunting-main-list">
            {category1.map((bird, index) => (
              <li key={index} className="bird-item">
                <Image src={bird.image} alt={bird.geo} width={100} height={100} />
                {bird.geo} ({t("hunting.dailyLimit")} {bird.limit} {t("hunting.pieces")})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Category 2 - Limited Zones Waterfowl */}
      <div className="section-container">
        <h3 className="status">{statusLimitedWaterfowl}</h3>
        <p className="status">(10.09 – 31.12)</p>
        
        <div 
          className="section-header"
          onClick={() => setShowCategory2(!showCategory2)}
        >
          <div>
            <h4 className="hunting-main-list-category" style={{margin: 0, textAlign: 'left'}}>
              {t("hunting.specialZonesCategory")}
            </h4>
            <p className="hunting-main-list-category-p" style={{margin: '5px 0', fontSize: '0.9em', textAlign: 'left'}}>
              {t("hunting.specialZonesInfo")}
            </p>
          </div>
          <FaChevronDown 
            className={`section-arrow ${showCategory2 ? 'open' : ''}`}
          />
        </div>
        
        <div className={`section-content ${showCategory2 ? 'open' : ''}`}>
          <ul className="hunting-main-list">
            {category2.map((bird, index) => (
              <li key={index} className="bird-item">
                <Image src={bird.image} alt={bird.geo} width={100} height={100} />
                {bird.geo} ({t("hunting.dailyLimit")} {bird.limit} {t("hunting.pieces")})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Category 3 - Other Birds */}
      <div className="section-container">
        <h3 className="status">{statusOthers}</h3>
        <p className="status">(აგვისტოს მეოთხე შაბათიდან – 15 თებერვლამდე)</p>
        
        <div 
          className="section-header"
          onClick={() => setShowCategory3(!showCategory3)}
        >
          <div>
            <h4 className="hunting-main-list-category" style={{margin: 0, textAlign: 'left'}}>
              {t("hunting.otherBirdsCategory")}
            </h4>
          </div>
          <FaChevronDown 
            className={`section-arrow ${showCategory3 ? 'open' : ''}`}
          />
        </div>
        
        <div className={`section-content ${showCategory3 ? 'open' : ''}`}>
          <ul className="hunting-main-list">
            {category3.map((bird, index) => (
              <li key={index} className="bird-item">
                <Image src={bird.image} alt={bird.geo} width={100} height={100} />
                {bird.geo} ({t("hunting.dailyLimit")} {bird.limit} {t("hunting.pieces")})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link href="/hunting-permits" className="hunting-main-permit-link">
        {t("hunting.permitLink")}
      </Link>


      <div className="hunting-rules-container">
      <h2 className="hunting-rules-title">{t("hunting.prohibitedTitle")}</h2>
      <ul className="hunting-rules-list">
        <li>
          {t("hunting.prohibitedPlaces")}
          <ul>
            <li>{t("hunting.citiesAdmin")}</li>
            <li>{t("hunting.stateReserves")}</li>
            <li>{t("hunting.samukhi")}</li>
            <li>{t("hunting.reserveZones")}</li>
            <li>{t("hunting.breedingFarms")}</li>
          </ul>
        </li>
        <li>
          {t("hunting.prohibitedWeapons")}
          <ul>
            <li>{t("hunting.smoothboreGun")}</li>
            <li>{t("hunting.rifledGun")}</li>
            <li>{t("hunting.combinedGun")}</li>
            <li>{t("hunting.coldWeapon")}</li>
            <li>{t("hunting.pneumaticGun")}</li>
          </ul>
        </li>
      </ul>
      <h3 className="hunting-rules-subtitle">{t("hunting.allowedTitle")}</h3>
      <p className="hunting-rules-text">
        {t("hunting.feeInfo")}
      </p>
      <h3 className="hunting-rules-subtitle">{t("hunting.feePaymentTitle")}</h3>
      <p className="hunting-rules-text">
        {t("hunting.feePaymentInfo")}
      </p>
      <p className="hunting-rules-text">
        {t("hunting.feeExample")} <strong>{t("hunting.tbilisiCode")}</strong>, {t("hunting.forAkhmeti")}
        <strong> {t("hunting.akhmetiCode")}</strong>, {t("hunting.forRustavi")} <strong>{t("hunting.rustaviCode")}</strong>.
      </p>
    </div>



    </div>
  );
};

export default HuntingPageMain;
