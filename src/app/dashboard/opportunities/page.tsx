"use client";

import { useEffect, useState } from "react";
import { JobCard } from "@/components/dashboard/job-card";
import { fetchJobs } from "@/lib/firebase/firestore";
import type { Job } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      try {
        const jobs = await fetchJobs();
        setOpportunities(jobs);
      } catch (error) {
        console.error("Error fetching job opportunities:", error);
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Job Opportunities</h1>
        <p className="text-muted-foreground">Browse and apply for jobs available in your area.</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search by postcode, job type..." className="pl-10" />
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[280px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {opportunities.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No Opportunities Available</h2>
          <p className="text-muted-foreground">Please check back later for new job postings.</p>
        </div>
      )}
    </div>
  );
}
