import type { Timestamp } from 'firebase/firestore';

export type JobStatus = "Open" | "Closed" | "In progress" | "Completed";
export type JobUrgency = "available" | "upcoming" | "urgent";

export type Job = {
  id: string;
  jobTitle: string;
  jobDescription: string;
  location: string;
  date: string;
  time: string;
  payment: number;
  adminStage: JobStatus; // For admin view
  cleanersNeeded?: number;
  areaM2?: number;
  assignedTo?: string; // Cleaner's user ID
  category?: string;
  duration?: string; // in days
  jobStatus?: JobUrgency; // For cleaner view
};

export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

export type Application = {
  id: string;
  jobId: string;
  userId: string; 
  appliedAt: string;
  status: ApplicationStatus;
  jobTitle?: string;
  userName?: string;
};

export type UserProfile = {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  postcode?: string;
  nationality?: string;
  proximity?: number;
  abn?: string;
  bsb?: string;
  accountNumber?: string;
  photoURL?: string;
};

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<void> {
  // Implementation will be in firestore.ts
}

    