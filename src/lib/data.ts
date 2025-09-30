import { LayoutDashboard, Briefcase, FileText, CalendarCheck, Shield, User, CheckCircle } from 'lucide-react';

export const dashboardNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/opportunities', label: 'Opportunities', icon: Briefcase },
    { href: '/dashboard/pursuing', label: 'My Applications', icon: FileText },
    { href: '/dashboard/schedule', label: 'My Schedule', icon: CalendarCheck },
    { href: '/dashboard/completed-jobs', label: 'Completed Jobs', icon: CheckCircle },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
];

export const adminNavItems = [
    { href: '/admin/jobs', label: 'Job Management', icon: Briefcase },
    { href: '/admin/applications', label: 'Applications', icon: FileText },
];
