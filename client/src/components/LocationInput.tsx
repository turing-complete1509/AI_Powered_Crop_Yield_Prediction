import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationInputProps {
  onLocationSubmit: (district: string, state?: string) => void;
}

const LocationInput = ({ onLocationSubmit }: LocationInputProps) => {
  const { t } = useTranslation();
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");

  const handleSubmit = () => {
    if (district.trim()) {
      onLocationSubmit(district.trim(), state.trim() || undefined);
    }
  };

  return (
    <div className="py-16">
      <Card className="max-w-md mx-auto shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">{t('locationInput.title')}</CardTitle>
          <p className="text-muted-foreground">
            {t('locationInput.subtitle')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="district" className="block text-sm font-medium mb-2">
              {t('locationInput.districtLabel')}
            </label>
            <Input
              id="district"
              placeholder={t('locationInput.districtPlaceholder')}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="transition-smooth focus:shadow-soft"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-2">
              {t('locationInput.stateLabel')}
            </label>
            <Input
              id="state"
              placeholder={t('locationInput.statePlaceholder')}
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="transition-smooth focus:shadow-soft"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!district.trim()}
            className="w-full bg-gradient-field hover:shadow-glow transition-smooth"
          >
            {t('locationInput.continue')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationInput;