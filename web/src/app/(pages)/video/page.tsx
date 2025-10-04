"use client";

import { useLanguage } from "@/hooks/LanguageContext";
import Link from "next/link";
import "./video.css";

export default function VideoPage() {
  const { language } = useLanguage();

  const content = {
    ge: {
      title: "ვიდეო",
      subtitle: "მალე დაემატება...",
      description: "მალე დაემატება სასარგებლო ვიდეოები თევზაობის, ნადირობის და ლაშქრობის შესახებ - ტუტორიალები, გაიდები, მიმოხილვები და სათავგადასავლო ისტორიები საქართველოს ულამაზეს ადგილებიდან.",
      features: [
        "🎣 თევზაობის ტექნიკები და ტუტორიალები",
        "🏹 ნადირობის გაიდები და რჩევები",
        "🏕️ ლაშქრობის ადგილების მიმოხილვა",
        "🛠️ აღჭურვილობის დეტალური რევიუები",
        "🗺️ საქართველოს საუკეთესო ადგილების ვირტუალური ტურები",
        "👥 გამოცდილი მონადირეების და მეთევზეების ინტერვიუები",
        "📺 ლაივ სტრიმები და ონლაინ ტურნირები"
      ],
      featuresTitle: "რას შემოგთავაზებთ:",
      feedbackTitle: "გაგვიზიარეთ თქვენი იდეები!",
      feedbackText: "რა სახის ვიდეო კონტენტი გაინტერესებთ? გაგვიზიარეთ თქვენი მოსაზრება და სურვილები ფორუმში. ერთად შევქმნათ სასარგებლო და საინტერესო კონტენტი!",
      forumButton: "ფორუმში დაწერა"
    },
    en: {
      title: "Videos",
      subtitle: "Coming Soon...",
      description: "Soon we will add useful videos about fishing, hunting, and camping - tutorials, guides, reviews, and adventure stories from the most beautiful places in Georgia.",
      features: [
        "🎣 Fishing techniques and tutorials",
        "🏹 Hunting guides and tips",
        "🏕️ Camping location reviews",
        "🛠️ Detailed equipment reviews",
        "🗺️ Virtual tours of Georgia's best spots",
        "👥 Interviews with experienced hunters and fishermen",
        "📺 Live streams and online tournaments"
      ],
      featuresTitle: "What We'll Offer:",
      feedbackTitle: "Share Your Ideas!",
      feedbackText: "What kind of video content interests you? Share your thoughts and wishes on the forum. Let's create useful and interesting content together!",
      forumButton: "Write on Forum"
    },
    ru: {
      title: "Видео",
      subtitle: "Скоро будет добавлено...",
      description: "Скоро будут добавлены полезные видео о рыбалке, охоте и кемпинге - учебные материалы, гайды, обзоры и приключенческие истории из самых красивых мест Грузии.",
      features: [
        "🎣 Техники рыбалки и учебные материалы",
        "🏹 Гайды и советы по охоте",
        "🏕️ Обзоры мест для кемпинга",
        "🛠️ Подробные обзоры оборудования",
        "🗺️ Виртуальные туры по лучшим местам Грузии",
        "👥 Интервью с опытными охотниками и рыбаками",
        "📺 Прямые трансляции и онлайн-турниры"
      ],
      featuresTitle: "Что мы предложим:",
      feedbackTitle: "Поделитесь своими идеями!",
      feedbackText: "Какой видеоконтент вас интересует? Поделитесь своими мыслями и пожеланиями на форуме. Давайте создадим полезный и интересный контент вместе!",
      forumButton: "Написать на форуме"
    }
  };

  const currentContent = content[language as keyof typeof content] || content.ge;

  return (
    <div className="video-page">
      <div className="video-container">
        <div className="video-header">
          <h1 className="video-title">{currentContent.title}</h1>
          <p className="video-subtitle">{currentContent.subtitle}</p>
        </div>

        <div className="video-content">
          <div className="video-main-info">
            <p className="video-description">{currentContent.description}</p>
          </div>

          <div className="video-features">
            <h2>{currentContent.featuresTitle}</h2>
            <ul className="features-list">
              {currentContent.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="video-feedback">
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
