import { NextRequest, NextResponse } from 'next/server';
import { getCurrentWeather, getWeatherForecast, getBestDaysForActivity } from '@/lib/weather-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location') || 'საქართველო';
    const type = searchParams.get('type') || 'current'; // current, forecast, best-days
    
    if (type === 'current') {
      const weather = await getCurrentWeather(location);
      
      if (weather) {
        return NextResponse.json({ success: true, weather });
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'ამინდის ინფორმაციის მიღება ვერ მოხერხდა' 
        });
      }
    }
    
    if (type === 'forecast') {
      const forecast = await getWeatherForecast(location);
      
      return NextResponse.json({ success: true, forecast });
    }
    
    if (type === 'best-days') {
      const forecast = await getWeatherForecast(location);
      const bestDays = getBestDaysForActivity(forecast);
      
      return NextResponse.json({ success: true, bestDays });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'არასწორი request type' 
    });
    
  } catch (error) {
    console.error('Weather API route error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'სერვერის შეცდომა' 
    });
  }
}
