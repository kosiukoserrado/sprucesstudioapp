"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchJobById, applyForJob } from "@/lib/firebase/firestore";
import type { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, MapPin, Calendar, CircleDollarSign, AlertTriangle, ArrowLeft } from "lucide-react";
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
      <div className="space-y-6">
         <div className="flex">
             <Button variant="outline" asChild>
                <Link href="/dashboard/opportunities"><ArrowLeft className="mr-2 h-4 w-4" />Back to Opportunities</Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-5 w-1/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-4 w-24" /></div>
                    <div className="flex items-center gap-2"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-4 w-24" /></div>
                    <div className="flex items-center gap-2"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-4 w-24" /></div>
                    <div className="flex items-center gap-2"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-4 w-24" /></div>
                </div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-12 w-full rounded-md" />
            </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
       <div className="space-y-4">
        <Button variant="outline" asChild>
            <Link href="/dashboard/opportunities"><ArrowLeft className="mr-2 h-4 w-4" />Back to Opportunities</Link>
        </Button>
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-4">
         <Button variant="outline" asChild>
            <Link href="/dashboard/opportunities"><ArrowLeft className="mr-2 h-4 w-4" />Back to Opportunities</Link>
        </Button>
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Job Not Found</AlertTitle>
            <AlertDescription>The job you are looking for does not exist or has been removed.</AlertDescription>
        </Alert>
       </div>
    );
  }

  return (
    <div className="space-y-6">
       <div>
        <Button variant="outline" asChild>
            <Link href="/dashboard/opportunities"><ArrowLeft className="mr-2 h-4 w-4" />Back to Opportunities</Link>
        </Button>
       </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-3xl font-headline">{job.jobTitle}</CardTitle>
          <CardDescription>Job ID: {job.id}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
            <p className="text-muted-foreground leading-relaxed">{job.jobDescription}</p>

            <div className="grid gap-6 md:grid-cols-2 text-muted-foreground pt-6 border-t">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-1 shrink-0" /> 
                    <div>
                        <span className="font-semibold text-foreground">Location</span>
                        <p>{job.location}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 mt-1 shrink-0" /> 
                    <div>
                        <span className="font-semibold text-foreground">Date</span>
                        <p>{job.date}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 mt-1 shrink-0" /> 
                    <div>
                        <span className="font-semibold text-foreground">Time</span>
                        <p>{job.time}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <CircleDollarSign className="h-5 w-5 mt-1 shrink-0 text-primary" /> 
                    <div>
                        <span className="font-semibold text-foreground">Total Payment</span>
                        <p className="font-bold text-primary text-lg">{job.payment > 0 ? `£${job.payment.toFixed(2)}` : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6">
          <Button size="lg" className="w-full" onClick={handleApply} disabled={applying}>
            {applying ? 'Applying...' : 'Apply for this Job'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    