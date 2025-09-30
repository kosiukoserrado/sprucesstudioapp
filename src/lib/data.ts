import { LayoutDashboard, Briefcase, FileText, CalendarCheck } from 'lucide-react';

export const dashboardNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/opportunities', label: 'Opportunities', icon: Briefcase },
    { href: '/dashboard/pursuing', label: 'My Applications', icon: FileText },
    { href: '/dashboard/schedule', label: 'My Schedule', icon: CalendarCheck },
];
