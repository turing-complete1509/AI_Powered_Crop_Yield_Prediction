import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerCrash, Info } from "lucide-react";
import { DUMMY_RECOMMENDATIONS, type RecommendationData } from "@/lib/dummy-data"; // <-- Import dummy data

interface CropFavorabilityProps {
  district: string;
  state?: string;
  onContinue: () => void;
}

const fetchCropRecommendations = async (district: string, state?: string): Promise<RecommendationData> => {
  // ... (API call function remains the same)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const response = await fetch(`${API_BASE_URL}/api/crop-recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ district, state }),
  });
  if (!response.ok) throw new Error("Failed to fetch crop recommendations");
  return response.json();
};

const CropFavorability = ({ district, state, onContinue }: CropFavorabilityProps) => {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cropRecommendations', district, state],
    queryFn: () => fetchCropRecommendations(district, state),
    enabled: !!district,
  });
  
  // --- THIS IS THE NEW LOGIC ---
  // If there's an error, use the dummy data. Otherwise, use the real data.
  const displayData = isError ? DUMMY_RECOMMENDATIONS : data;

  if (isLoading) {
    // ... (Loading skeleton remains the same)
    return <div className="py-16 max-w-4xl mx-auto space-y-8 animate-pulse">...</div>;
  }
  
  // Render the component if we have any data to display (real or dummy)
  if (!displayData) {
    return null; // Or another loading/empty state
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('cropFavorability.title')} {district}{state && `, ${state}`}</h2>
          <p className="text-muted-foreground text-lg">{t('cropFavorability.subtitle')}</p>
        </div>
        
        {/* If there was an error, show a non-intrusive warning message */}
        {isError && (
          <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
            <Info className="h-4 w-4 !text-amber-600" />
            <AlertTitle>Offline Mode</AlertTitle>
            <AlertDescription>
              Could not connect to the server. Showing sample data.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-card border-success/20">
            {/* ... (Card content now uses displayData.favorable) ... */}
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
            {/* ... (Card content now uses displayData.unfavorable) ... */}
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