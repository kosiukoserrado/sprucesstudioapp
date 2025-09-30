import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/types";
import { MapPin, Calendar, Clock, CircleDollarSign } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{job.postcode}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{job.dateTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{job.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-lg font-bold text-primary">
          <CircleDollarSign className="h-5 w-5" />
          <span>{typeof job.pay === 'number' ? job.pay.toFixed(2) : 'N/A'}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details & Apply</Button>
      </CardFooter>
    </Card>
  );
}
