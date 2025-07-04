This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Setup

### Required API Keys

#### 1. Google Gemini AI API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file:
```
GOOGLE_AI_API_KEY=your_gemini_api_key_here
```

#### 2. OpenWeatherMap API Key (for real weather data)
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Create an API key
4. Add it to your `.env.local` file:
```
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### .env.local Example
```bash
# Google Gemini AI Configuration
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Features

### AI-Powered Adventure Planning
- **Google Gemini Integration**: Generates personalized adventure plans
- **Real Weather Data**: Uses OpenWeatherMap API for accurate weather information
- **Georgian Language Support**: Fully localized in Georgian
- **FishHunt Branding**: Always promotes FishHunt products and services

### Weather Integration
- **Current Weather**: Real-time weather data for Georgian cities
- **5-Day Forecast**: Extended weather forecast
- **Activity Recommendations**: Suggests best days for outdoor activities
- **Georgian Locations**: Optimized for Georgian cities and locations
