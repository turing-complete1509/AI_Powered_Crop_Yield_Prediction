// Define the data structures to match our API
interface CropData {
  name: string;
  reason: string;
  favorability: string;
}

export interface RecommendationData {
  favorable: CropData[];
  unfavorable: CropData[];
}

export interface WeatherData {
  currentWeather: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    condition: string;
  };
  forecast: {
    day: string;
    temp: number;
    rain: number;
    condition: string;
  }[];
  insights: {
    type: string;
    message: string;
    action: string;
  }[];
}

// Dummy data for Crop Recommendations
export const DUMMY_RECOMMENDATIONS: RecommendationData = {
  favorable: [
    { name: "Rice", reason: "Ideal monsoon conditions", favorability: "Excellent" },
    { name: "Wheat", reason: "Suitable winter temperature", favorability: "Excellent" },
    { name: "Cotton", reason: "Good soil drainage", favorability: "Excellent" },
    { name: "Sugarcane", reason: "High water availability", favorability: "Excellent" },
  ],
  unfavorable: [
    { name: "Apple", reason: "Insufficient chilling hours", favorability: "Challenging" },
    { name: "Potato", reason: "High temperature stress", favorability: "Challenging" },
    { name: "Barley", reason: "Poor soil pH match", favorability: "Challenging" },
  ],
};

// Dummy data for Weather Analysis
export const DUMMY_WEATHER_ANALYSIS: WeatherData = {
  currentWeather: {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    windSpeed: 12,
    condition: "Partly Cloudy"
  },
  forecast: [
    { day: "Today", temp: 28, rain: 0, condition: "sunny" },
    { day: "Tomorrow", temp: 30, rain: 5, condition: "light-rain" },
    { day: "Day 3", temp: 26, rain: 15, condition: "rain" },
    { day: "Day 4", temp: 24, rain: 8, condition: "cloudy" },
    { day: "Day 5", temp: 27, rain: 0, condition: "sunny" },
    { day: "Day 6", temp: 29, rain: 2, condition: "partly-cloudy" },
    { day: "Day 7", temp: 31, rain: 0, condition: "sunny" }
  ],
  insights: [
    {
      type: "warning",
      message: "Temperature is 3°C above normal for this time",
      action: "Increase irrigation frequency and provide shade if possible"
    },
    {
      type: "info",
      message: "Rain expected tomorrow (5mm) - perfect timing for your rice crop",
      action: "Skip irrigation today to avoid overwatering"
    },
    {
      type: "success",
      message: "Humidity levels are optimal for rice growth",
      action: "Continue with the current care routine"
    }
  ]
};