
"use client";

import { useEffect, useState } from "react";
import { JobCard } from "@/components/dashboard/job-card";
import { fetchJobs } from "@/lib/firebase/firestore";
import type { Job } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Smile } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function CompletedJobsPage() {
  const { user } = useAuth();
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCompletedJobs = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const jobs = await fetchJobs("Completed");
        const userCompletedJobs = jobs.filter(job => job.assignedTo === user.uid);
        setCompletedJobs(userCompletedJobs);
      } catch (error) {
        console.error("Error fetching completed jobs:", error);
        setError("Failed to fetch your completed jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      getCompletedJobs();
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Completed Jobs</h1>
        <p className="text-muted-foreground">A record of all the jobs you've successfully completed.</p>
      </div>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[280px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : completedJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {completedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
          <Smile className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold">No Completed Jobs Yet</h2>
          <p className="text-muted-foreground">Once you complete jobs, they will appear here.</p>
        </div>
      )}
    </div>
  );
}
