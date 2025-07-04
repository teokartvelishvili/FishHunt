// Weather API integration using OpenWeatherMap
// OpenWeatherMap API: https://openweathermap.org/api

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherForecast {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

// Georgian cities coordinates for better accuracy
const georgianCities: { [key: string]: { lat: number; lon: number } } = {
  'თბილისი': { lat: 41.7151, lon: 44.8271 },
  'ბათუმი': { lat: 41.6168, lon: 41.6367 },
  'ქუთაისი': { lat: 42.2488, lon: 42.7070 },
  'რუსთავი': { lat: 41.5492, lon: 44.9933 },
  'გორი': { lat: 41.9847, lon: 44.1086 },
  'ზუგდიდი': { lat: 42.5088, lon: 41.8709 },
  'ფოთი': { lat: 42.1507, lon: 41.6716 },
  'ზესტაფონი': { lat: 42.1133, lon: 43.0331 },
  'ოზურგეთი': { lat: 41.9233, lon: 42.0058 },
  'ხაშური': { lat: 41.9956, lon: 43.6006 },
  'საქართველო': { lat: 42.3154, lon: 43.3569 } // საქართველოს ცენტრი
};

// Get coordinates for Georgian location
function getGeorgianCoordinates(location: string): { lat: number; lon: number } {
  // Clean location string and try to match
  const cleanLocation = location.toLowerCase().trim();
  
  // Check if it's a known Georgian city
  for (const [city, coords] of Object.entries(georgianCities)) {
    if (cleanLocation.includes(city.toLowerCase()) || city.toLowerCase().includes(cleanLocation)) {
      return coords;
    }
  }
  
  // Default to Tbilisi if not found
  return georgianCities['თბილისი'];
}

// Mock weather data for development
function getMockWeatherData(location: string): WeatherData {
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour < 20;
  
  return {
    location: location === 'საქართველო' ? 'თბილისი' : location,
    temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
    description: isDay ? 'ღია ცა' : 'ღრუბლიანი',
    humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
    windSpeed: Math.floor(Math.random() * 5) + 2, // 2-7 m/s
    icon: isDay ? '01d' : '01n'
  };
}

// Mock weather forecast for development
function getMockWeatherForecast(): WeatherForecast[] {
  const forecasts: WeatherForecast[] = [];
  
  // საქართველოს დროის ზონა (UTC+4)
  const georgiaTime = new Date(new Date().getTime() + (4 * 60 * 60 * 1000));
  
  const weatherConditions = [
    { description: 'ღია ცა', icon: '01d' },
    { description: 'ღრუბლიანი', icon: '02d' },
    { description: 'წვიმიანი', icon: '10d' },
    { description: 'ღია ცა', icon: '01d' },
    { description: 'ნაწილობრივ ღრუბლიანი', icon: '02d' }
  ];
  
  // მხოლოდ დღევანი და მომავალი დღეები
  for (let i = 0; i < 5; i++) {
    const date = new Date(georgiaTime);
    date.setDate(georgiaTime.getDate() + i);
    
    forecasts.push({
      date: date.toISOString().split('T')[0],
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      description: weatherConditions[i].description,
      icon: weatherConditions[i].icon
    });
  }
  
  return forecasts;
}

// Get current weather
export async function getCurrentWeather(location: string = 'საქართველო'): Promise<WeatherData | null> {
  try {
    const coords = getGeorgianCoordinates(location);
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // Mock weather data for development if API key is not available
    if (!apiKey || apiKey === 'your_openweather_api_key_here' || apiKey === 'b6e7c7c5e9d8f8a8b8c8d8e8f8a8b8c8') {
      console.log('Using mock weather data for development');
      return getMockWeatherData(location);
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric&lang=ka`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      return {
        location: data.name || location,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon
      };
    } else {
      console.error('Weather API error:', data.message);
      // Fallback to mock data
      return getMockWeatherData(location);
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    // Fallback to mock data
    return getMockWeatherData(location);
  }
}

// Get 5-day weather forecast
export async function getWeatherForecast(location: string = 'საქართველო'): Promise<WeatherForecast[]> {
  try {
    const coords = getGeorgianCoordinates(location);
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // Mock weather data for development if API key is not available
    if (!apiKey || apiKey === 'your_openweather_api_key_here' || apiKey === 'b6e7c7c5e9d8f8a8b8c8d8e8f8a8b8c8') {
      console.log('Using mock weather forecast for development');
      return getMockWeatherForecast();
    }
    
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric&lang=ka`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      // საქართველოს დროის ზონა (UTC+4)
      const georgiaTime = new Date(new Date().getTime() + (4 * 60 * 60 * 1000));
      const todayDate = georgiaTime.toISOString().split('T')[0];
      
      // Get one forecast per day (take noon forecast)
      const dailyForecasts: WeatherForecast[] = [];
      const processedDates = new Set<string>();
      
      for (const item of data.list) {
        const forecastDate = new Date(item.dt * 1000);
        const dateStr = forecastDate.toISOString().split('T')[0];
        
        // მხოლოდ დღევანი და მომავალი დღეები
        if (dateStr >= todayDate) {
          // Take the forecast closest to noon for each day
          if (!processedDates.has(dateStr) && forecastDate.getHours() >= 12) {
            dailyForecasts.push({
              date: dateStr,
              temperature: Math.round(item.main.temp),
              description: item.weather[0].description,
              icon: item.weather[0].icon
            });
            processedDates.add(dateStr);
          }
        }
        
        // Stop after 5 days
        if (dailyForecasts.length >= 5) break;
      }
      
      return dailyForecasts;
    } else {
      console.error('Weather forecast API error:', data.message);
      return getMockWeatherForecast();
    }
  } catch (error) {
    console.error('Weather forecast fetch error:', error);
    return getMockWeatherForecast();
  }
}

// Get weather condition emoji
export function getWeatherEmoji(icon: string): string {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  
  return iconMap[icon] || '🌤️';
}

// Get best days for outdoor activities
export function getBestDaysForActivity(forecasts: WeatherForecast[]): string[] {
  const goodDays: string[] = [];
  
  forecasts.forEach(forecast => {
    const temp = forecast.temperature;
    const desc = forecast.description.toLowerCase();
    
    // Check if weather is good for the activity
    const isGoodWeather = 
      !desc.includes('წვიმა') && 
      !desc.includes('ბურუსი') && 
      !desc.includes('ღრუბელი') &&
      temp >= 10 && temp <= 30;
    
    if (isGoodWeather) {
      const date = new Date(forecast.date);
      // საქართველოს დროის ზონაში თარიღის ფორმატირება
      const georgianDate = new Intl.DateTimeFormat('ka-GE', { 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Tbilisi'
      }).format(date);
      goodDays.push(georgianDate);
    }
  });
  
  return goodDays;
}

// Format weather info for Georgian text
export function formatWeatherForGeorgian(weather: WeatherData): string {
  const emoji = getWeatherEmoji(weather.icon);
  return `${emoji} ${weather.location}-ში ${weather.temperature}°C, ${weather.description}`;
}
