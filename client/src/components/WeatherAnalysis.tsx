import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudRain, Sun, Thermometer, Droplets, Wind, AlertTriangle } from "lucide-react";
import { DUMMY_WEATHER_ANALYSIS, type WeatherData } from "@/lib/dummy-data";

interface WeatherAnalysisProps {
  location: string;
  crop: string;
}

const fetchWeatherAnalysis = async (location: string, crop: string): Promise<WeatherData> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const response = await fetch(`${API_BASE_URL}/api/weather-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location, crop }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch weather analysis from the server.");
  }
  return response.json();
};

const WeatherAnalysis = ({ location, crop }: WeatherAnalysisProps) => {
  const { t } = useTranslation();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weatherAnalysis', location, crop],
    queryFn: () => fetchWeatherAnalysis(location, crop),
    enabled: !!(location && crop),
  });

  const displayData = isError ? DUMMY_WEATHER_ANALYSIS : data;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning": return <Thermometer className="w-5 h-5 text-warning" />;
      case "info": return <CloudRain className="w-5 h-5 text-sky" />;
      case "success": return <Droplets className="w-5 h-5 text-success" />;
      default: return <AlertTriangle className="w-5 h-5 text-muted-foreground" />;
    }
  };
  
  const getWeatherIcon = (condition: string = "") => {
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes("rain")) return <CloudRain className="w-6 h-6 text-sky" />;
    if (lowerCaseCondition.includes("sun") || lowerCaseCondition.includes("clear")) return <Sun className="w-6 h-6 text-accent" />;
    return <Sun className="w-6 h-6 text-muted-foreground" />;
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case "warning": return <Badge className="bg-warning/10 text-warning border-warning/20">{t('weatherAnalysis.actionNeeded')}</Badge>;
      case "success": return <Badge className="bg-success/10 text-success border-success/20">{t('weatherAnalysis.good')}</Badge>;
      default: return <Badge variant="secondary">{t('weatherAnalysis.info')}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="text-center mb-12"><Skeleton className="h-9 w-64 mx-auto mb-4" /><Skeleton className="h-6 w-80 mx-auto" /></div>
        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-6"><Skeleton className="h-12 w-24 mx-auto" /><Skeleton className="h-12 w-24 mx-auto" /><Skeleton className="h-12 w-24 mx-auto" /><Skeleton className="h-12 w-24 mx-auto" /></div></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-7 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (!displayData) {
    return null;
  }

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('weatherAnalysis.title')} {crop}</h2>
          <p className="text-muted-foreground text-lg">{location} • {t('weatherAnalysis.subtitlePart1')}</p>
        </div>
        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2">{getWeatherIcon(displayData.currentWeather.condition)} {t('weatherAnalysis.currentWeather')}</CardTitle></CardHeader>
          <CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center"><div className="text-2xl font-bold text-primary">{displayData.currentWeather.temperature}°C</div><div className="text-sm text-muted-foreground">{t('weatherAnalysis.temperature')}</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-sky">{displayData.currentWeather.humidity}%</div><div className="text-sm text-muted-foreground">{t('weatherAnalysis.humidity')}</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-earth">{displayData.currentWeather.rainfall}mm</div><div className="text-sm text-muted-foreground">{t('weatherAnalysis.rainfall')}</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-muted-foreground">{displayData.currentWeather.windSpeed} km/h</div><div className="text-sm text-muted-foreground">{t('weatherAnalysis.windSpeed')}</div></div>
          </div></CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader><CardTitle>{t('weatherAnalysis.forecastTitle')}</CardTitle></CardHeader>
          <CardContent><div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {displayData.forecast.map((day, index) => (
              <div key={index} className="text-center p-4 bg-gradient-subtle rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">{day.day}</div>
                <div className="flex justify-center mb-2">{getWeatherIcon(day.condition)}</div>
                <div className="text-lg font-bold text-primary">{day.temp}°</div>
                <div className="text-sm text-sky">{day.rain}mm</div>
              </div>
            ))}
          </div></CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-accent" /> {t('weatherAnalysis.insightsTitle')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {displayData.insights.map((insight, index) => (
              <div key={index} className="p-4 bg-gradient-subtle rounded-lg border-l-4 border-primary">
                <div className="flex items-start gap-3"><div className="mt-1">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-foreground">{insight.message}</p>
                      {getInsightBadge(insight.type)}
                    </div>
                    <p className="text-sm text-muted-foreground"><strong>{t('weatherAnalysis.recommendedAction')}</strong> {insight.action}</p>
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