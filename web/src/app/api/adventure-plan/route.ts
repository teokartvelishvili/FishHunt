import { NextRequest, NextResponse } from 'next/server';
import { generateAdventurePlan, generateFollowUpAnswer } from '@/lib/gemini-ai';
import { getCurrentWeather, getWeatherForecast, getBestDaysForActivity, formatWeatherForGeorgian } from '@/lib/weather-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adventureType, location, timeFrame, userPreferences } = body;

    // ვალიდაცია
    if (!adventureType || !timeFrame) {
      return NextResponse.json(
        { error: 'თავგადასავლის ტიპი და დრო სავალდებულოა' },
        { status: 400 }
      );
    }

    // შევამოწმოთ თუ ეს არის follow-up კითხვა
    const isFollowUp = userPreferences && userPreferences.includes('დამატებითი კითხვა:');
    
    let plan;
    if (isFollowUp) {
      // Follow-up კითხვისთვის სპეციალური მოპყრობა
      const followUpQuestion = userPreferences.replace('დამატებითი კითხვა:', '').split('.')[0].trim();
      
      // თუ ამინდის შესახებ კითხავს, ამინდის ინფორმაცია მოვიღოთ
      let weatherInfo = '';
      if (followUpQuestion.includes('ამინდ') || followUpQuestion.includes('ღამე') || followUpQuestion.includes('ხვალ') || followUpQuestion.includes('ზეგ')) {
        try {
          const currentWeather = await getCurrentWeather(location || 'საქართველო');
          if (currentWeather) {
            weatherInfo = formatWeatherForGeorgian(currentWeather);
            
            // 5-დღიანი პროგნოზი
            const forecast = await getWeatherForecast(location || 'საქართველო');
            if (forecast.length > 0) {
              weatherInfo += `. პროგნოზი: `;
              forecast.slice(0, 3).forEach((day) => {
                const date = new Date(day.date);
                const georgianDate = new Intl.DateTimeFormat('ka-GE', { 
                  month: 'short', 
                  day: 'numeric',
                  timeZone: 'Asia/Tbilisi'
                }).format(date);
                weatherInfo += `${georgianDate}: ${day.temperature}°C, ${day.description}; `;
              });
            }
          }
        } catch (error) {
          console.error('Weather fetch error for follow-up:', error);
        }
      }
      
      plan = await generateFollowUpAnswer(
        adventureType,
        location || 'საქართველო',
        followUpQuestion,
        weatherInfo
      );
    } else {
      // ჩვეულებრივი თავგადასავლის გეგმა
      // ჯერ ამინდის ინფორმაცია მოვიღოთ
      let weatherInfo = '';
      try {
        const currentWeather = await getCurrentWeather(location || 'საქართველო');
        if (currentWeather) {
          weatherInfo = formatWeatherForGeorgian(currentWeather);
          
          // თუ "უახლოეს მომავალში" აარჩევა, დავამატოთ რეკომენდაცია საუკეთესო დღეებისთვის
          if (timeFrame === 'უახლოეს მომავალში') {
            const forecast = await getWeatherForecast(location || 'საქართველო');
            const bestDays = getBestDaysForActivity(forecast);
            if (bestDays.length > 0) {
              weatherInfo += `. საუკეთესო დღეები თავგადასავლისთვის: ${bestDays.slice(0, 3).join(', ')}`;
            }
          }
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
        // თუ ამინდის ინფორმაცია ვერ მოვიღეთ, გავაგრძელოთ ამინდის გარეშე
      }
      
      plan = await generateAdventurePlan(
        adventureType,
        location || 'საქართველო',
        timeFrame,
        userPreferences,
        weatherInfo
      );
    }

    return NextResponse.json({
      success: true,
      plan: plan,
      adventureType,
      location,
      timeFrame
    });

  } catch (error) {
    console.error('Adventure Plan Generation Error:', error);
    
    return NextResponse.json(
      { 
        error: 'თავგადასავლის გეგმის შედგენისას მოხდა შეცდომა',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET მეთოდი სტატუსის შესამოწმებლად
export async function GET() {
  return NextResponse.json({
    status: 'Adventure AI API is running',
    timestamp: new Date().toISOString()
  });
}
