import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

// --- Props Interface ---
interface LocationData {
  district: string;
  state?: string;
}

interface YieldPredictionProps {
  location: LocationData | null;
  crop: string;
}

// --- Form Schema and Validation ---
const formSchema = z.object({
  state: z.string().min(2, "State is required."),
  district: z.string().min(2, "District is required."),
  crop: z.string().min(2, "Crop is required."),
  season: z.string({ required_error: "Please select a season."}),
  area: z.coerce.number({ invalid_type_error: "Area must be a number."}).min(0.01, "Area must be positive."),
});

type FormValues = z.infer<typeof formSchema>;

// --- API Call Function ---
const predictYield = async (values: FormValues) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const response = await fetch(`${API_BASE_URL}/api/yield-prediction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    throw new Error("Failed to get yield prediction from the server.");
  }
  return response.json();
};

const YieldPrediction = ({ location, crop }: YieldPredictionProps) => {
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: location?.state || "",
      district: location?.district || "",
      crop: crop || "",
      area: undefined, // Start with an empty area
    }
  });

  // Effect to update the form if the props change after initial render
  useEffect(() => {
    if (location && crop) {
      form.reset({
        ...form.getValues(), // Keep existing values like 'area' or 'season' if user already interacted
        state: location.state || "",
        district: location.district || "",
        crop: crop,
      });
    }
  }, [location, crop, form]);

  const mutation = useMutation({
    mutationFn: predictYield,
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="py-16">
      <Card className="max-w-2xl mx-auto shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">{t('yieldPrediction.title')}</CardTitle>
          <p className="text-muted-foreground">{t('yieldPrediction.subtitle')}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField name="state" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('yieldPrediction.stateLabel')}</FormLabel>
                    <FormControl><Input placeholder={t('yieldPrediction.statePlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="district" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('yieldPrediction.districtLabel')}</FormLabel>
                    <FormControl><Input placeholder={t('yieldPrediction.districtPlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="crop" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('yieldPrediction.cropLabel')}</FormLabel>
                    <FormControl><Input placeholder={t('yieldPrediction.cropPlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="season" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('yieldPrediction.seasonLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder={t('yieldPrediction.seasonPlaceholder')} /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Kharif">Kharif</SelectItem>
                        <SelectItem value="Rabi">Rabi</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                        <SelectItem value="Winter">Winter</SelectItem>
                        <SelectItem value="Autumn">Autumn</SelectItem>
                        <SelectItem value="Whole Year">Whole Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField name="area" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('yieldPrediction.areaLabel')}</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder={t('yieldPrediction.areaPlaceholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={mutation.isPending} className="w-full bg-gradient-field">
                {mutation.isPending ? t('yieldPrediction.calculating') : t('yieldPrediction.predictButton')}
              </Button>
            </form>
          </Form>

          {mutation.isSuccess && (
            <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg text-center">
              <h4 className="font-semibold text-success">{t('yieldPrediction.resultTitle')}</h4>
              <p className="text-2xl font-bold text-foreground">{mutation.data.predicted_production_tonnes} Tonnes</p>
            </div>
          )}
          {mutation.isError && (
             <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
              <h4 className="font-semibold text-destructive">Error</h4>
              <p className="text-sm text-foreground">{mutation.error.message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YieldPrediction;