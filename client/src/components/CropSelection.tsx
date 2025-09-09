import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CropSelectionProps {
  onCropSubmit: (crop: string) => void;
}

const CropSelection = ({ onCropSubmit }: CropSelectionProps) => {
  const [selectedCrop, setSelectedCrop] = useState("");

  const commonCrops = [
    "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Soybean", 
    "Tomato", "Potato", "Onion", "Chili", "Banana", "Mango"
  ];

  const handleCropSelect = (crop: string) => {
    setSelectedCrop(crop);
  };

  const handleCustomCrop = () => {
    if (selectedCrop.trim()) {
      onCropSubmit(selectedCrop.trim());
    }
  };

  return (
    <div className="py-16">
      <Card className="max-w-2xl mx-auto shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Select Your Crop</CardTitle>
          <p className="text-muted-foreground">
            What crop are you currently cultivating?
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Popular Crops */}
          <div>
            <h4 className="font-medium mb-3">Popular Crops</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonCrops.map((crop) => (
                <Button
                  key={crop}
                  variant={selectedCrop === crop ? "default" : "outline"}
                  onClick={() => handleCropSelect(crop)}
                  className="transition-smooth hover:shadow-soft"
                >
                  {crop}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Crop Input */}
          <div>
            <h4 className="font-medium mb-3">Or enter manually</h4>
            <div className="flex gap-3">
              <Input
                placeholder="Enter your crop name"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="flex-1 transition-smooth focus:shadow-soft"
              />
            </div>
          </div>

          <Button 
            onClick={handleCustomCrop}
            disabled={!selectedCrop.trim()}
            className="w-full bg-gradient-field hover:shadow-glow transition-smooth"
            size="lg"
          >
            OK, Analyze Weather
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropSelection;