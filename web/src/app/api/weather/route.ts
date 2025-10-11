import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const lang = searchParams.get('lang') || 'ka';
    const type = searchParams.get('type') || 'current';
    
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json({ 
        error: 'API key არ არის კონფიგურირებული' 
      }, { status: 500 });
    }

    if (!lat || !lon) {
      return NextResponse.json({ 
        error: 'lat და lon პარამეტრები აუცილებელია' 
      }, { status: 400 });
    }

    // Check cache
    const cacheKey = `${lat}-${lon}-${lang}-${type}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached weather data');
      return NextResponse.json(cached.data);
    }

    let apiUrl = '';
    
    if (type === 'current') {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${API_KEY}`;
    } else if (type === 'forecast') {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${API_KEY}`;
    } else {
      return NextResponse.json({ 
        error: 'არასწორი type პარამეტრი' 
      }, { status: 400 });
    }

    console.log('Fetching weather from OpenWeatherMap API...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(apiUrl, { 
      signal: controller.signal,
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    clearTimeout(timeout);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenWeatherMap API Error:', errorData);
      return NextResponse.json({ 
        error: 'ამინდის ინფორმაციის მიღება ვერ მოხერხდა',
        details: errorData 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Store in cache
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    // Clean old cache entries
    if (cache.size > 100) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) cache.delete(oldestKey);
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Weather API route error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ 
        error: 'Request timeout - API არ პასუხობს',
      }, { status: 504 });
    }
    
    return NextResponse.json({ 
      error: 'სერვერის შეცდომა',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
