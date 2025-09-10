import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CropSelectionProps {
  onCropSubmit: (crop: string) => void;
}

const CropSelection = ({ onCropSubmit }: CropSelectionProps) => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState("");

  // Load the list of crops directly from the JSON file
  // The { returnObjects: true } option tells i18next to return the array
  const commonCrops = t('data.commonCrops', { returnObjects: true }) as string[];

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
          <CardTitle className="text-2xl text-primary">{t('cropSelection.title')}</CardTitle>
          <p className="text-muted-foreground">
            {t('cropSelection.subtitle')}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">{t('cropSelection.popularCrops')}</h4>
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

          <div>
            <h4 className="font-medium mb-3">{t('cropSelection.manualEntry')}</h4>
            <div className="flex gap-3">
              <Input
                placeholder={t('cropSelection.placeholder')}
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
            {t('cropSelection.analyze')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropSelection;