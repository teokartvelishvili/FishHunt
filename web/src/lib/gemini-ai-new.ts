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
  userPreferences?: string
): Promise<string> {
  
  const prompt = `
    შენ ხარ FishHunt-ის AI ასისტენტი, მეგობრული და დამხმარე.
    
    მომხმარებლის მონაცემები:
    - აქტივობა: ${adventureType}
    - ლოკაცია: ${location}
    - დრო: ${timeFrame}
    ${userPreferences ? `- დამატებითი ინფო: ${userPreferences}` : ''}
    
    მიესალმე FishHunt-ის სახელით და მოკლედ, მეგობრულად უპასუხე. არ გამოიყენო ## ან სხვა markdown ფორმატირება, მხოლოდ emoji-ები.
    
    შენი პასუხი უნდა შეიცავდეს:
    
    1. 👋 მეგობრული მისალმება FishHunt-ის სახელით
    
    2. 🌤️ ამინდის შემოწმება - უთხარი დღევანდელი ამინდი ამ აქტივობისთვის ${location}-ში. თუ ცუდია, შესთავაზე საუკეთესო დღეები მომავალ კვირაში.
    
    3. 📍 ლოკაცია - ურჩიე ყველაზე ახლო და საუკეთესო ადგილი ${adventureType}-ისთვის ${location}-ის მახლობლად.
    
    4. 🎒 ინვენტარი - ურჩიე საჭირო აღჭურვილობა მხოლოდ იმისი, რაც FishHunt ვებგვერდზე იყიდება. ბოლოში თქვი "ყველაფერი ხელმისაწვდომია ჩვენს საიტზე".
    
    5. 🚗 ტრანსპორტი - თუ საჭიროა, შესთავაზე მანქანის ქირაობა, რომელიც ასევე ჩვენს საიტზე არის ხელმისაწვდომი.
    
    მთელი პასუხი უნდა იყოს მაქსიმუმ 150-200 სიტყვა, მეგობრული ტონით, გარკვევითი და პრაქტიკული. არ იყენებო სათაურებს ან რთული ფორმატირება.
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
