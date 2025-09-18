import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CloudRain, Sun, Thermometer, Droplets, Wind, AlertTriangle, ServerCrash } from "lucide-react";
import { DUMMY_WEATHER_ANALYSIS, type WeatherData } from "@/lib/dummy-data";
import { Info } from "lucide-react";


const fetchWeatherAnalysis = async (location: string, crop: string): Promise<WeatherData> => {
  // ... (API call function remains the same)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const response = await fetch(`${API_BASE_URL}/api/weather-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location, crop }),
  });
  if (!response.ok) throw new Error("Failed to fetch weather analysis");
  return response.json();
};

const WeatherAnalysis = ({ location, crop }: WeatherAnalysisProps) => {
  const { t } = useTranslation();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weatherAnalysis', location, crop],
    queryFn: () => fetchWeatherAnalysis(location, crop),
    enabled: !!(location && crop),
    staleTime: 1000 * 60 * 15,
  });

  // --- THIS IS THE NEW LOGIC ---
  const displayData = isError ? DUMMY_WEATHER_ANALYSIS : data;
  
  if (isLoading) {
    // ... (Loading skeleton remains the same)
    return <div className="py-16 max-w-6xl mx-auto space-y-8 animate-pulse">...</div>;
  }

  if (!displayData) {
    return null;
  }

  // ... (UI helper functions like getInsightIcon remain the same)

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-primary mb-4">{t('weatherAnalysis.title')} {crop}</h2>
           <p className="text-muted-foreground text-lg">{location} • {t('weatherAnalysis.subtitlePart1')}</p>
        </div>

        {/* If there was an error, show a non-intrusive warning message */}
        {isError && (
          <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800 mb-8">
            <Info className="h-4 w-4 !text-amber-600" />
            <AlertTitle>Offline Mode</AlertTitle>
            <AlertDescription>
              Could not connect to the server. Showing sample data.
            </AlertDescription>
          </Alert>
        )}

        {/* All cards below now use 'displayData' instead of 'data' */}
        <Card className="shadow-card">
          <CardHeader><CardTitle>...</CardTitle></CardHeader>
          <CardContent>...</CardContent>
        </Card>
        {/* ... etc for all cards ... */}
      </div>
    </div>
  );
};

export default WeatherAnalysis;