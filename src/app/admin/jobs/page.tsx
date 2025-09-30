"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { fetchJobs } from "@/lib/firebase/firestore";
import type { Job } from "@/lib/types";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      try {
        const fetchedJobs = await fetchJobs(); // Fetches all jobs regardless of status
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, []);

    const getStatusVariant = (status: Job['status']) => {
        switch (status) {
            case 'Open':
                return 'secondary';
            case 'In progress':
                return 'default';
            case 'Completed':
                return 'outline';
            case 'Closed':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight">Job Management</h1>
            <p className="text-muted-foreground">Create, edit, and manage all job listings.</p>
        </div>
        <Button asChild>
            <Link href="/admin/jobs/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Job
            </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
               <TableHead className="hidden lg:table-cell">Payment</TableHead>
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
                   <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                   <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : (
              jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.jobTitle}</TableCell>
                    <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                     <TableCell className="hidden lg:table-cell">{job.date}</TableCell>
                     <TableCell className="hidden lg:table-cell">${job.payment.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(job.status)}>
                        {job.status}
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
                          <DropdownMenuItem asChild>
                             <Link href={`/admin/jobs/${job.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                           <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
      {!loading && jobs.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No Jobs Found</h2>
          <p className="text-muted-foreground">Create a new job to get started.</p>
        </div>
      )}
    </div>
  );
}
