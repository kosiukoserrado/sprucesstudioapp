import type { Timestamp } from 'firebase/firestore';

export type JobStatus = "Open" | "Closed" | "In progress" | "Completed";

export type Job = {
  id: string;
  jobTitle: string;
  jobDescription: string;
  location: string;
  date: string;
  time: string;
  payment: number;
  status: JobStatus;
  cleanersNeeded?: number;
  assignedTo?: string; // Cleaner's user ID
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
