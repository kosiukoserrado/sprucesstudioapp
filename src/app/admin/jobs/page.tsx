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
import { deleteJob, fetchJobs } from "@/lib/firebase/firestore";
import type { Job } from "@/lib/types";
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const loadJobs = async () => {
      setLoading(true);
      try {
        const fetchedJobs = await fetchJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load jobs." });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadJobs();
  }, []);
  
  const handleDeleteClick = (job: Job) => {
    setSelectedJob(job);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedJob) return;

    try {
      await deleteJob(selectedJob.id);
      toast({
        title: "Job Deleted",
        description: `The job "${selectedJob.jobTitle}" has been successfully deleted.`,
      });
      loadJobs(); // Refresh the list
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the job.",
      });
    } finally {
        setIsDeleteDialogOpen(false);
        setSelectedJob(null);
    }
  };


    const getAdminStageVariant = (adminStage: Job['adminStage']) => {
        switch (adminStage) {
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
    <>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
            <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Job Management</h1>
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
              <TableHead>Admin Stage</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-full max-w-xs" /></TableCell>
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
                    <TableCell className="font-medium">
                        <div className="font-semibold">{job.jobTitle}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{job.location}</div>
                        <div className="text-xs text-muted-foreground md:hidden mt-1">{job.date}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                     <TableCell className="hidden lg:table-cell">{job.date}</TableCell>
                     <TableCell className="hidden lg:table-cell">${job.payment.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getAdminStageVariant(job.adminStage)}>
                        {job.adminStage}
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
                          <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => handleDeleteClick(job)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                           </DropdownMenuItem>
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

     <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              <span className="font-semibold"> {selectedJob?.jobTitle} </span> 
              and all of its associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
