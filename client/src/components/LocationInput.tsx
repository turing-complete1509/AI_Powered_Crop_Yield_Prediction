import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationInputProps {
  onLocationSubmit: (district: string, state?: string) => void;
}

const LocationInput = ({ onLocationSubmit }: LocationInputProps) => {
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
          <CardTitle className="text-2xl text-primary">Your Location</CardTitle>
          <p className="text-muted-foreground">
            Tell us where your farm is located
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="district" className="block text-sm font-medium mb-2">
              District *
            </label>
            <Input
              id="district"
              placeholder="Enter your district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="transition-smooth focus:shadow-soft"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-2">
              State (Optional)
            </label>
            <Input
              id="state"
              placeholder="Enter your state"
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
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationInput;