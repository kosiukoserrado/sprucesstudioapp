import type { LucideIcon } from 'lucide-react';

export type Job = {
  id: string;
  jobTitle: string;
  location: string;
  date: string;
  time: string;
  payment: number;
  jobDescription: string;
};

export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

export type Application = {
  id: string;
  jobId: string;
  userId: string; 
  appliedAt: string;
  status: ApplicationStatus;
  jobTitle?: string;
};
