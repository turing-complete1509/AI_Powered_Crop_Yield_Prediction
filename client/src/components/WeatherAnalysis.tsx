import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Sun, Thermometer, Droplets, Wind, AlertTriangle } from "lucide-react";

interface WeatherAnalysisProps {
  location: string;
  crop: string;
}

const WeatherAnalysis = ({ location, crop }: WeatherAnalysisProps) => {
  const currentWeather = {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    windSpeed: 12,
    condition: "Partly Cloudy"
  };

  const forecast = [
    { day: "Today", temp: 28, rain: 0, condition: "sunny" },
    { day: "Tomorrow", temp: 30, rain: 5, condition: "light-rain" },
    { day: "Day 3", temp: 26, rain: 15, condition: "rain" },
    { day: "Day 4", temp: 24, rain: 8, condition: "cloudy" },
    { day: "Day 5", temp: 27, rain: 0, condition: "sunny" },
    { day: "Day 6", temp: 29, rain: 2, condition: "partly-cloudy" },
    { day: "Day 7", temp: 31, rain: 0, condition: "sunny" }
  ];

  const insights = [
    {
      type: "warning",
      message: "Temperature is 3°C higher than usual for this time of year",
      action: "Increase irrigation frequency and provide shade if possible",
      icon: <Thermometer className="w-5 h-5" />
    },
    {
      type: "info",
      message: "Rain expected tomorrow (5mm) - perfect timing for your rice crop",
      action: "Skip irrigation today to avoid overwatering",
      icon: <CloudRain className="w-5 h-5" />
    },
    {
      type: "success",
      message: "Humidity levels are optimal for rice growth",
      action: "Continue current care routine",
      icon: <Droplets className="w-5 h-5" />
    }
  ];

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
      case "warning": return <Badge className="bg-warning/10 text-warning border-warning/20">Action Needed</Badge>;
      case "success": return <Badge className="bg-success/10 text-success border-success/20">Good</Badge>;
      default: return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Weather Analysis for {crop}
          </h2>
          <p className="text-muted-foreground text-lg">
            {location} • Real-time insights and predictions
          </p>
        </div>

        {/* Current Weather */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-6 h-6 text-accent" />
              Current Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentWeather.temperature}°C</div>
                <div className="text-sm text-muted-foreground">Temperature</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sky">{currentWeather.humidity}%</div>
                <div className="text-sm text-muted-foreground">Humidity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-earth">{currentWeather.rainfall}mm</div>
                <div className="text-sm text-muted-foreground">Rainfall</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{currentWeather.windSpeed} km/h</div>
                <div className="text-sm text-muted-foreground">Wind Speed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>7-Day Weather Forecast</CardTitle>
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
              AI-Powered Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-gradient-subtle rounded-lg border-l-4 border-primary">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{insight.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-foreground">{insight.message}</p>
                      {getInsightBadge(insight.type)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Recommended Action:</strong> {insight.action}
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