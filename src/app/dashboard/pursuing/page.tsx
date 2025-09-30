"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchApplicationsByUserId, fetchJobById } from "@/lib/firebase/firestore";
import type { Application, Job } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

type ApplicationWithJob = {
  app: Application;
  job: Job | null;
};

export default function PursuingPage() {
  const { user } = useAuth();
  const [applicationsWithJobs, setApplicationsWithJobs] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const apps = await fetchApplicationsByUserId(user.uid);
        const appsWithJobs = await Promise.all(
          apps.map(async (app) => {
            const job = await fetchJobById(app.jobId);
            return { app, job };
          })
        );
        setApplicationsWithJobs(appsWithJobs);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
        getApplications();
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">Track the status of all your job applications.</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title / Reference</TableHead>
              <TableHead className="hidden md:table-cell">Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : (
              applicationsWithJobs.map(({ app, job }) => {
                const title = job?.jobTitle || app.jobTitle || 'Job not found';
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      <div className="font-semibold">{title}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{app.appliedAt}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{app.appliedAt}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === "Accepted"
                            ? "default"
                            : app.status === "Rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className={app.status === "Accepted" ? "bg-green-600/80 text-primary-foreground hover:bg-green-600" : ""}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Job Details</DropdownMenuItem>
                          {app.status === "Pending" && (
                             <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Withdraw Application</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {!loading && applicationsWithJobs.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No Applications Found</h2>
          <p className="text-muted-foreground">When you apply for jobs, they will appear here.</p>
        </div>
      )}
    </div>
  );
}
