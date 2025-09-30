import { LayoutDashboard, Briefcase, FileText, CalendarCheck, Shield } from 'lucide-react';

export const dashboardNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/opportunities', label: 'Opportunities', icon: Briefcase },
    { href: '/dashboard/pursuing', label: 'My Applications', icon: FileText },
    { href: '/dashboard/schedule', label: 'My Schedule', icon: CalendarCheck },
];

export const adminNavItems = [
    { href: '/admin/jobs', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/jobs', label: 'Job Management', icon: Briefcase },
    { href: '/admin/applications', label: 'Applications', icon: FileText },
];
