"use client";

import { useLanguage } from "@/hooks/LanguageContext";
import "./privacy-policy.css";

export default function PrivacyPolicy() {
  const { language } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const content = {
    ge: {
      title: "FishHunt.ge კონფიდენციალურობის პოლიტიკა",
      effectiveDate: "ამოქმედების თარიღი: 15 იანვარი, 2025",
      printButton: "📄 ბეჭდვა/გადმოწერა",
      sections: [
        {
          title: "ინფორმაციის შეგროვება",
          content: "თქვენგან ვაგროვებთ იმ ინფორმაციას, რომელსაც პირდაპირ გვაწვდით — როცა ქმნით ანგარიშს, ყიდულობთ თევზაობის, ნადირობის ან ლაშქრობის აღჭურვილობას, იტვირთავთ თქვენს გამოცდილებას ან ნამუშევრებს, ან გვიკავშირდებით. ეს შეიძლება მოიცავდეს თქვენს სახელს, ელფოსტის მისამართს, ტელეფონის ნომერს, მიწოდების მისამართს, გადახდის ინფორმაციას და პროდუქტების დეტალებს."
        },
        {
          title: "როგორ ვიყენებთ თქვენს ინფორმაციას",
          content: "• თევზაობის, ნადირობის და ლაშქრობის აღჭურვილობის შეკვეთების დამუშავება და შესრულება\n• მომხმარებლებისა და მყიდველების დაკავშირება ჩვენს პლატფორმაზე\n• შეკვეთის დადასტურების და მიწოდების განახლებების გაგზავნა\n• მომხმარებლისა და მყიდველების მხარდაჭერის უზრუნველყოფა\n• ჩვენი პლატფორმისა და მარკეტპლეისის სერვისების გაუმჯობესება\n• სარეკლამო ელფოსტების გაგზავნა ახალი პროდუქტებისა და შეთავაზებების შესახებ (თქვენი თანხმობით)"
        },
        {
          title: "ინფორმაციის გაზიარება",
          content: "ჩვენ არ ვყიდით, არ ვცვლით და არ ვაქირავებთ თქვენს პირად ინფორმაციას მესამე მხარეებისთვის. შეიძლება გავაზიაროთ თქვენი ინფორმაცია სანდო სერვის პროვაიდერებთან, რომლებიც გვეხმარებიან ჩვენი პლატფორმის მართვაში, როგორიცაა გადახდის დამუშავების კომპანიები, მიწოდების სერვისები და პროდუქტების ავთენტიფიკაციის სერვისები, მაგრამ მხოლოდ იმ ფარგლებში, რომელიც საჭიროა ჩვენი სერვისების უზრუნველსაყოფად."
        },
        {
          title: "მონაცემთა უსაფრთხოება",
          content: "ჩვენ ვახორციელებთ შესაბამის უსაფრთხოების ზომებს თქვენი პირადი ინფორმაციის დასაცავად უნებართვო წვდომისგან, შეცვლისგან, გამჟღავნებისგან ან განადგურებისგან. თუმცა, ინტერნეტით გადაცემის არცერთი მეთოდი არ არის 100% უსაფრთხო."
        },
        {
          title: "ქუქიები",
          content: "ჩვენი ვებსაიტი იყენებს ქუქიებს თქვენი დათვალიერების გამოცდილების გასაუმჯობესებლად, თქვენი პრეფერენსების დასამახსოვრებლად და ვებსაიტის ტრაფიკის გასაანალიზებლად. შეგიძლიათ გამორთოთ ქუქიები თქვენი ბრაუზერის პარამეტრებში, მაგრამ ეს შეიძლება იმოქმედოს ჩვენი ვებსაიტის ფუნქციონალზე."
        },
        {
          title: "თქვენი უფლებები",
          content: "გაქვთ უფლება, იხილოთ, განაახლოთ ან წაშალოთ თქვენი პირადი ინფორმაცია. ასევე შეგიძლიათ ნებისმიერ დროს გააუქმოთ სარეკლამო ელფოსტების მიღება. აღნიშნული უფლებების გამოსაყენებლად, გთხოვთ დაგვიკავშირდეთ ქვემოთ მოცემული საკონტაქტო ინფორმაციის გამოყენებით."
        },
        {
          title: "საკონტაქტო ინფორმაცია",
          content: "თუ გაქვთ რაიმე კითხვა ამ კონფიდენციალურობის პოლიტიკასთან დაკავშირებით, გთხოვთ დაგვიკავშირდეთ:\n\ninfo@fishhunt.ge\n+995 551 999 055\nთბილისი, საქართველო"
        },
        {
          title: "ცვლილებები ამ პოლიტიკაში",
          content: "ჩვენ შეიძლება პერიოდულად განვაახლოთ კონფიდენციალურობის პოლიტიკა. ჩვენ შეგატყობინებთ ნებისმიერი ცვლილების შესახებ ამ გვერდზე ახალი კონფიდენციალურობის პოლიტიკის განთავსებით და ამოქმედების თარიღის განახლებით."
        }
      ]
    },
    en: {
      title: "FishHunt.ge Privacy Policy",
      effectiveDate: "Effective Date: January 15, 2025",
      printButton: "📄 Print/Download",
      sections: [
        {
          title: "Information Collection",
          content: "We collect information you provide directly to us — when you create an account, purchase fishing, hunting or camping equipment, upload your experiences or works, or contact us. This may include your name, email address, phone number, shipping address, payment information, and product details."
        },
        {
          title: "How We Use Your Information",
          content: "• Process and fulfill orders for fishing, hunting and camping equipment\n• Connect customers and buyers on our platform\n• Send order confirmations and shipping updates\n• Provide customer and buyer support\n• Improve our platform and marketplace services\n• Send promotional emails about new products and offers (with your consent)"
        },
        {
          title: "Information Sharing",
          content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who help us operate our platform, such as payment processing companies, shipping services, and product authentication services, but only to the extent necessary to provide our services."
        },
        {
          title: "Data Security",
          content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
        },
        {
          title: "Cookies",
          content: "Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can disable cookies in your browser settings, but this may affect the functionality of our website."
        },
        {
          title: "Your Rights",
          content: "You have the right to access, update, or delete your personal information. You can also unsubscribe from promotional emails at any time. To exercise these rights, please contact us using the information provided below."
        },
        {
          title: "Contact Information",
          content: "If you have any questions about this Privacy Policy, please contact us:\n\ninfo@fishhunt.ge\n+995 551 999 055\nTbilisi, Georgia"
        },
        {
          title: "Changes to This Policy",
          content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date."
        }
      ]
    },
    ru: {
      title: "Политика конфиденциальности FishHunt.ge",
      effectiveDate: "Дата вступления в силу: 15 января 2025 г.",
      printButton: "📄 Печать/Скачать",
      sections: [
        {
          title: "Сбор информации",
          content: "Мы собираем информацию, которую вы нам предоставляете напрямую — когда создаете учетную запись, покупаете рыболовное, охотничье или туристическое снаряжение, загружаете свой опыт или работы, или связываетесь с нами. Это может включать ваше имя, адрес электронной почты, номер телефона, адрес доставки, платежную информацию и детали продуктов."
        },
        {
          title: "Как мы используем вашу информацию",
          content: "• Обработка и выполнение заказов на рыболовное, охотничье и туристическое снаряжение\n• Соединение клиентов и покупателей на нашей платформе\n• Отправка подтверждений заказов и обновлений доставки\n• Обеспечение поддержки клиентов и покупателей\n• Улучшение нашей платформы и сервисов маркетплейса\n• Отправка рекламных писем о новых продуктах и предложениях (с вашего согласия)"
        },
        {
          title: "Обмен информацией",
          content: "Мы не продаем, не обмениваем и не сдаем в аренду вашу личную информацию третьим лицам. Мы можем передавать вашу информацию доверенным поставщикам услуг, которые помогают нам управлять нашей платформой, таким как компании по обработке платежей, службы доставки и услуги аутентификации продуктов, но только в той мере, в какой это необходимо для предоставления наших услуг."
        },
        {
          title: "Безопасность данных",
          content: "Мы принимаем соответствующие меры безопасности для защиты вашей личной информации от несанкционированного доступа, изменения, раскрытия или уничтожения. Однако ни один метод передачи через Интернет не является на 100% безопасным."
        },
        {
          title: "Cookies",
          content: "Наш веб-сайт использует файлы cookie для улучшения вашего опыта просмотра, запоминания ваших предпочтений и анализа трафика веб-сайта. Вы можете отключить файлы cookie в настройках браузера, но это может повлиять на функциональность нашего веб-сайта."
        },
        {
          title: "Ваши права",
          content: "Вы имеете право просматривать, обновлять или удалять свою личную информацию. Вы также можете в любое время отказаться от получения рекламных писем. Чтобы воспользоваться этими правами, свяжитесь с нами, используя контактную информацию, указанную ниже."
        },
        {
          title: "Контактная информация",
          content: "Если у вас есть вопросы относительно этой Политики конфиденциальности, свяжитесь с нами:\n\ninfo@fishhunt.ge\n+995 551 999 055\nТбилиси, Грузия"
        },
        {
          title: "Изменения в этой политике",
          content: "Мы можем периодически обновлять эту Политику конфиденциальности. Мы уведомим вас о любых изменениях, разместив новую Политику конфиденциальности на этой странице и обновив дату вступления в силу."
        }
      ]
    }
  };

  const currentContent = content[language as keyof typeof content] || content.ge;

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-header">
        <div></div>
        <button onClick={handlePrint} className="print-download-btn">
          {currentContent.printButton}
        </button>
      </div>
      
      <div className="privacy-policy-content">
        <h1 className="privacy-policy-title">{currentContent.title}</h1>
        <p className="privacy-policy-updated">{currentContent.effectiveDate}</p>
        
        <div className="privacy-sections">
          {currentContent.sections.map((section, index) => (
            <section key={index} className="privacy-section">
              <h2>{section.title}</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
