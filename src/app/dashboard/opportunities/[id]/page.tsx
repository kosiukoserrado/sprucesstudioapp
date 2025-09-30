"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchJobById, applyForJob } from "@/lib/firebase/firestore";
import type { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, MapPin, Calendar, CircleDollarSign, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
        setLoading(false);
        setError("No job ID provided.");
        return;
    };

    const getJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedJob = await fetchJobById(id);
        if (fetchedJob) {
          setJob(fetchedJob);
        } else {
          setError("Job not found.");
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to fetch job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getJob();
  }, [id]);

  const handleApply = async () => {
    if (!user || !job) return;
    setApplying(true);
    try {
        await applyForJob(job.id, user.uid, user.displayName || user.email || 'Anonymous', job.jobTitle);
        toast({
            title: "Application Sent!",
            description: `You've successfully applied for ${job?.jobTitle}.`,
        });
    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Application Failed",
            description: error.message || "There was a problem submitting your application.",
        });
    } finally {
        setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
         <div>
            <Skeleton className="h-10 w-48" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-2/3 mb-2" />
                <Skeleton className="h-24 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-12 w-full" />
            </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error} <Link href="/dashboard/opportunities" className="underline">Go back to opportunities</Link>.</AlertDescription>
      </Alert>
    );
  }

  if (!job) {
    return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Job could not be loaded. <Link href="/dashboard/opportunities" className="underline">Go back to opportunities</Link>.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
       <div>
        <Button variant="outline" asChild>
            <Link href="/dashboard/opportunities">← Back to Opportunities</Link>
        </Button>
       </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{job.jobTitle}</CardTitle>
          <CardDescription className="text-base pt-2">{job.jobDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-5 w-5" /> <span>{job.location}</span></div>
            <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-5 w-5" /> <span>{job.date}</span></div>
            <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-5 w-5" /> <span>{job.time}</span></div>
             <div className="flex items-center gap-2 font-bold text-primary text-lg">
                <CircleDollarSign className="h-6 w-6" /> 
                <span>£{job.payment > 0 ? job.payment.toFixed(2) : 'N/A'}</span>
            </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full" onClick={handleApply} disabled={applying}>
            {applying ? 'Applying...' : 'Apply for this Job'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
