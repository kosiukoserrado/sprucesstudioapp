
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchJobById, applyForJob } from "@/lib/firebase/firestore";
import type { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, MapPin, Calendar, CircleDollarSign, AlertTriangle, ArrowLeft, Users, Briefcase, Layers, Maximize } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

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
            <CardContent className="space-y-8">
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                    <div>
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                           <div className="flex items-center gap-3"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-4 w-24" /></div>
                           <div className="flex items-center gap-3"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-4 w-24" /></div>
                        </div>
                    </div>
                     <div>
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                           <div className="flex items-center gap-3"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-4 w-24" /></div>
                           <div className="flex items-center gap-3"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-4 w-24" /></div>
                        </div>
                    </div>
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
        <CardHeader className="bg-muted/50 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    {job.jobStatus && <Badge variant={job.jobStatus === 'Urgent' ? 'destructive' : 'secondary'} className="mb-2">{job.jobStatus}</Badge>}
                    <CardTitle className="text-3xl font-headline">{job.jobTitle}</CardTitle>
                    {job.category && <CardDescription className="flex items-center gap-2 pt-2"><Layers className="w-4 h-4" />{job.category}</CardDescription>}
                </div>
                <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-lg bg-lime-100 border-lime-300 text-lime-900 py-2 px-4">
                        <CircleDollarSign className="h-5 w-5 mr-2" /> 
                        {job.payment > 0 ? `$${job.payment.toFixed(2)}` : 'N/A'}
                    </Badge>
                </div>
            </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
            <div>
                <h2 className="font-semibold text-xl mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary"/> Job Overview</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.jobDescription}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 pt-6 border-t">
                
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Location</h3>
                    <div className="text-muted-foreground grid gap-2">
                        <div className="flex items-start gap-3">
                            <span className="font-semibold text-foreground w-24">City:</span>
                            <span>{job.location}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                     <h3 className="font-semibold text-lg flex items-center gap-2"><Calendar className="w-5 h-5 text-primary"/> Schedule</h3>
                    <div className="text-muted-foreground grid gap-2">
                        <div className="flex items-start gap-3">
                            <span className="font-semibold text-foreground w-24">Date:</span>
                            <span>{job.date}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="font-semibold text-foreground w-24">Time:</span>
                            <span>{job.time}</span>
                        </div>
                         {job.duration && <div className="flex items-start gap-3">
                            <span className="font-semibold text-foreground w-24">Duration:</span>
                            <span>{job.duration} days</span>
                        </div>}
                    </div>
                </div>

                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Users className="w-5 h-5 text-primary"/> Team</h3>
                    <div className="text-muted-foreground grid gap-2">
                        <div className="flex items-start gap-3">
                            <span className="font-semibold text-foreground w-24">Cleaners:</span>
                            <span>{job.cleanersNeeded || 1} needed</span>
                        </div>
                    </div>
                </div>
                 {job.areaM2 && <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Maximize className="w-5 h-5 text-primary"/> Area</h3>
                    <div className="text-muted-foreground grid gap-2">
                        <div className="flex items-start gap-3">
                            <span className="font-semibold text-foreground w-24">Size:</span>
                            <span>{job.areaM2} m²</span>
                        </div>
                    </div>
                </div>}
            </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6">
          <Button size="lg" className="w-full text-base" onClick={handleApply} disabled={applying}>
            {applying ? 'Submitting Application...' : 'Apply for this Job'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
