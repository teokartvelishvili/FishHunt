import { GoogleGenerativeAI } from '@google/generative-ai';

// Google Gemini AI კონფიგურაცია
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Gemini Pro მოდელის ინიციალიზაცია (განახლებული მოდელის სახელი)
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// AI-ის ძირითადი ფუნქცია
export async function generateResponse(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Response Error:', error);
    throw new Error('AI-სთან დაკავშირება ვერ მოხერხდა');
  }
}

// თავგადასავლების დაგეგმვის სპეციალური ფუნქცია
export async function generateAdventurePlan(
  adventureType: string,
  location: string,
  timeFrame: string,
  userPreferences?: string
): Promise<string> {
  
  const prompt = `
    შენ ხარ FishHunt-ის AI ასისტენტი, მეგობრული და დამხმარე. 
    
    მომხმარებლის მონაცემები:
    - აქტივობა: ${adventureType}
    - ლოკაცია: ${location}
    - დრო: ${timeFrame}
    ${userPreferences ? `- დამატებითი ინფო: ${userPreferences}` : ''}
    
    შექმენი ᲡᲣᲞᲔᲠ დეტალური, პროფესიონალური და პრაქტიკული გეგმა ქართულ ენაზე. 
    
    🎯 ᲐᲣᲪᲘᲚᲔᲑᲚᲐᲓ ჩართე ყველა სექცია:
    
    📝 **1. თავგადასავლის შესავალი**
    - რატომ არის ეს თავგადასავალი განსაკუთრებული
    - რა ელოდება მომხმარებელს
    
    🗺️ **2. საუკეთესო ადგილები საქართველოში**
    - კონკრეტული ლოკაციები GPS კოორდინატებით
    - როგორ მივიდე იქ
    - რატომ არის ეს ადგილი შესანიშნავი ამ თავგადასავლისთვის
    
    🎒 **3. საჭირო ღე უღებაცია და ინვენტარი**
    - სავალდებულო ნივთები (კონკრეტული ბრენდები/მოდელები)
    - რეკომენდებული ექვიპმენტი
    - ბიუჯეტი ყველა ნივთისთვის
    
    📅 **4. მოქცეული დროის გრაფიკი**
    - სრული დღის/საღამოს განრიგი
    - ყველა აქტივობა საათობრივი ბაზით
    
    🌡️ **5. ამინდის და სეზონის გათვალისწინება**
    - საუკეთესო პერიოდი
    - ამინდისთვის მზადება
    
    � **6. ბიუჯეტი და ხარჯები**
    - მთლიანი ხარჯების შეფასება
    - ყველაზე ეკონომიური ვარიანტები
    
    👥 **7. ისერვაქტიონ და ადგილობრივი კავშირები**
    - ვისთან დაკავშირება
    - ადგილობრივი სერვისები
    
    ⚠️ **8. უსაფრთხოების სრული გიდი**
    - რისკების შეფასება
    - პრევენციული ზომები
    - ჩანაწერთათვის ნომრები
    
    �️ **9. კვება და წყალი**
    - რა წაიღო საკვები
    - სადაც შეგიძლია შეიძინო/გაავარდეშ
    
    📱 **10. ტექნოლოგია და კომუნიკაცია**
    - რომელი აპები გადმოწერო
    - კავშირი და GPS
    
    🌟 **11. პრო-ტიპები და ღია საიდუმლოები**
    - რასაც მარტო ექსპერტები იციან
    - როგორ გაყო შეუფერხებელი გამოცდილება
    
    ⭐ **12. ბონუს რეკომენდაციები**
    - მახლობლეგან სხვა საინტერესო ადგილები
    - კომბინირებული თავგადასავლები
    
    გამოიყენე ბევრი emoji და გახადე ტექსტი ვიზუალურად მიმზიდველი. ყოველი რჩევა უნდა იყოს კონკრეტული და გამოცდილებაზე დაფუძნებული. წერე ისე, რომ რეალურად დაეხმარო ადამიანს შესანიშნავი გამოცდილების მიღებაში.
  `;

  return await generateResponse(prompt);
}

// კასტომ პრომპტის ფუნქცია - აქ შეგიძლიათ თქვენი სურვილების მიხედვით მითითოთ რა უნდა
export async function generateCustomAdventurePlan(
  adventureType: string,
  location: string,
  timeFrame: string,
  customPrompt?: string
): Promise<string> {
  
  // თუ კასტომ პრომპტი არ არის მიცემული, გამოიყენება ძირითადი
  const prompt = customPrompt || `
    შენ ხარ ექსპერტი ${adventureType} გიდი საქართველოში.
    
    მომხმარებლის მონაცემები:
    - თავგადასავლის ტიპი: ${adventureType}
    - ლოკაცია: ${location}
    - დრო: ${timeFrame}
    
    🎯 შენი მისია: შექმენი ულტრა-დეტალური და პრაქტიკული გეგმა ქართულ ენაზე.
    
    ᲐᲣᲪᲘᲚᲔᲑᲚᲐᲓ ჩაწერე:
    ✅ კონკრეტული ადგილები (GPS კოორდინატებით)
    ✅ ბიუჯეტი (ლარებში)
    ✅ საუკეთესო დრო/სეზონი
    ✅ მთლიანი ღირებულება
    ✅ უსაფრთხოების რჩევები
    ✅ ლოკალური კონტაქტები
    ✅ რეალური ფოტო/ვიდეო რეკომენდაციები
    
    მაქსიმალურად გახადე ინფორმაციული და გამოცდილებაზე დაფუძნებული!
  `;

  return await generateResponse(prompt);
}

// ახალი ფუნქცია: მხოლოდ კასტომ პრომპტით მუშაობა
export async function generateWithCustomPrompt(customPrompt: string): Promise<string> {
  return await generateResponse(customPrompt);
}
