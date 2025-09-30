import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

export type Job = {
  id: string;
  jobTitle: string;
  jobDescription: string;
  location: string;
  startDate: Timestamp | Date | string; 
  payment: number;
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
