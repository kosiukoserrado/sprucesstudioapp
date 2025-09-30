import type { Timestamp } from 'firebase/firestore';

export type Job = {
  id: string;
  jobTitle: string;
  jobDescription: string;
  location: string;
  date: string;
  time: string;
  payment: number;
  status?: string;
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