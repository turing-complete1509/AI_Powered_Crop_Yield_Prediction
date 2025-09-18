import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DUMMY_RECOMMENDATIONS, type RecommendationData } from "@/lib/dummy-data";

interface CropFavorabilityProps {
  district: string;
  state?: string;
  onContinue: () => void;
}

// API call function
const fetchCropRecommendations = async (district: string, state?: string): Promise<RecommendationData> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const response = await fetch(`${API_BASE_URL}/api/crop-recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ district, state }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch crop recommendations");
  }
  return response.json();
};

const CropFavorability = ({ district, state, onContinue }: CropFavorabilityProps) => {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cropRecommendations', district, state],
    queryFn: () => fetchCropRecommendations(district, state),
    enabled: !!district,
  });
  
  // This is the core fallback logic:
  // If there's an error, use the dummy data. Otherwise, use the real data.
  const displayData = isError ? DUMMY_RECOMMENDATIONS : data;

  if (isLoading) {
    return (
      <div className="py-16 max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="text-center mb-12">
          <Skeleton className="h-9 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }
  
  if (!displayData) {
    return null; // Don't render anything if there's no data yet
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('cropFavorability.title')} {district}{state && `, ${state}`}</h2>
          <p className="text-muted-foreground text-lg">{t('cropFavorability.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-card border-success/20">
            <CardHeader><CardTitle className="flex items-center gap-2 text-success"><span className="w-3 h-3 bg-success rounded-full"></span>{t('cropFavorability.favorableTitle')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {displayData.favorable.map((crop, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gradient-subtle rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{crop.name}</h4>
                    <p className="text-sm text-muted-foreground">{crop.reason}</p>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">{crop.favorability}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-card border-warning/20">
            <CardHeader><CardTitle className="flex items-center gap-2 text-warning"><span className="w-3 h-3 bg-warning rounded-full"></span>{t('cropFavorability.unfavorableTitle')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {displayData.unfavorable.map((crop, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gradient-subtle rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{crop.name}</h4>
                    <p className="text-sm text-muted-foreground">{crop.reason}</p>
                  </div>
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">{crop.favorability}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="text-center">
          <Button onClick={onContinue} size="lg" className="bg-gradient-field hover:shadow-glow transition-smooth px-8">{t('cropFavorability.continue')}</Button>
        </div>
      </div>
    </div>
  );
};

export default CropFavorability;