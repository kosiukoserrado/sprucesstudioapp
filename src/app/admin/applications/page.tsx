"use client";

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

export default function AdminApplicationsPage() {
  // This is a placeholder page.
  // In the future, we will fetch and display actual application data.
  const loading = true; 
  const applications = [
    { id: '1', jobTitle: 'Post-Construction Clean', applicant: 'John Doe', status: 'Pending', date: '2024-07-28' },
    { id: '2', jobTitle: 'Regular Office Maintenance', applicant: 'Jane Smith', status: 'Accepted', date: '2024-07-27' },
    { id: '3', jobTitle: 'Deep Clean for New Tenant', applicant: 'Alex Johnson', status: 'Rejected', date: '2024-07-26' },
  ];

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
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.jobTitle}</TableCell>
                  <TableCell className="hidden md:table-cell">{app.applicant}</TableCell>
                  <TableCell className="hidden lg:table-cell">{app.date}</TableCell>
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
