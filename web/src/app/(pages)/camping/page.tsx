"use client";

import { useLanguage } from "@/hooks/LanguageContext";
import Link from "next/link";
import "./camping.css";

export default function CampingPage() {
  const { language } = useLanguage();

  const content = {
    ge: {
      title: "ლაშქრობა",
      subtitle: "მალე დაემატება...",
      description: "მალე დაემატება ლაშქრობისთვის შესაფერისი ადგილები რუკაზე და სათავგადასავლო ტურები საქართველოში ჯავშნის ფუნქციით.",
      features: [
        "🏕️ საუკეთესო ლაშქრობის ადგილები საქართველოში",
        "🗺️ ინტერაქტიული რუკა ადგილების აღნიშვნით",
        "🏔️ სათავგადასავლო ტურების პაკეტები",
        "📅 ონლაინ ჯავშნის სისტემა",
        "👥 ჯგუფური და ინდივიდუალური ტურები",
        "🎒 აღჭურვილობის გაქირავების სერვისი"
      ],
      featuresTitle: "რას შემოგთავაზებთ:",
      feedbackTitle: "თქვენი აზრი მნიშვნელოვანია!",
      feedbackText: "თუ დაინტერესებული ხართ ლაშქრობის სერვისებით, გაგვიზიარეთ თქვენი მოსაზრება ფორუმში. თქვენი გამოხმაურება დაგვეხმარება ვებგვერდის შემდეგი ფაზების განვითარებაში.",
      forumButton: "ფორუმში დაწერა"
    },
    en: {
      title: "Camping",
      subtitle: "Coming Soon...",
      description: "Soon we will add suitable camping locations on the map and adventure tours in Georgia with booking functionality.",
      features: [
        "🏕️ Best camping spots in Georgia",
        "🗺️ Interactive map with location markers",
        "🏔️ Adventure tour packages",
        "📅 Online booking system",
        "👥 Group and individual tours",
        "🎒 Equipment rental service"
      ],
      featuresTitle: "What We'll Offer:",
      feedbackTitle: "Your Opinion Matters!",
      feedbackText: "If you are interested in camping services, share your thoughts on the forum. Your feedback will help us develop the next phases of the website.",
      forumButton: "Write on Forum"
    },
    ru: {
      title: "Кемпинг",
      subtitle: "Скоро будет добавлено...",
      description: "Скоро будут добавлены подходящие места для кемпинга на карте и приключенческие туры по Грузии с функцией бронирования.",
      features: [
        "🏕️ Лучшие места для кемпинга в Грузии",
        "🗺️ Интерактивная карта с отметками мест",
        "🏔️ Пакеты приключенческих туров",
        "📅 Система онлайн-бронирования",
        "👥 Групповые и индивидуальные туры",
        "🎒 Сервис аренды оборудования"
      ],
      featuresTitle: "Что мы предложим:",
      feedbackTitle: "Ваше мнение важно!",
      feedbackText: "Если вы заинтересованы в услугах кемпинга, поделитесь своими мыслями на форуме. Ваши отзывы помогут нам развивать следующие этапы сайта.",
      forumButton: "Написать на форуме"
    }
  };

  const currentContent = content[language as keyof typeof content] || content.ge;

  return (
    <div className="camping-page">
      <div className="camping-container">
        <div className="camping-header">
          <h1 className="camping-title">{currentContent.title}</h1>
          <p className="camping-subtitle">{currentContent.subtitle}</p>
        </div>

        <div className="camping-content">
          <div className="camping-main-info">
            <p className="camping-description">{currentContent.description}</p>
          </div>

          <div className="camping-features">
            <h2>{currentContent.featuresTitle}</h2>
            <ul className="features-list">
              {currentContent.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="camping-feedback">
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
