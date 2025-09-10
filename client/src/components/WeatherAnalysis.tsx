import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Sun, Thermometer, Droplets, Wind, AlertTriangle } from "lucide-react";

interface WeatherAnalysisProps {
  location: string;
  crop: string;
}

interface Insight {
  type: string;
  message: string;
  action: string;
}

const WeatherAnalysis = ({ location, crop }: WeatherAnalysisProps) => {
  const { t } = useTranslation();
  
  const currentWeather = {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    windSpeed: 12,
    condition: "Partly Cloudy"
  };

  const forecast = [
    { day: t('weatherAnalysis.today'), temp: 28, rain: 0, condition: "sunny" },
    { day: t('weatherAnalysis.tomorrow'), temp: 30, rain: 5, condition: "light-rain" },
    { day: t('weatherAnalysis.day3'), temp: 26, rain: 15, condition: "rain" },
    { day: t('weatherAnalysis.day4'), temp: 24, rain: 8, condition: "cloudy" },
    { day: t('weatherAnalysis.day5'), temp: 27, rain: 0, condition: "sunny" },
    { day: t('weatherAnalysis.day6'), temp: 29, rain: 2, condition: "partly-cloudy" },
    { day: t('weatherAnalysis.day7'), temp: 31, rain: 0, condition: "sunny" }
  ];

  // Load the insights array directly from the JSON file
  const insights = t('data.insights', { returnObjects: true }) as Insight[];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning": return <Thermometer className="w-5 h-5" />;
      case "info": return <CloudRain className="w-5 h-5" />;
      case "success": return <Droplets className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };
  
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny": return <Sun className="w-6 h-6 text-accent" />;
      case "rain": 
      case "light-rain": return <CloudRain className="w-6 h-6 text-sky" />;
      default: return <Sun className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case "warning": return <Badge className="bg-warning/10 text-warning border-warning/20">{t('weatherAnalysis.actionNeeded')}</Badge>;
      case "success": return <Badge className="bg-success/10 text-success border-success/20">{t('weatherAnalysis.good')}</Badge>;
      default: return <Badge variant="secondary">{t('weatherAnalysis.info')}</Badge>;
    }
  };

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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-6 h-6 text-accent" />
              {t('weatherAnalysis.currentWeather')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentWeather.temperature}°C</div>
                <div className="text-sm text-muted-foreground">{t('weatherAnalysis.temperature')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sky">{currentWeather.humidity}%</div>
                <div className="text-sm text-muted-foreground">{t('weatherAnalysis.humidity')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-earth">{currentWeather.rainfall}mm</div>
                <div className="text-sm text-muted-foreground">{t('weatherAnalysis.rainfall')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{currentWeather.windSpeed} km/h</div>
                <div className="text-sm text-muted-foreground">{t('weatherAnalysis.windSpeed')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('weatherAnalysis.forecastTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="text-center p-4 bg-gradient-subtle rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-2">{day.day}</div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="text-lg font-bold text-primary">{day.temp}°</div>
                  <div className="text-sm text-sky">{day.rain}mm</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-accent" />
              {t('weatherAnalysis.insightsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-gradient-subtle rounded-lg border-l-4 border-primary">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-foreground">{insight.message}</p>
                      {getInsightBadge(insight.type)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>{t('weatherAnalysis.recommendedAction')}</strong> {insight.action}
                    </p>
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