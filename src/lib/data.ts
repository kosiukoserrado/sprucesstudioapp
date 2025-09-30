import type { Job, Application } from './types';
import { LayoutDashboard, Briefcase, FileText, CalendarCheck } from 'lucide-react';


export const jobs: Job[] = [
  { id: 'job-1', title: 'Deep Clean for City Apartment', postcode: 'SW1A 0AA', dateTime: '2024-08-15 @ 9:00 AM', duration: '4 hours', pay: 120, description: 'Client requires a full deep clean of a 2-bedroom apartment, including oven and inside of windows.' },
  { id: 'job-2', title: 'Weekly Maintenance Clean', postcode: 'E1 6AN', dateTime: '2024-08-16 @ 1:00 PM', duration: '2 hours', pay: 50, description: 'Standard weekly cleaning for a small flat. Focus on kitchen and bathroom.' },
  { id: 'job-3', title: 'Move-Out Clean for Suburban House', postcode: 'NW1 5LS', dateTime: '2024-08-18 @ 8:00 AM', duration: '6 hours', pay: 180, description: 'Empty 3-bedroom house requires a top-to-bottom move-out clean.' },
  { id: 'job-4', title: 'Office Cleaning', postcode: 'SE1 9SG', dateTime: '2024-08-19 @ 6:00 PM', duration: '3 hours', pay: 90, description: 'Evening cleaning for a small office space. Includes vacuuming, trash removal, and sanitizing desks.' },
  { id: 'job-5', title: 'One-off Spring Clean', postcode: 'W2 2UH', dateTime: '2024-08-20 @ 10:00 AM', duration: '5 hours', pay: 150, description: 'A thorough spring cleaning for a family home before a party.' },
];

export const activeJob: Job | null = jobs[0];

export const applications: Application[] = [
  { id: 'app-1', jobId: 'job-2', dateApplied: '2024-08-10', status: 'Accepted' },
  { id: 'app-2', jobId: 'job-3', dateApplied: '2024-08-09', status: 'Pending' },
  { id: 'app-3', jobId: 'job-4', dateApplied: '2024-08-08', status: 'Pending' },
  { id: 'app-4', jobId: 'job-5', dateApplied: '2024-08-07', status: 'Rejected' },
];

export const opportunities: Job[] = jobs.slice(1); // Exclude the active job

export const getJobById = (id: string) => jobs.find(job => job.id === id);

export const dashboardNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/opportunities', label: 'Opportunities', icon: Briefcase },
    { href: '/dashboard/pursuing', label: 'My Applications', icon: FileText },
    { href: '/dashboard/schedule', label: 'My Schedule', icon: CalendarCheck },
];
