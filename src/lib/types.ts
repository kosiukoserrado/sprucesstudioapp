import type { LucideIcon } from 'lucide-react';

export type Service = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tiers: {
    name: string;
    price: string;
    features: string[];
  }[];
  icon: LucideIcon;
  image: string;
};

export type Job = {
  id: string;
  title: string;
  postcode: string;
  dateTime: string;
  duration: string;
  pay: number;
  description: string;
};

export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

export type Application = {
  id: string;
  jobId: string;
  dateApplied: string;
  status: ApplicationStatus;
};
