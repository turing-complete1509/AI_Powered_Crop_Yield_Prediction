import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown'; // <-- ADDED THIS IMPORT
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CloudRain, Sun, Thermometer, Droplets, Wind, AlertTriangle, ServerCrash } from "lucide-react";

// This interface must match the Pydantic model in main.py
interface WeatherData {
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

interface WeatherAnalysisProps {
  location: string;
  crop: string;
}

// This new function will make the API call to our backend
const fetchWeatherAnalysis = async (location: string, crop: string): Promise<WeatherData> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const response = await fetch(`${API_BASE_URL}/api/weather-analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location, crop }),
  });

  if (!response.ok) {
    // This throw will trigger the retry mechanism
    throw new Error("Failed to fetch weather analysis");
  }

  return response.json();
};


const WeatherAnalysis = ({ location, crop }: WeatherAnalysisProps) => {
  const { t } = useTranslation();
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['weatherAnalysis', location, crop],
    queryFn: () => fetchWeatherAnalysis(location, crop),
    enabled: !!(location && crop), // Only run the query if location and crop are available
    staleTime: 1000 * 60 * 15, // Cache data for 15 minutes
    refetchOnWindowFocus: false,

    // --- NEW RETRY LOGIC ---
    // Number of times to retry a failed request before showing an error.
    retry: 3,
    // Delay between retries, with exponential backoff.
    // 1st retry: 1s, 2nd: 2s, 3rd: 4s
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    // --- END OF NEW LOGIC ---
  });

  // --- UI Helper Functions ---
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning": return <Thermometer className="w-5 h-5 text-warning" />;
      case "info": return <CloudRain className="w-5 h-5 text-sky" />;
      case "success": return <Droplets className="w-5 h-5 text-success" />;
      default: return <AlertTriangle className="w-5 h-5 text-muted-foreground" />;
    }
  };
  
  const getWeatherIcon = (condition: string) => {
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes("rain")) return <CloudRain className="w-6 h-6 text-sky" />;
    if (lowerCaseCondition.includes("sun") || lowerCaseCondition.includes("clear")) return <Sun className="w-6 h-6 text-accent" />;
    return <Sun className="w-6 h-6 text-muted-foreground" />; // Default icon
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case "warning": return <Badge className="bg-warning/10 text-warning border-warning/20">{t('weatherAnalysis.actionNeeded')}</Badge>;
      case "success": return <Badge className="bg-success/10 text-success border-success/20">{t('weatherAnalysis.good')}</Badge>;
      default: return <Badge variant="secondary">{t('weatherAnalysis.info')}</Badge>;
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="py-16 max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="text-center mb-12">
          <Skeleton className="h-9 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-6"><Skeleton className="h-12 w-24 mx-auto" /><Skeleton className="h-12 w-24 mx-auto" /><Skeleton className="h-12 w-24 mx-auto" /><Skeleton className="h-12 w-24 mx-auto" /></div></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-7 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></CardContent></Card>
      </div>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      <div className="py-16 max-w-6xl mx-auto">
        <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>
            Could not retrieve the weather analysis after multiple attempts. The server may be busy. Please try again later.
            <pre className="mt-2 text-xs">{error.message}</pre>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // This check is important to make TypeScript happy, as 'data' can be undefined
  if (!data) return null;

  // --- Success State ---
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {t('weatherAnalysis.title')} {crop}
          </h2>
          <p className="text-muted-foreground text-lg">
            {location} • {t('weatherAnalysis.subtitlePart1')}
          </p>
        </div>

        {/* Current Weather */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2">{getWeatherIcon(data.currentWeather.condition)} {t('weatherAnalysis.currentWeather')}</CardTitle></CardHeader>
          <CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center"><div className="text-2xl font-bold text-primary">{data.currentWeather.temperature}°C</div><div className="text-sm text-muted-foreground">{t('weatherAnalysis.temperature')}</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-sky">{data.currentWeather.humidity}%</div><div className="text-sm text-muted-foreground">{t('weatherAnalysis.humidity')}</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-earth">{data.currentWeather.rainfall}mm</div><div className="text-sm text-muted-foreground">{t('weatherAnalysis.rainfall')}</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-muted-foreground">{data.currentWeather.windSpeed} km/h</div><div className="text-sm text-muted-foreground">{t('weatherAnalysis.windSpeed')}</div></div>
          </div></CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Card className="shadow-card">
          <CardHeader><CardTitle>{t('weatherAnalysis.forecastTitle')}</CardTitle></CardHeader>
          <CardContent><div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {data.forecast.map((day, index) => (
              <div key={index} className="text-center p-4 bg-gradient-subtle rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">{day.day}</div>
                <div className="flex justify-center mb-2">{getWeatherIcon(day.condition)}</div>
                <div className="text-lg font-bold text-primary">{day.temp}°</div>
                <div className="text-sm text-sky">{day.rain}mm</div>
              </div>
            ))}
          </div></CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-accent" /> {t('weatherAnalysis.insightsTitle')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {data.insights.map((insight, index) => (
              <div key={index} className="p-4 bg-gradient-subtle rounded-lg border-l-4 border-primary">
                <div className="flex items-start gap-3"><div className="mt-1">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    {/* --- THIS IS THE CHANGED SECTION --- */}
                    {/* The message is now rendered with ReactMarkdown to preserve formatting */}
                    <div className="prose prose-sm dark:prose-invert max-w-none mb-2">
                      <ReactMarkdown>{insight.message}</ReactMarkdown>
                    </div>
                    {/* The badge and action are styled separately */}
                    <div className="flex items-center gap-2 mt-3">
                      {getInsightBadge(insight.type)}
                      <p className="text-sm text-muted-foreground">
                        <strong>{t('weatherAnalysis.recommendedAction')}</strong> {insight.action}
                      </p>
                    </div>
                    {/* --- END OF CHANGED SECTION --- */}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherAnalysis;