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
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllApplications, fetchJobById } from "@/lib/firebase/firestore";
import type { Application, Job } from "@/lib/types";

type ApplicationWithJob = {
  app: Application;
  job: Job | null;
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      setLoading(true);
      try {
        const fetchedApplications = await fetchAllApplications();
        const applicationsWithJobs = await Promise.all(
          fetchedApplications.map(async (app) => {
            const job = await fetchJobById(app.jobId);
            return { app, job };
          })
        );
        setApplications(applicationsWithJobs);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    getApplications();
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Application Management</h1>
        <p className="text-muted-foreground">Review and manage all job applications from cleaners.</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead className="hidden md:table-cell">Applicant</TableHead>
              <TableHead className="hidden lg:table-cell">Date Applied</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : (
              applications.map(({ app, job }) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{job?.jobTitle || 'N/A'}</TableCell>
                  <TableCell className="hidden md:table-cell">{app.userName || 'N/A'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{app.appliedAt}</TableCell>
                  <TableCell>
                     <Badge variant={app.status === "Rejected" ? "destructive" : app.status === "Accepted" ? "default" : "secondary"}>
                        {app.status}
                      </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
       {!loading && applications.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No Applications Found</h2>
          <p className="text-muted-foreground">Cleaner applications will appear here once submitted.</p>
        </div>
      )}
    </div>
  );
}
