"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/dashboard/job-card";
import { Clock, MapPin, Calendar, CircleDollarSign, Smile, Search } from "lucide-react";
import { fetchJobs, fetchApplicationsByUserId, fetchJobById } from "@/lib/firebase/firestore";
import type { Job, Application } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Job[]>([]);
  const [recentApplicationsWithJobs, setRecentApplicationsWithJobs] = useState<{app: Application, job: Job}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const allJobs = await fetchJobs();
        if (allJobs.length > 0) {
            setActiveJob(allJobs[0]);
            setOpportunities(allJobs.slice(1, 3)); 
        }
        
        const userApplications = await fetchApplicationsByUserId(user.uid);
        setApplications(userApplications);

        const recentApps = userApplications.slice(0, 3);
        const appsWithJobs = await Promise.all(
          recentApps.map(async (app) => {
            const job = await fetchJobById(app.jobId);
            return { app, job: job! };
          })
        );
        setRecentApplicationsWithJobs(appsWithJobs.filter(item => item.job));

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const pendingCount = applications.filter(a => a.status === 'Pending').length;

  return (
    <div className="grid gap-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Happening Now */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Happening Now</CardTitle>
            <CardDescription>Your current or next job.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                     <Skeleton className="h-10 w-full" />
                </div>
            ) : activeJob ? (
              <div className="grid gap-4">
                <h3 className="text-xl font-semibold">{activeJob.jobTitle}</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {activeJob.location}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {activeJob.date}</div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {activeJob.time}</div>
                    <div className="flex items-center gap-2 font-bold text-primary">
                        <CircleDollarSign className="h-4 w-4" /> 
                        £{typeof activeJob.payment === 'number' ? activeJob.payment.toFixed(2) : 'N/A'}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">{activeJob.jobDescription}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <Smile className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No active jobs right now.</h3>
                <p className="text-muted-foreground">Enjoy your break!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs I'm Pursuing */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs I'm Pursuing</CardTitle>
            <CardDescription>A summary of your applications.</CardDescription>
          </CardHeader>
          <CardContent>
             {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
             ) : applications.length > 0 ? (
                <div className="space-y-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-3xl font-bold">{pendingCount}</div>
                        <p className="text-sm text-muted-foreground">Applications Pending</p>
                    </div>
                    <ul className="space-y-2">
                        {recentApplicationsWithJobs.map(item => (
                             <li key={item.app.id} className="flex justify-between items-center text-sm">
                               <span>{item.job.jobTitle}</span>
                               <Badge variant={item.app.status === 'Accepted' ? 'default' : item.app.status === 'Rejected' ? 'destructive' : 'secondary'} className={item.app.status === 'Accepted' ? 'bg-green-600/80 text-white' : ''}>{item.app.status}</Badge>
                             </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-lg h-full">
                    <Search className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No applications yet. Find opportunities to get started!</p>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/pursuing">View All Applications</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-2xl font-bold">New Opportunities Nearby</h2>
          <Button asChild variant="link">
            <Link href="/dashboard/opportunities">View All</Link>
          </Button>
        </div>
        {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-56 w-full" />
                <Skeleton className="h-56 w-full" />
            </div>
        ) : opportunities.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {opportunities.map(job => <JobCard key={job.id} job={job} />)}
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-card">
                <Smile className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No new jobs in your area right now.</h3>
                <p className="text-muted-foreground">Check back soon for new opportunities!</p>
              </div>
        )}
      </div>
    </div>
  );
}
