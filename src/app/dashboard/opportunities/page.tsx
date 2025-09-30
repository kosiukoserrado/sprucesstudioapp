import { JobCard } from "@/components/dashboard/job-card";
import { opportunities } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Job Opportunities</h1>
        <p className="text-muted-foreground">Browse and apply for jobs available in your area.</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search by postcode, job type..." className="pl-10" />
      </div>

      {opportunities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {opportunities.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No Opportunities Available</h2>
          <p className="text-muted-foreground">Please check back later for new job postings.</p>
        </div>
      )}
    </div>
  );
}
