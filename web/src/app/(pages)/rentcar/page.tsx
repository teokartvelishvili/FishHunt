"use client";

import { useLanguage } from "@/hooks/LanguageContext";
import Link from "next/link";
import "./rent-car.css";

export default function RentCarPage() {
  const { language } = useLanguage();

  const content = {
    ge: {
      title: "მანქანის გაქირავება",
      subtitle: "მალე დაემატება...",
      description: "მალე დაემატება ლაშქრობისთვის შესაფერისი მანქანების გაქირავება - ჯიპები, მინივენები და სხვა მოსახერხებელი ავტომობილები თქვენი სათავგადასავლო მოგზაურობისთვის.",
      features: [
        "🚙 ჯიპები ულტრა-ბუნებისთვის",
        "🚐 მინივენები ჯგუფური მოგზაურობებისთვის",
        "🗺️ GPS ნავიგაციით აღჭურვილი ავტომობილები",
        "💰 მომგებიანი ფასები დღიური და კვირეული გაქირავებით",
        "🛡️ სრული დაზღვევა",
        "🔧 24/7 ტექნიკური მხარდაჭერა",
        "📍 თბილისის აეროპორტში მიღება/ჩაბარება"
      ],
      featuresTitle: "რას შემოგთავაზებთ:",
      feedbackTitle: "დაგვეხმარეთ სერვისის განვითარებაში!",
      feedbackText: "თუ დაინტერესებული ხართ მანქანის გაქირავების სერვისით ლაშქრობისთვის, გაგვიზიარეთ თქვენი საჭიროებები და მოსაზრება ფორუმში. თქვენი გამოხმაურება დაგვეხმარება სწორი მიმართულებით განვითარებაში.",
      forumButton: "ფორუმში დაწერა"
    },
    en: {
      title: "Car Rental",
      subtitle: "Coming Soon...",
      description: "Soon we will add car rentals suitable for camping - jeeps, minivans, and other convenient vehicles for your adventure trips.",
      features: [
        "🚙 Jeeps for off-road adventures",
        "🚐 Minivans for group travels",
        "🗺️ Vehicles equipped with GPS navigation",
        "💰 Affordable daily and weekly rental rates",
        "🛡️ Full insurance coverage",
        "🔧 24/7 technical support",
        "📍 Pick-up/drop-off at Tbilisi Airport"
      ],
      featuresTitle: "What We'll Offer:",
      feedbackTitle: "Help Us Develop the Service!",
      feedbackText: "If you are interested in car rental services for camping, share your needs and thoughts on the forum. Your feedback will help us develop in the right direction.",
      forumButton: "Write on Forum"
    },
    ru: {
      title: "Аренда автомобилей",
      subtitle: "Скоро будет добавлено...",
      description: "Скоро будет добавлена аренда автомобилей, подходящих для кемпинга - джипы, минивэны и другие удобные транспортные средства для ваших приключенческих поездок.",
      features: [
        "🚙 Джипы для внедорожных приключений",
        "🚐 Минивэны для групповых поездок",
        "🗺️ Автомобили с GPS-навигацией",
        "💰 Доступные цены на суточную и недельную аренду",
        "🛡️ Полное страхование",
        "🔧 Техническая поддержка 24/7",
        "📍 Получение/сдача в аэропорту Тбилиси"
      ],
      featuresTitle: "Что мы предложим:",
      feedbackTitle: "Помогите нам развить сервис!",
      feedbackText: "Если вы заинтересованы в услугах аренды автомобилей для кемпинга, поделитесь своими потребностями и мыслями на форуме. Ваши отзывы помогут нам развиваться в правильном направлении.",
      forumButton: "Написать на форуме"
    }
  };

  const currentContent = content[language as keyof typeof content] || content.ge;

  return (
    <div className="rent-car-page">
      <div className="rent-car-container">
        <div className="rent-car-header">
          <h1 className="rent-car-title">{currentContent.title}</h1>
          <p className="rent-car-subtitle">{currentContent.subtitle}</p>
        </div>

        <div className="rent-car-content">
          <div className="rent-car-main-info">
            <p className="rent-car-description">{currentContent.description}</p>
          </div>

          <div className="rent-car-features">
            <h2>{currentContent.featuresTitle}</h2>
            <ul className="features-list">
              {currentContent.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="rent-car-feedback">
            <h2>{currentContent.feedbackTitle}</h2>
            <p>{currentContent.feedbackText}</p>
            <Link href="/forum" className="forum-button">
              {currentContent.forumButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
