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
import { applications, getJobById } from "@/lib/data";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PursuingPage() {
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
            {applications.map((app) => {
              const job = getJobById(app.jobId);
              if (!job) return null;
              return (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-xs text-muted-foreground md:hidden">{app.dateApplied}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{app.dateApplied}</TableCell>
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
            })}
          </TableBody>
        </Table>
      </div>
      {applications.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No Applications Found</h2>
          <p className="text-muted-foreground">When you apply for jobs, they will appear here.</p>
        </div>
      )}
    </div>
  );
}
