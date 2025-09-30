import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/types";
import { MapPin, Calendar, CircleDollarSign, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const getJobStatusVariant = (status: Job['jobStatus']) => {
    switch (status) {
        case 'Urgent':
            return 'destructive';
        case 'Upcoming':
            return 'secondary';
        case 'Available':
        default:
            return 'outline';
    }
  };

  const getJobStatusIcon = (status: Job['jobStatus']) => {
    switch(status) {
      case 'Urgent':
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'Available':
      case 'Upcoming':
      default:
        return <CheckCircle className="h-4 w-4 mr-1" />;
    }
  }
  
  return (
    <Card className="flex flex-col justify-between bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">{job.jobTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Starts: {job.date}</span>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant={job.payment > 0 ? "secondary" : "outline"} className="bg-lime-200 text-lime-900">
                <CircleDollarSign className="h-4 w-4 mr-1" />
                {job.payment > 0 ? `$${job.payment.toFixed(2)}` : 'N/A'}
           </Badge>
        </div>
         {job.jobStatus && <div className="flex items-center gap-2">
             <Badge variant={getJobStatusVariant(job.jobStatus)} className={job.jobStatus === 'Available' ? "text-green-600 border-green-200 bg-green-50" : ""}>
                {getJobStatusIcon(job.jobStatus)}
                {job.jobStatus}
             </Badge>
        </div>}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/dashboard/opportunities/${job.id}`}>Details →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
