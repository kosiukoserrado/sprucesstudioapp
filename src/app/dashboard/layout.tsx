"use client";

import Link from "next/link";
import { User, Bell, LifeBuoy, Loader2 } from "lucide-react";
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
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
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


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2" prefetch={false}>
            <LifeBuoy className="w-8 h-8 text-primary" />
            <h2 className="font-bold text-2xl text-foreground group-data-[collapsible=icon]:hidden">
              SprucesApp
            </h2>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="flex items-center gap-2">
           <Avatar className="group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.email || 'User'} />
              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
           <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm">{user.displayName || user.email}</span>
                <span className="text-xs text-sidebar-foreground/70">{user.email}</span>
           </div>
           <Button variant="ghost" size="icon" onClick={signOut} className="ml-auto group-data-[collapsible=icon]:hidden">
              <User className="h-5 w-5" />
           </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div>
            <SidebarTrigger className="md:hidden" />
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
