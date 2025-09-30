"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCustomPlan } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  propertySize: z.string().min(1, "Please select property size"),
  typeOfCleaning: z.string().min(1, "Please select a cleaning type"),
  frequency: z.string().min(1, "Please select the frequency"),
  budget: z.string().min(1, "Please select your budget"),
  specificRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type PlanResult = {
  cleaningPlan: string;
  estimatedCost: string;
  estimatedDuration: string;
};

export function CustomPlanForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertySize: "",
      typeOfCleaning: "",
      frequency: "",
      budget: "",
      specificRequirements: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const plan = await getCustomPlan(values);
      setResult(plan);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: error instanceof Error ? error.message : "Could not generate plan.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Plan Details</CardTitle>
        <CardDescription>Fill out the form to get your instant plan and quote.</CardDescription>
      </CardHeader>
      <CardContent>
        {!result && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="propertySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Small (1-2 rooms)">Small (1-2 rooms)</SelectItem>
                          <SelectItem value="Medium (3-4 rooms)">Medium (3-4 rooms)</SelectItem>
                          <SelectItem value="Large (5+ rooms)">Large (5+ rooms)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="typeOfCleaning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Cleaning</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Standard Cleaning">Standard Cleaning</SelectItem>
                          <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                          <SelectItem value="Move-in/Move-out Cleaning">Move-in/Move-out</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="One-time">One-time</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Budget-friendly">Budget-friendly</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               </div>
              <FormField
                control={form.control}
                name="specificRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Requirements (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., eco-friendly products, focus on pet hair" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Plan
              </Button>
            </form>
          </Form>
        )}
        {isLoading && !result && (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Our AI is crafting your perfect plan...</p>
          </div>
        )}
        {result && (
          <div className="space-y-6">
            <h3 className="font-headline text-2xl font-bold">Your Custom Plan is Ready!</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Estimated Cost</h4>
                <p className="text-2xl font-bold text-primary">{result.estimatedCost}</p>
              </div>
              <div>
                <h4 className="font-semibold">Estimated Duration</h4>
                <p className="text-lg text-muted-foreground">{result.estimatedDuration}</p>
              </div>
              <div>
                <h4 className="font-semibold">Recommended Cleaning Plan</h4>
                <p className="text-sm whitespace-pre-wrap">{result.cleaningPlan}</p>
              </div>
            </div>
            <Button onClick={() => setResult(null)} variant="outline" className="w-full">
              Create a New Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
