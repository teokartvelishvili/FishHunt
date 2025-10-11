"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/LanguageContext";
import "./WeatherWidget.css";
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiShowers,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from "react-icons/wi";

const getWeatherIcon = (iconCode: string): React.ComponentType<{ size?: string | number; className?: string }> => {
  const iconMap: { [key: string]: React.ComponentType<{ size?: string | number; className?: string }> } = {
    // Clear sky
    "01d": WiDaySunny,
    "01n": WiNightClear,
    // Few clouds
    "02d": WiDayCloudy,
    "02n": WiNightAltCloudy,
    // Scattered clouds
    "03d": WiCloud,
    "03n": WiCloud,
    // Broken clouds
    "04d": WiCloudy,
    "04n": WiCloudy,
    // Shower rain
    "09d": WiShowers,
    "09n": WiShowers,
    // Rain
    "10d": WiRain,
    "10n": WiRain,
    // Thunderstorm
    "11d": WiThunderstorm,
    "11n": WiThunderstorm,
    // Snow
    "13d": WiSnow,
    "13n": WiSnow,
    // Mist/Fog
    "50d": WiFog,
    "50n": WiFog,
  };

  return iconMap[iconCode] || WiDaySunny;
};

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  city: string;
  sunrise: number;
  sunset: number;
}

interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}

interface DailyForecast {
  date: string;
  temps: number[];
  descriptions: string[];
  icons: string[];
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

const CITIES = [
  { name: "Tbilisi", nameGe: "თბილისი", nameRu: "Тбилиси", lat: 41.7151, lon: 44.8271 },
  { name: "Abasha", nameGe: "აბაშა", nameRu: "Абаша", lat: 42.2014, lon: 42.2064 },
  { name: "Adigeni", nameGe: "ადიგენი", nameRu: "Адигени", lat: 41.6833, lon: 42.7000 },
  { name: "Akhalkalaki", nameGe: "ახალქალაქი", nameRu: "Ахалкалаки", lat: 41.4028, lon: 43.4833 },
  { name: "Akhaltsikhe", nameGe: "ახალციხე", nameRu: "Ахалцихе", lat: 41.6391, lon: 42.9821 },
  { name: "Akhmeta", nameGe: "ახმეტა", nameRu: "Ахмета", lat: 42.0364, lon: 45.2092 },
  { name: "Ambrolauri", nameGe: "ამბროლაური", nameRu: "Амбролаури", lat: 42.5181, lon: 43.1478 },
  { name: "Aspindza", nameGe: "ასპინძა", nameRu: "Аспиндза", lat: 41.5683, lon: 43.2458 },
  { name: "Baghdati", nameGe: "ბაღდათი", nameRu: "Багдати", lat: 42.0764, lon: 42.8194 },
  { name: "Bakuriani", nameGe: "ბაკურიანი", nameRu: "Бакуриани", lat: 41.7489, lon: 43.5322 },
  { name: "Batumi", nameGe: "ბათუმი", nameRu: "Батуми", lat: 41.6168, lon: 41.6367 },
  { name: "Bolnisi", nameGe: "ბოლნისი", nameRu: "Болниси", lat: 41.4500, lon: 44.5453 },
  { name: "Borjomi", nameGe: "ბორჯომი", nameRu: "Боржоми", lat: 41.8419, lon: 43.3859 },
  { name: "Chiatura", nameGe: "ჭიათურა", nameRu: "Чиатура", lat: 42.2978, lon: 43.2947 },
  { name: "Chkhorotsku", nameGe: "ჩხოროწყუ", nameRu: "Чхороцку", lat: 42.5333, lon: 42.0667 },
  { name: "Chokhatauri", nameGe: "ჩოხატაური", nameRu: "Чохатаури", lat: 42.0303, lon: 42.3178 },
  { name: "Dmanisi", nameGe: "დმანისი", nameRu: "Дманиси", lat: 41.3392, lon: 44.3306 },
  { name: "Dusheti", nameGe: "დუშეთი", nameRu: "Душети", lat: 42.0853, lon: 44.7028 },
  { name: "Gardabani", nameGe: "გარდაბანი", nameRu: "Гардабани", lat: 41.4611, lon: 45.0906 },
  { name: "Gori", nameGe: "გორი", nameRu: "Гори", lat: 41.9842, lon: 44.1089 },
  { name: "Gudauri", nameGe: "გუდაური", nameRu: "Гудаури", lat: 42.4783, lon: 44.4714 },
  { name: "Gurjaani", nameGe: "გურჯაანი", nameRu: "Гурджаани", lat: 41.7447, lon: 45.7961 },
  { name: "Kasp", nameGe: "კასპი", nameRu: "Каспи", lat: 41.9167, lon: 44.4167 },
  { name: "Keda", nameGe: "ქედა", nameRu: "Кеда", lat: 41.6000, lon: 42.1167 },
  { name: "Kharagauli", nameGe: "ხარაგაული", nameRu: "Харагаули", lat: 42.0144, lon: 43.2183 },
  { name: "Khashuri", nameGe: "ხაშური", nameRu: "Хашури", lat: 41.9931, lon: 43.5978 },
  { name: "Khelvachauri", nameGe: "ხელვაჩაური", nameRu: "Хелвачаури", lat: 41.5833, lon: 41.6500 },
  { name: "Khobi", nameGe: "ხობი", nameRu: "Хоби", lat: 42.3181, lon: 41.9081 },
  { name: "Khoni", nameGe: "ხონი", nameRu: "Хони", lat: 42.3219, lon: 42.4492 },
  { name: "Khulo", nameGe: "ხულო", nameRu: "Хуло", lat: 41.6500, lon: 42.2833 },
  { name: "Kobuleti", nameGe: "ქობულეთი", nameRu: "Кобулети", lat: 41.8191, lon: 41.7766 },
  { name: "Kutaisi", nameGe: "ქუთაისი", nameRu: "Кутаиси", lat: 42.2679, lon: 42.6993 },
  { name: "Kvareli", nameGe: "ყვარელი", nameRu: "Кварели", lat: 41.9489, lon: 45.8167 },
  { name: "Lagodekhi", nameGe: "ლაგოდეხი", nameRu: "Лагодехи", lat: 41.8267, lon: 46.2814 },
  { name: "Lanchkhuti", nameGe: "ლანჩხუთი", nameRu: "Ланчхути", lat: 42.0794, lon: 42.0656 },
  { name: "Lentekhi", nameGe: "ლენტეხი", nameRu: "Лентехи", lat: 42.7858, lon: 42.7072 },
  { name: "Marneuli", nameGe: "მარნეული", nameRu: "Марнеули", lat: 41.4769, lon: 44.8086 },
  { name: "Martvili", nameGe: "მარტვილი", nameRu: "Мартвили", lat: 42.4133, lon: 42.3844 },
  { name: "Mestia", nameGe: "მესტია", nameRu: "Местия", lat: 43.0442, lon: 42.7281 },
  { name: "Mtskheta", nameGe: "მცხეთა", nameRu: "Мцхета", lat: 41.8458, lon: 44.7207 },
  { name: "Ninotsminda", nameGe: "ნინოწმინდა", nameRu: "Ниноцминда", lat: 41.2678, lon: 43.5989 },
  { name: "Oni", nameGe: "ონი", nameRu: "Они", lat: 42.5794, lon: 43.4408 },
  { name: "Ozurgeti", nameGe: "ოზურგეთი", nameRu: "Озургети", lat: 41.9225, lon: 42.0059 },
  { name: "Poti", nameGe: "ფოთი", nameRu: "Поти", lat: 42.1477, lon: 41.6716 },
  { name: "Rustavi", nameGe: "რუსთავი", nameRu: "Рустави", lat: 41.5495, lon: 44.9914 },
  { name: "Sachkhere", nameGe: "საჩხერე", nameRu: "Сачхере", lat: 42.3414, lon: 43.4078 },
  { name: "Sagarejo", nameGe: "საგარეჯო", nameRu: "Сагареджо", lat: 41.7450, lon: 45.3292 },
  { name: "Samtredia", nameGe: "სამტრედია", nameRu: "Самтредиа", lat: 42.1508, lon: 42.3364 },
  { name: "Senaki", nameGe: "სენაკი", nameRu: "Сенаки", lat: 42.2697, lon: 42.0650 },
  { name: "Shuakhevi", nameGe: "შუახევი", nameRu: "Шуахеви", lat: 41.6861, lon: 42.2228 },
  { name: "Signagi", nameGe: "სიღნაღი", nameRu: "Сигнахи", lat: 41.6217, lon: 45.9217 },
  { name: "Stepantsminda", nameGe: "სტეფანწმინდა", nameRu: "Степанцминда", lat: 42.6597, lon: 44.6431 },
  { name: "Terjola", nameGe: "თერჯოლა", nameRu: "Терджола", lat: 42.1667, lon: 42.9833 },
  { name: "Telavi", nameGe: "თელავი", nameRu: "Телави", lat: 41.9192, lon: 45.4733 },
  { name: "Tetritskaro", nameGe: "თეთრიწყარო", nameRu: "Тетрицкаро", lat: 41.5917, lon: 44.4711 },
  { name: "Tianeti", nameGe: "თიანეთი", nameRu: "Тианети", lat: 42.0947, lon: 44.9619 },
  { name: "Tqibuli", nameGe: "ტყიბული", nameRu: "Ткибули", lat: 42.3394, lon: 42.9800 },
  { name: "Tsageri", nameGe: "ცაგერი", nameRu: "Цагери", lat: 42.6494, lon: 42.8092 },
  { name: "Tsalenjikha", nameGe: "წალენჯიხა", nameRu: "Цаленджиха", lat: 42.6111, lon: 42.0861 },
  { name: "Tsalka", nameGe: "წალკა", nameRu: "Цалка", lat: 41.5953, lon: 44.0856 },
  { name: "Tskaltubo", nameGe: "წყალტუბო", nameRu: "Цкалтубо", lat: 42.3350, lon: 42.5978 },
  { name: "Vale", nameGe: "ვალე", nameRu: "Вале", lat: 41.6158, lon: 42.5461 },
  { name: "Vani", nameGe: "ვანი", nameRu: "Вани", lat: 42.0833, lon: 42.5167 },
  { name: "Zestaponi", nameGe: "ზესტაფონი", nameRu: "Зестафони", lat: 42.1092, lon: 43.0456 },
  { name: "Zugdidi", nameGe: "ზუგდიდი", nameRu: "Зугдиди", lat: 42.5088, lon: 41.8709 },
];

export default function WeatherWidget() {
  const { language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [showForecast, setShowForecast] = useState(false);
  const [showCitySelect, setShowCitySelect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved city from localStorage
    const savedCity = localStorage.getItem("weatherCity");
    if (savedCity) {
      const city = CITIES.find(c => c.name === savedCity);
      if (city) setSelectedCity(city);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Fetch with timeout
      const fetchWithTimeout = async (url: string, timeout = 10000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(id);
          return response;
        } catch (error) {
          clearTimeout(id);
          throw error;
        }
      };

      // Current weather
      const currentResponse = await fetchWithTimeout(
        `/api/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&lang=${language === 'ge' ? 'ka' : language}&type=current`,
        10000
      );
      
      if (!currentResponse.ok) {
        throw new Error(`HTTP error! status: ${currentResponse.status}`);
      }
      
      const currentData = await currentResponse.json();

      if (currentData.error) {
        console.error('Weather error:', currentData.error);
        setLoading(false);
        return;
      }

      setWeather({
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        humidity: currentData.main.humidity,
        wind_speed: Math.round(currentData.wind.speed * 3.6), // m/s to km/h
        city: selectedCity.name,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
      });

      // 5-day forecast
      const forecastResponse = await fetchWithTimeout(
        `/api/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&lang=${language === 'ge' ? 'ka' : language}&type=forecast`,
        10000
      );
      
      if (!forecastResponse.ok) {
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }
      
      const forecastData = await forecastResponse.json();

      if (forecastData.error) {
        console.error('Forecast error:', forecastData.error);
        setLoading(false);
        return;
      }

      // Group by day and get daily max/min
      const dailyForecasts: { [key: string]: DailyForecast } = {};
      forecastData.list.forEach((item: ForecastItem) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date,
            temps: [],
            descriptions: [],
            icons: [],
          };
        }
        dailyForecasts[date].temps.push(item.main.temp);
        dailyForecasts[date].descriptions.push(item.weather[0].description);
        dailyForecasts[date].icons.push(item.weather[0].icon);
      });

      const forecastArray = Object.values(dailyForecasts).slice(0, 5).map((day: DailyForecast) => ({
        date: day.date,
        temp_max: Math.round(Math.max(...day.temps)),
        temp_min: Math.round(Math.min(...day.temps)),
        description: day.descriptions[0],
        icon: day.icons[0],
      }));

      setForecast(forecastArray);
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Set default error state
      setWeather({
        temp: 0,
        feels_like: 0,
        description: language === 'ge' ? 'მონაცემები ხელმიუწვდომელია' : 
                     language === 'en' ? 'Data unavailable' : 
                     'Данные недоступны',
        icon: '01d',
        humidity: 0,
        wind_speed: 0,
        city: selectedCity.name,
        sunrise: 0,
        sunset: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const [showDetails, setShowDetails] = useState(false);

  const handleCityChange = (city: typeof CITIES[0]) => {
    setSelectedCity(city);
    localStorage.setItem("weatherCity", city.name);
    setShowCitySelect(false);
  };

  const getCityName = (city: typeof CITIES[0]) => {
    if (language === 'ge') return city.nameGe;
    if (language === 'ru') return city.nameRu;
    return city.name;
  };

  const texts = {
    ge: {
      feelsLike: "იგრძნობა როგორც",
      humidity: "ტენიანობა",
      wind: "ქარი",
      sunrise: "მზის ამოსვლა",
      sunset: "მზის ჩასვლა",
      forecast: "პროგნოზი",
      hideForcast: "დამალე პროგნოზი",
      changeCity: "ქალაქის შეცვლა",
    },
    en: {
      feelsLike: "Feels like",
      humidity: "Humidity",
      wind: "Wind",
      sunrise: "Sunrise",
      sunset: "Sunset",
      forecast: "Forecast",
      hideForcast: "Hide Forecast",
      changeCity: "Change City",
    },
    ru: {
      feelsLike: "Ощущается как",
      humidity: "Влажность",
      wind: "Ветер",
      sunrise: "Восход солнца",
      sunset: "Закат солнца",
      forecast: "Прогноз",
      hideForcast: "Скрыть прогноз",
      changeCity: "Изменить город",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.ge;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString(language === 'ge' ? 'ka-GE' : language === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (loading || !weather) {
    return (
      <div className="weather-widget">
        <div className="weather-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      {/* Compact main display */}
      <div className="weather-compact" onClick={() => setShowDetails(!showDetails)}>
        <div className="weather-city-name">
          {getCityName(selectedCity)}
        </div>
        <div className="weather-temp-display">
          {(() => {
            const IconComponent = getWeatherIcon(weather.icon);
            return <IconComponent size={60} className="weather-icon-compact" />;
          })()}
          <div className="weather-temp-large">{weather.temp}°</div>
        </div>
      </div>

      {/* Expanded details panel */}
      {showDetails && (
        <div className="weather-details-panel">
          <button
            className="city-selector-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowCitySelect(!showCitySelect);
            }}
          >
            📍 {getCityName(selectedCity)}
          </button>

          {showCitySelect && (
            <div className="city-dropdown">
              {CITIES.map((city) => (
                <button
                  key={city.name}
                  className={`city-option ${city.name === selectedCity.name ? 'active' : ''}`}
                  onClick={() => handleCityChange(city)}
                >
                  {getCityName(city)}
                </button>
              ))}
            </div>
          )}

          <div className="weather-description">{weather.description}</div>

          <div className="weather-details">
            <div className="weather-detail">
              <span className="detail-label">{t.humidity}</span>
              <span className="detail-value">{weather.humidity}%</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">{t.wind}</span>
              <span className="detail-value">{weather.wind_speed} km/h</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">{t.sunrise}</span>
              <span className="detail-value">{formatTime(weather.sunrise)}</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">{t.sunset}</span>
              <span className="detail-value">{formatTime(weather.sunset)}</span>
            </div>
          </div>

          <button
            className="forecast-toggle-btn"
            onClick={() => setShowForecast(!showForecast)}
          >
            {showForecast ? t.hideForcast : t.forecast}
          </button>
        </div>
      )}

      {/* Forecast panel */}
      {showForecast && showDetails && (
        <div className="weather-forecast">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-day">
              <div className="forecast-date">{day.date}</div>
              {(() => {
                const IconComponent = getWeatherIcon(day.icon);
                return <IconComponent size={40} className="forecast-icon" />;
              })()}
              <div className="forecast-temps">
                <span className="temp-max">{day.temp_max}°</span>
                <span className="temp-min">{day.temp_min}°</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
