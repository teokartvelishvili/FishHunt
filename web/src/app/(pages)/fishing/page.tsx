import type { Metadata } from 'next';
import FishingPage from "./fishingPage";
import FishingRules from "./FishingRules";
// import GoogleMapWithKML from "./GoogleMapWithKML";
// import Pattern from "@/components/pattern/pattern";

export const metadata: Metadata = {
  title: 'თევზაობა საქართველოში - მდინარეები, ტბები და თევზაობის წესები | Fishing in Georgia - Rivers, Lakes & Rules | Рыбалка в Грузии',
  description: 'იპოვეთ საქართველოს ყველაზე პოპულარული თევზსაჭერი ადგილები: მტკვარი, რიონი, ალაზანი, პარავნის ტბა, რიწა. თევზაობის წესები და რეგულაციები. Find best fishing spots in Georgia: Mtkvari, Rioni, Alazani rivers, Paravani, Ritsa lakes. Fishing rules and regulations. Найдите лучшие места для рыбалки в Грузии: реки Мтквари, Риони, Алазани, озера Паравани, Рица.',
  keywords: [
    // Georgian
    'თევზაობა საქართველოში',
    'მტკვარი თევზაობა',
    'რიონი მდინარე',
    'ალაზანი თევზჭერა',
    'პარავნის ტბა',
    'რიწის ტბა',
    'თბილისის ზღვა თევზაობა',
    'ბაზალეთის ტბა',
    'თევზაობის წესები საქართველოში',
    'თევზსაჭერი ადგილები',
    'კალმახის ჭერა',
    'ფორელის თევზაობა',
    'კობრის ჭერა',
    'შავი ზღვა თევზაობა',
    'კასპიის ზღვა',
    'ჭოროხი მდინარე',
    'ენგური',
    'იორი მდინარე',
    
    // English
    'fishing in Georgia',
    'Mtkvari river fishing',
    'Rioni river',
    'Alazani fishing',
    'Lake Paravani',
    'Lake Ritsa',
    'Tbilisi Sea fishing',
    'Lake Bazaleti',
    'fishing rules Georgia',
    'fishing spots Georgia',
    'trout fishing Georgia',
    'carp fishing',
    'Black Sea fishing',
    'Caspian Sea',
    'Chorokhi river',
    'Enguri river',
    'Georgian rivers',
    'Georgian lakes',
    'fishing regulations',
    
    // Russian
    'рыбалка в Грузии',
    'река Мтквари',
    'река Риони',
    'Алазани рыбалка',
    'озеро Паравани',
    'озеро Рица',
    'Тбилисское море',
    'озеро Базалети',
    'правила рыбалки Грузия',
    'места для рыбалки',
    'форель Грузия',
    'карп рыбалка',
    'Черное море рыбалка',
    'Каспийское море',
    'река Чорохи',
  ],
  openGraph: {
    title: 'თევზაობა საქართველოში | Fishing in Georgia | Рыбалка в Грузии',
    description: 'საქართველოს უდიდესი მდინარეები და ტბები თევზაობისთვის. Georgian rivers and lakes for fishing. Реки и озера Грузии для рыбалки.',
    type: 'website',
    locale: 'ka_GE',
    alternateLocale: ['en_US', 'ru_RU'],
  },
  alternates: {
    languages: {
      'ka': '/fishing',
      'en': '/fishing',
      'ru': '/fishing',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const Fishing = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'თევზაობა საქართველოში | Fishing in Georgia',
    description: 'საქართველოს უდიდესი მდინარეები და ტბები თევზაობისთვის - მტკვარი, რიონი, ალაზანი, პარავნის ტბა, რიწა. თევზაობის წესები და რეგულაციები.',
    inLanguage: ['ka', 'en', 'ru'],
    mainEntity: {
      '@type': 'ItemList',
      name: 'საქართველოს მდინარეები და ტბები',
      description: 'თევზაობისთვის შესაფერისი მდინარეები და ტბები საქართველოში',
      itemListElement: [
        {
          '@type': 'Place',
          name: 'მტკვარი | Mtkvari | Кура',
          description: 'საქართველოს უდიდესი მდინარე, 1364 კმ სიგრძე',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 41.7151,
            longitude: 44.8271,
          },
        },
        {
          '@type': 'Place',
          name: 'რიონი | Rioni | Риони',
          description: 'მდინარე დასავლეთ საქართველოში, 327 კმ',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 42.5449,
            longitude: 42.3761,
          },
        },
        {
          '@type': 'Place',
          name: 'ალაზანი | Alazani | Алазани',
          description: 'მდინარე კახეთში, 351 კმ',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 41.8561,
            longitude: 45.6158,
          },
        },
        {
          '@type': 'Place',
          name: 'პარავნის ტბა | Lake Paravani | Озеро Паравани',
          description: 'ჯავახეთის უდიდესი ტბა, 37.5 კმ²',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 41.4517,
            longitude: 43.8092,
          },
        },
        {
          '@type': 'Place',
          name: 'რიწის ტბა | Lake Ritsa | Озеро Рица',
          description: 'მთის ტბა აფხაზეთში, 116 მ სიღრმე',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 43.4764,
            longitude: 40.5297,
          },
        },
      ],
    },
    about: [
      {
        '@type': 'Thing',
        name: 'თევზაობა | Fishing | Рыбалка',
        description: 'სპორტული და სამოყვარულო თევზაობა საქართველოში',
      },
      {
        '@type': 'Thing',
        name: 'თევზაობის წესები | Fishing Rules | Правила рыбалки',
        description: 'საქართველოში თევზაობის ოფიციალური წესები და რეგულაციები',
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FishingPage/>
      <FishingRules/>
      {/* <Pattern imageSize={250} /> */}
      {/* <GoogleMapWithKML /> */}
    </div>
  );
};

export default Fishing;
