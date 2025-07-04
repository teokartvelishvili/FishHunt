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

// მოკლე და მეგობრული თავგადასავლების დაგეგმვის ფუნქცია
export async function generateAdventurePlan(
  adventureType: string,
  location: string,
  timeFrame: string,
  userPreferences?: string,
  weatherInfo?: string
): Promise<string> {
  
  const prompt = `
    შენ ხარ FishHunt-ის AI ასისტენტი, ექსპერტი და მეგობრული კონსულტანტი.
    
    მომხმარებლის მონაცემები:
    - აქტივობა: ${adventureType}
    - ლოკაცია: ${location}
    - დრო: ${timeFrame}
    ${userPreferences ? `- დამატებითი ინფო: ${userPreferences}` : ''}
    ${weatherInfo ? `- ამინდის ინფორმაცია: ${weatherInfo}` : ''}
    
    მიეცი დეტალური, ექსპერტული და მეგობრული პასუხი. ყოველი პუნქტი ახალ ხაზზე:
    
    👋 გამარჯობა! FishHunt-იდან გიწვევთ ${adventureType}ში!
    
    🌤️ ${weatherInfo ? `${weatherInfo}` : `ამინდის ინფორმაცია ${location}-ში + რეკომენდაცია მომავალი კვირისთვის`}
    
    📍 კონკრეტული ადგილები ${adventureType}-ისთვის ${location}-ის მახლობლად:
    - ზუსტი ლოკაციები სახელებით
    - რატომ არის კარგი ეს ადგილები
    - რა შეგიძლია იპოვო იქ
    
    🎣 საჭირო აღჭურვილობა FishHunt-დან:
    - კონკრეტული ჯოხები და მოდელები
    - ძაბრები და ტარი
    - სატყუარები და ჰუკები
    - ყველაფერი რაც საჭიროა
    
    🚗 მანქანის ქირაობა:
    FishHunt-ისგან შეგიძლია დაიქირაო სანადირო/სათევზაო ავტომობილი მთლიანი აღჭურვილობით! 4x4 ჯიპები, სპეციალური ავტომობილები აღჭურვილი მაცივრებითა და ინვენტარის შესანახი ადგილებით.
    
    ყველაფერი ხელმისაწვდომია ჩვენს საიტზე! გაერთეთ! 😊
    
    ᲛᲜᲘᲨᲕᲜᲔᲚᲝᲕᲐᲜᲘᲐ:
    - ყოველი სექცია ახალ ხაზზე
    - არ გამოიყენო ## ან markdown ფორმატირება
    - მხოლოდ emoji-ები და ძირითადი ტექსტი
    - მაქსიმუმ 250 სიტყვა, მეგობრული ტონით
    - ყოველთვის რეკლამირებდი FishHunt-ის პროდუქტებს
    - თუ მოცემულია რეალური ამინდის ინფორმაცია, მხოლოდ მას იყენებდი
  `;

  return await generateResponse(prompt);
}

// კასტომ პრომპტის ფუნქცია
export async function generateCustomAdventurePlan(
  adventureType: string,
  location: string,
  timeFrame: string,
  customPrompt?: string
): Promise<string> {
  
  const prompt = customPrompt || `
    შენ ხარ FishHunt-ის მეგობრული AI ასისტენტი.
    
    მომხმარებლის მონაცემები:
    - აქტივობა: ${adventureType}
    - ლოკაცია: ${location}
    - დრო: ${timeFrame}
    
    მიესალმე და მოკლედ, პრაქტიკულად უპასუხე თუ სად, როდის და რითი წავიდეს ${adventureType}-ზე.
    ყველაფერი რაც ურჩევ უნდა იყოს ხელმისაწვდომი FishHunt ვებგვერდზე.
    
    მაქსიმუმ 150 სიტყვა, მეგობრული ტონით!
  `;

  return await generateResponse(prompt);
}

// ახალი ფუნქცია: მხოლოდ კასტომ პრომპტით მუშაობა
export async function generateWithCustomPrompt(customPrompt: string): Promise<string> {
  return await generateResponse(customPrompt);
}

// სპეციალური ფუნქცია follow-up კითხვებისთვის - ყოველთვის FishHunt-ის რეკლამით
export async function generateFollowUpAnswer(
  originalAdventure: string,
  location: string,
  followUpQuestion: string,
  weatherInfo?: string
): Promise<string> {
  
  const prompt = `
    შენ ხარ FishHunt-ის AI ექსპერტი და მეგობრული კონსულტანტი. მომხმარებელმა შეგიძლია დაისვას შემდეგი კითხვა:
    
    მომხმარებლის კითხვა: "${followUpQuestion}"
    კონტექსტი: ${originalAdventure} ${location}-ში
    ${weatherInfo ? `ამინდის ინფორმაცია: ${weatherInfo}` : ''}
    
    შენი პასუხი უნდა იყოს მეგობრული, ენთუზიაზმით სავსე:
    
    � [მეგობრული რეაქცია - "მაგარი კითხვაა!", "კარგს მეკითხები!", "ოჰ, ეს საინტერესოა!", "შესანიშნავი იდეაა!", "ღირებული კითხვაა!"]
    
    🤔 დეტალური პასუხი თქვენს კითხვაზე:
    - კონკრეტული რჩევები და ინფორმაცია
    - ზუსტი ლოკაციები და დეტალები
    - თუ ამინდის შესახებაა, გამოიყენე მოცემული რეალური ამინდი
    - პრაქტიკული რჩევები
    
    🎯 FishHunt-ის რეკომენდაციები:
    - კონკრეტული პროდუქტები
    - მოდელები და ფასები
    - სპეციალური შეთავაზებები
    
    🚗 მანქანის ქირაობა: 
    FishHunt-ისგან შეგიძლია დაიქირაო სანადირო/სათევზაო ავტომობილი მთლიანი აღჭურვილობით!
    
    ყველაფერი ხელმისაწვდომია ჩვენს FishHunt ვებგვერდზე! 😊
    
    ᲛᲜᲘᲨᲕᲜᲔᲚᲝᲕᲐᲜᲘᲐ:
    - ყოველი სექცია ახალ ხაზზე
    - არ გამოიყენო ## markdown ფორმატირება ან "გამარჯობა/გამარჯობათ"
    - მხოლოდ emoji-ები და ძირითადი ტექსტი
    - იყავი მეგობრული და ენთუზიაზმით სავსე
    - ყოველთვის რეკლამირებდი FishHunt-ის სერვისებს
    - თუ ამინდის შესახებ კითხავენ, გამოიყენე მოცემული რეალური ამინდი
    - მაქსიმუმ 200 სიტყვა
  `;

  return await generateResponse(prompt);
}
