"use client";

import Link from "next/link";
import { LogOut, Bell, Loader2, User } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  const getInitials = (email: string | null | undefined) => {
    if (!email) return "AD";
    return email.substring(0, 2).toUpperCase();
  };

  if (loading || !user) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check if the logged-in user's email matches the admin email.
  const isAdmin = user.email === 'kosiserrado@gmail.com';
  if (!isAdmin) {
    return (
        <div className="flex h-screen w-full items-center justify-center flex-col gap-4 p-4 text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p>You do not have permission to view this page.</p>
            <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
    )
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/admin" className="flex items-center gap-2" prefetch={false}>
            <h2 className="font-bold text-2xl text-sidebar-foreground group-data-[collapsible=icon]:hidden font-headline">
              spruces.
            </h2>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <AdminSidebarNav />
        </SidebarContent>
        <SidebarFooter className="flex items-center gap-2">
           <Avatar className="group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.email || 'Admin'} />
              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
           <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm">{user.displayName || user.email}</span>
                <span className="text-xs text-sidebar-foreground/70">Administrator</span>
           </div>
           <Button variant="ghost" size="icon" onClick={signOut} className="ml-auto group-data-[collapsible=icon]:hidden">
              <LogOut className="h-5 w-5" />
           </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard"><User className="mr-2 h-4 w-4" />Switch to Cleaner View</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
             <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.email || 'User'} />
              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
