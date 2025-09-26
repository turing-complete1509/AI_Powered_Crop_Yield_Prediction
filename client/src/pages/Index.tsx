import { useState, useEffect, useRef } from "react";
import WelcomePage from "@/components/WelcomePage";
import LocationInput from "@/components/LocationInput";
import CropFavorability from "@/components/CropFavorability";
import CropSelection from "@/components/CropSelection";
import WeatherAnalysis from "@/components/WeatherAnalysis";
import Chatbot from "@/components/Chatbot";
import YieldPrediction from "@/components/YieldPrediction";

type Step = "welcome" | "location" | "favorability" | "selection" | "analysis";

interface LocationData {
  district: string;
  state?: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const favorabilityRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    setCurrentStep("location");
    setIsChatOpen(true);
    setTimeout(() => scrollToSection(locationRef), 100);
  };

  const handleLocationSubmit = (district: string, state?: string) => {
    setLocation({ district, state });
    setCurrentStep("favorability");
    setTimeout(() => scrollToSection(favorabilityRef), 100);
  };

  const handleFavorabilityContinue = () => {
    setCurrentStep("selection");
    setTimeout(() => scrollToSection(selectionRef), 100);
  };

  const handleCropSubmit = (crop: string) => {
    setSelectedCrop(crop);
    setCurrentStep("analysis");
    setTimeout(() => scrollToSection(analysisRef), 100);
  };

  const locationString = location ? `${location.district}${location.state ? `, ${location.state}` : ''}` : '';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Welcome Page */}
      {currentStep === "welcome" && <WelcomePage onGetStarted={handleGetStarted} />}
      
      {/* Main Content */}
      {currentStep !== "welcome" && (
        <div className="container mx-auto px-4">
          {/* Location Input */}
          <div ref={locationRef}>
            <LocationInput onLocationSubmit={handleLocationSubmit} />
          </div>

          {/* Crop Favorability */}
          {currentStep !== "location" && location && (
            <div ref={favorabilityRef}>
              <CropFavorability 
                district={location.district}
                state={location.state}
                onContinue={handleFavorabilityContinue}
              />
            </div>
          )}

          {/* Crop Selection */}
          {(currentStep === "selection" || currentStep === "analysis") && (
            <div ref={selectionRef}>
              <CropSelection onCropSubmit={handleCropSubmit} />
            </div>
          )}

          {/* Weather Analysis */}
          {currentStep === "analysis" && (
            <div ref={analysisRef}>
              <WeatherAnalysis 
                location={locationString}
                crop={selectedCrop}
              />
            </div>
          )}
          {/* Yield Prediction */}
          {currentStep === "analysis" && location && (
            <div>
              <YieldPrediction location={location} crop={selectedCrop} />
            </div>
          )}
        </div>
      )}

      {/* Chatbot */}
      {currentStep !== "welcome" && (
        <Chatbot 
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          location={locationString}
          crop={selectedCrop}
        />
      )}
    </div>
  );
};

export default Index;
