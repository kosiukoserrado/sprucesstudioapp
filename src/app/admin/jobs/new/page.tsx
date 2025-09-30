"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { createJob } from "@/lib/firebase/firestore";
import type { JobStatus } from "@/lib/types";

const formSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  totalPay: z.coerce.number().min(0, "Payment must be a positive number"),
  paymentPerCleaner: z.coerce.number().optional(),
  status: z.enum(["Open", "Closed", "In progress", "Completed"]),
  cleanersNeeded: z.coerce.number().int().min(1, "At least one cleaner is needed"),
  areaM2: z.coerce.number().optional(),
  startDate: z.date({ required_error: "A start date is required." }),
  startTime: z.string().min(1, "Start time is required"),
});

type NewJobFormValues = z.infer<typeof formSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<NewJobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Open",
      cleanersNeeded: 1,
      startTime: "09:00",
    },
  });

  const onSubmit = async (values: NewJobFormValues) => {
    setLoading(true);
    try {
        await createJob(values);
        toast({
            title: "Job Created Successfully!",
            description: `The job "${values.jobTitle}" has been added.`,
        });
        router.push("/admin/jobs");
    } catch (error) {
        console.error("Failed to create job:", error);
        toast({
            variant: "destructive",
            title: "Error Creating Job",
            description: "An unexpected error occurred. Please try again.",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
                <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Create a New Job</h1>
                <p className="text-muted-foreground">Fill out the details below to post a new job listing.</p>
            </div>
             <Button variant="outline" asChild>
                <Link href="/admin/jobs">Cancel</Link>
            </Button>
       </div>
       
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Job Title / Project Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Post-Construction Clean at..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Brisbane" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>

                <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Job Description</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Provide a detailed description of the job requirements, scope, and any specific instructions."
                            className="resize-y min-h-[100px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="totalPay"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Total Payment ($)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="paymentPerCleaner"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Payment per Cleaner ($)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormDescription>Optional, for your reference.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="cleanersNeeded"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cleaners Needed</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                    format(field.value, "PPP")
                                    ) : (
                                    <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                                initialFocus
                                />
                            </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Status</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In progress">In progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
              
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Job
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
