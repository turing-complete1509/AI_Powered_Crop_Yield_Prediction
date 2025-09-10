import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CropFavorabilityProps {
  district: string;
  state?: string;
  onContinue: () => void;
}

const CropFavorability = ({ district, state, onContinue }: CropFavorabilityProps) => {
  const { t } = useTranslation();

  // The structure is kept, but the text is now fetched from translations
  const favorableCrops = [
    { name: t('data.commonCrops.0'), reason: t('data.favorabilityReasons.rice') }, // Rice
    { name: t('data.commonCrops.1'), reason: t('data.favorabilityReasons.wheat') }, // Wheat
    { name: t('data.commonCrops.2'), reason: t('data.favorabilityReasons.cotton') }, // Cotton
    { name: t('data.commonCrops.3'), reason: t('data.favorabilityReasons.sugarcane') }, // Sugarcane
  ];

  const unfavorableCrops = [
    { name: "Apple", reason: t('data.favorabilityReasons.apple') },
    { name: t('data.commonCrops.7'), reason: t('data.favorabilityReasons.potato') }, // Potato
    { name: "Barley", reason: t('data.favorabilityReasons.barley') },
  ];

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {t('cropFavorability.title')} {district}
            {state && `, ${state}`}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('cropFavorability.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-card border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <span className="w-3 h-3 bg-success rounded-full"></span>
                {t('cropFavorability.favorableTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {favorableCrops.map((crop, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gradient-subtle rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{crop.name}</h4>
                    <p className="text-sm text-muted-foreground">{crop.reason}</p>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    {t('cropFavorability.excellent')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <span className="w-3 h-3 bg-warning rounded-full"></span>
                {t('cropFavorability.unfavorableTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unfavorableCrops.map((crop, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gradient-subtle rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{crop.name}</h4>
                    <p className="text-sm text-muted-foreground">{crop.reason}</p>
                  </div>
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                    {t('cropFavorability.challenging')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button onClick={onContinue} size="lg" className="bg-gradient-field hover:shadow-glow transition-smooth px-8">
            {t('cropFavorability.continue')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropFavorability;