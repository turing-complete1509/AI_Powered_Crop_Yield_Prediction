import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-agriculture.jpg";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface WelcomePageProps {
  onGetStarted: () => void;
}

const WelcomePage = ({ onGetStarted }: WelcomePageProps) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/30" />
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-card/95 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-card max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              {t('welcome.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('welcome.subtitle')}
            </p>
            <Button onClick={onGetStarted} size="lg" className="bg-gradient-field hover:shadow-glow transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold">
              {t('welcome.getStarted')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;