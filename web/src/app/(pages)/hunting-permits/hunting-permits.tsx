'use client'
import { useState, useEffect } from "react";
import "./hunting-permits.css";
import { useLanguage } from "@/hooks/LanguageContext";

const questions = [
    {
      question: "დასაშვებია თუ არა სანადირო ცეცხლსასროლი იარაღის დაუშლელ მდგომარეობაში ტარება?",
      options: [
        "არა, სანადირო იარაღის დაუშლელ მდგომარეობაში ტარება აკრძალულია, გარდა ამისათვის სპეციალურად განსაზღვრული ადგილებისა (ტირი, სასროლეთი, სასროლო-სანადირო სტენდი, ნადირობისათვის სპეციალურად გამოყოფილი ადგილები)",
        "დიახ, დასაშვებია ნებისმიერ ადგილას"
      ],
      correctAnswer: 0
    },
    {
      question: "აქვს თუ არა უფლება სანადირო ცეცხლსასროლი იარაღის მესაკუთრეს საზღვარგარეთ გამგზავრებისას თავის საკუთრებაში არსებული იარაღი გადასცეს სხვა პირს?",
      options: [
        "დიახ, მხოლოდ ოჯახის წევრს",
        "დიახ, მხოლოდ იმ პირს, ვისაც აქვს იარაღის ტარების უფლება",
        "დიახ, ნებისმიერ ნდობით აღჭურვილ პირს",
        "არა, არ აქვს"
      ],
      correctAnswer: 3
    },
    {
      question: "რა შემთხვევაშია დასაშვები თქვენს საკუთრებაში არსებული სანადირო ცეცხლსასროლი იარაღი შეინახოთ ისეთ ადგილას, სადაც ის გარეშე პირთათვის ხელმისაწვდომი იქნება?",
      options: [
        "არცერთ შემთხვევაში",
        "მხოლოდ იმ შემთხვევაში, თუკი გამორიცხულია იარაღთან არასრულწლოვანთა დაშვების შესაძლებლობა",
        "მხოლოდ იმ შემთხვევაში, თუკი იარაღი ხელმისაწვდომია იმ პირისთვის, ვისაც აქვს იარაღის შენახვის ან/და ტარების უფლება"
      ],
      correctAnswer: 0
    },
    {
      question: "ცეცხლსასროლი იარაღის (გარდა გლუვლულიანი სანადირო თოფის), საბრძოლო მასალის მართლსაწინააღმდეგო შენახვა იწვევს თუ არა სისხლისსამართლებრივ პასუხისმგებლობას?",
      options: ["დიახ", "არა"],
      correctAnswer: 0
    },
    {
      question: "როდის არის იარაღი საბრძოლო მდგომარეობაში მოყვანილი, რათა მსროლელმა შეძლოს გასროლა?",
      options: [
        "მაშინ, როდესაც იარაღი განმუხტულია და დგას მცველზე",
        "მაშინ, როდესაც ვაზნა განთავსებულია ლულის სავაზნეში და იარაღი მოხსნილია მცველიდან"
      ],
      correctAnswer: 1
    },
    {
      question: "რომელი ვაზნების გასროლაა დასაშვები სანადირო ცეცხლსასროლი იარაღიდან?",
      options: [
        "ნებისმიერი ვაზნის, რაც ჩაეტევა მჭიდში ან ლულაში",
        "მხოლოდ შესაბამისი კალიბრის მქონე ვაზნის, რომლის მიხედვითაც აიგო იარაღი და რომელიც მითითებულია თავად იარაღზე",
        "არცერთი პასუხი არ არის სწორი"
      ],
      correctAnswer: 1
    },
    {
      question: "ცეცხლსასროლი იარაღის გაწმენდის წინ უსაფრთხოების მიზნით აუცილებელია თუ არა ლულის სავაზნე არხის შემოწმება მასში ვაზნების არსებობაზე?",
      options: [
        "აუცილებელია",
        "არ არის აუცილებელი",
        "დამოკიდებულია ცეცხლსასროლი იარაღის ტიპზე"
      ],
      correctAnswer: 0
    },
    {
      question: "უსაფრთხოა თუ არა იარაღის შენახვა ისეთ საცავში, სადაც საწვავი, ადვილადაალებადი და ქიმიური ნივთიერებები ინახება?",
      options: ["დიახ", "არა", "უსაფრთხოა მხოლოდ ისეთ შენობაში, სადაც ქიმიური ნივთიერებები ინახება"],
      correctAnswer: 1
    },
    {
      question: "სასხლეტზე თითის დადება მიზანშეწონილია:",
      options: [
        "ყოველთვის, როდესაც იარაღი ხელში გიჭირავთ",
        "მხოლოდ მას შემდეგ, როცა სროლას გადაწყვეტთ"
      ],
      correctAnswer: 1
    },
    {
      question: "დაშვებულია თუ არა ნადირობა სახელმწიფო ნაკრძალში?",
      options: [
        "დაშვებულია მხოლოდ კანონმდებლობით დადგენილ შემთხვევებში, შესაბამისი ნებართვის საფუძველზე",
        "დაშვებულია",
        "დაუშვებელია"
      ],
      correctAnswer: 2
    },
    {
      question: "სანადირო ცეცხლსასროლი იარაღი და შესაბამისი საბრძოლო მასალა უნდა ინახებოდეს:",
      options: [
        "მხოლოდ ისეთ მდგომარეობაში/პირობაში, სადაც უზრუნველყოფილი იქნება იარაღისა და საბრძოლო მასალის დაცვა და უსაფრთხოება",
        "მხოლოდ ისეთ პირობებში/მდგომარეობაში, სადაც გამოირიცხება გაუთვალისწინებელი (უნებლიე) გასროლის შესაძლებლობა",
        "მხოლოდ ისეთ პირობებში/მდგომარეობაში, სადაც არ მოხდება იარაღსა და საბრძოლო მასალასთან გარეშე პირთა დაშვება",
        "ჩამოთვლილთაგან ყველა პირობებში/მდგომარეობაში"
      ],
      correctAnswer: 3
    },
    {
      question: "უსაფრთხოების მიზნით მიზანშეწონილია თუ არა სანადირო ცეცხლსასროლი იარაღის დამუხტულ მდგომარეობაში დატოვება დანიშნულებით გამოყენების შემდგომ?",
      options: ["დიახ", "არა", "დიახ, თუკი იარაღს შევინახავთ საცავში"],
      correctAnswer: 1
    },
    {
      question: "ჩამოთვლილი დებულებებიდან რომელია მცდარი?",
      options: [
        "სანადირო ცეცხლსასროლი იარაღის მესაკუთრე ვალდებულია უზრუნველყოს იარაღისა და საბრძოლო მასალის დაცვა",
        "სანადირო ცეცხლსასროლი იარაღის ტარების უფლების მქონე იარაღის მესაკუთრე არ არის ვალდებული იარაღის ტარებისას იქონიოს იარაღის რეგისტრაციის მოწმობა",
        "სანადირო ცეცხლსასროლი იარაღის ან საბრძოლო მასალის გადაცემა სხვა პირთათვის აკრძალულია, გარდა კანონმდებლობით გათვალისწინებული შემთხვევებისა"
      ],
      correctAnswer: 1
    },
    {
      question: "ჩამოთვლილთაგან რომელია მართებული?",
      options: [
        "სანადირო ცეცხლსასროლი იარაღი უნდა ინახებოდეს დამუხტულ მდგომარეობაში, გამორიცხული უნდა იყოს იარაღთან არასრულწლოვანთა დაშვების შესაძლებლობა",
        "სანადირო ცეცხლსასროლი იარაღი უნდა ინახებოდეს ისეთ მდგომარეობაში/პირობებში, სადაც უზრუნველყოფილი იქნება მისი დაცვა და უსაფრთხოება, გამოირიცხება გაუთვალისწინებელი (უნებლიე) გასროლა და იარაღთან გარეშე პირთა დაშვების შესაძლებლობა",
        "სანადირო ცეცხლსასროლი იარაღი უნდა ინახებოდეს განმუხტულ მდგომარეობაში და ოჯახის წევრთათვის ხელმისაწვდომ ადგილას, სადაც შესაძლებელი იქნება საჭიროების შემთხვევაში ცეცხლსასროლი იარაღის დროული გამოყენება"
      ],
      correctAnswer: 1
    }
  ];
  
  const Exam = () => {
    const { t } = useLanguage();
    const [examStarted, setExamStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 წუთი წამებში
    const [examFinished, setExamFinished] = useState(false);
  
    useEffect(() => {
      if (!examStarted) return;
      if (timeLeft <= 0 || incorrectCount > 2) {
        setExamFinished(true);
      }
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }, [timeLeft, incorrectCount, examStarted]);
  
    const startExam = () => {
      setExamStarted(true);
      setTimeLeft(20 * 60);
      setCurrentQuestion(0);
      setSelectedAnswers(Array(questions.length).fill(null));
      setCorrectCount(0);
      setIncorrectCount(0);
      setExamFinished(false);
    };
  
    const handleAnswer = (index: number) => {
      if (selectedAnswers[currentQuestion] !== null) return;
      const isCorrect = index === questions[currentQuestion].correctAnswer;
      setSelectedAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestion] = index;
        return newAnswers;
      });
      if (isCorrect) setCorrectCount(correctCount + 1);
      else setIncorrectCount(incorrectCount + 1);
    };
  
    if (!examStarted) {
      return (
        <div className="exam-container start-screen">
          <h2>{t("huntingPermits.practiceExamTitle")}</h2>
          <p>{t("huntingPermits.practiceNote")}</p>
          <button onClick={startExam} className="start-button">{t("huntingPermits.startExam")}</button>
        </div>
      );
    }
  
    if (examFinished) {
      return (
        <div className="exam-container result">
          {incorrectCount > 2 ? (
            <>
              <h2>{t("huntingPermits.failed")}</h2>
              <button onClick={startExam} className="retry-button">{t("huntingPermits.tryAgain")}</button>
            </>
          ) : (
            <>
              <h2>{t("huntingPermits.passed")}</h2>
              {/* <a href="https://your-real-exam-link.com" target="_blank" rel="noopener noreferrer" className="real-exam-button">
                ნამდვილ გამოცდაზე გადასვლა
              </a> */}
            </>
          )}
        </div>
      );
    }
  
    return (
      <div className="exam-container">
        <div className="timer">
          {t("huntingPermits.timeLabel")} {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
        </div>
        <h3>{questions[currentQuestion].question}</h3>
        <div className="options">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={`option ${
                selectedAnswers[currentQuestion] !== null
                  ? index === questions[currentQuestion].correctAnswer
                    ? "correct"
                    : index === selectedAnswers[currentQuestion]
                    ? "incorrect"
                    : ""
                  : ""
              }`}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswers[currentQuestion] !== null}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="navigation">
          <button onClick={() => setCurrentQuestion(currentQuestion - 1)} disabled={currentQuestion === 0}>
            {t("huntingPermits.back")}
          </button>
          <button onClick={() => setCurrentQuestion(currentQuestion + 1)} disabled={currentQuestion === questions.length - 1}>
            {t("huntingPermits.next")}
          </button>
        </div>
      </div>
    );
  };
  
  export default Exam;