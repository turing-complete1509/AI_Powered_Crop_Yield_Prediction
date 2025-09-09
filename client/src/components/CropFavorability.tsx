import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CropFavorabilityProps {
  district: string;
  state?: string;
  onContinue: () => void;
}

const CropFavorability = ({ district, state, onContinue }: CropFavorabilityProps) => {
  const favorableCrops = [
    { name: "Rice", reason: "Ideal monsoon conditions" },
    { name: "Wheat", reason: "Perfect winter temperature" },
    { name: "Cotton", reason: "Good soil drainage" },
    { name: "Sugarcane", reason: "High water availability" },
  ];

  const unfavorableCrops = [
    { name: "Apple", reason: "Insufficient cold period" },
    { name: "Potato", reason: "High temperature stress" },
    { name: "Barley", reason: "Poor soil pH match" },
  ];

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Crop Recommendations for {district}
            {state && `, ${state}`}
          </h2>
          <p className="text-muted-foreground text-lg">
            Based on local climate and soil conditions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Favorable Crops */}
          <Card className="shadow-card border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <span className="w-3 h-3 bg-success rounded-full"></span>
                Most Favorable Crops
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {favorableCrops.map((crop, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-3 bg-gradient-subtle rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-foreground">{crop.name}</h4>
                    <p className="text-sm text-muted-foreground">{crop.reason}</p>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    Excellent
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Unfavorable Crops */}
          <Card className="shadow-card border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <span className="w-3 h-3 bg-warning rounded-full"></span>
                Least Favorable Crops
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unfavorableCrops.map((crop, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-3 bg-gradient-subtle rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-foreground">{crop.name}</h4>
                    <p className="text-sm text-muted-foreground">{crop.reason}</p>
                  </div>
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                    Challenging
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={onContinue}
            size="lg"
            className="bg-gradient-field hover:shadow-glow transition-smooth px-8"
          >
            OK, Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropFavorability;