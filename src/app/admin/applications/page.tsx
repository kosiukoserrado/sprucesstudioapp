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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllApplications, updateApplicationStatus, fetchJobs } from "@/lib/firebase/firestore";
import type { Application, Job, ApplicationStatus } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GroupedApplications = {
  [jobId: string]: {
    job: Job;
    applications: Application[];
  };
};

export default function AdminApplicationsPage() {
  const [groupedApplications, setGroupedApplications] = useState<GroupedApplications>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const jobs = await fetchJobs();
      const applications = await fetchAllApplications();

      const grouped: GroupedApplications = {};

      jobs.forEach((job) => {
        grouped[job.id] = {
          job,
          applications: [],
        };
      });

      applications.forEach((app) => {
        if (grouped[app.jobId]) {
          grouped[app.jobId].applications.push(app);
        }
      });

      // Filter out jobs with no applications
      Object.keys(grouped).forEach((jobId) => {
        if (grouped[jobId].applications.length === 0) {
          delete grouped[jobId];
        }
      });
      
      setGroupedApplications(grouped);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load applications." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  
  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    try {
        await updateApplicationStatus(applicationId, status);
        toast({
            title: "Status Updated",
            description: `The application status has been changed to ${status}.`
        });
        // Refresh data to show updated status
        loadData();
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update the application status.",
        });
    }
  }


  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Application Management</h1>
        <p className="text-muted-foreground">Review and manage job applications from cleaners for each job.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : Object.keys(groupedApplications).length > 0 ? (
        <Accordion type="multiple" className="w-full space-y-4">
          {Object.values(groupedApplications).map(({ job, applications }) => (
            <AccordionItem value={job.id} key={job.id} className="border-b-0">
                <AccordionTrigger className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-4 font-medium text-left bg-card border rounded-lg hover:no-underline hover:bg-muted/50 [&[data-state=open]]:rounded-b-none text-base">
                   <div className="flex items-center gap-4 mb-2 md:mb-0">
                     <span className="font-semibold">{job.jobTitle}</span>
                     <Badge variant="outline">{job.status}</Badge>
                   </div>
                   <span className="text-sm text-muted-foreground md:text-base">{applications.length} Applicant(s)</span>
                </AccordionTrigger>
              <AccordionContent className="p-0 border border-t-0 rounded-lg rounded-t-none">
                 <div className="border-t">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead className="hidden md:table-cell">Date Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell className="font-medium">
                                <div className="font-semibold">{app.userName || 'N/A'}</div>
                                <div className="text-xs text-muted-foreground md:hidden">{app.appliedAt}</div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{app.appliedAt}</TableCell>
                            <TableCell>
                                <Badge variant={app.status === "Rejected" ? "destructive" : app.status === "Accepted" ? "default" : "secondary"}>
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
                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'Accepted')}>Accept</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'Rejected')} className="text-destructive focus:text-destructive">Reject</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'Pending')}>Set to Pending</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No Applications Found</h2>
          <p className="text-muted-foreground">Cleaner applications will appear here once submitted.</p>
        </div>
      )}
    </div>
  );
}
