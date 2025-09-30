import Link from "next/link";
import { User, Bell, LifeBuoy } from "lucide-react";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2" prefetch={false}>
            <LifeBuoy className="w-8 h-8 text-primary" />
            <h2 className="font-bold text-2xl text-foreground group-data-[collapsible=icon]:hidden">
              CleanCo
            </h2>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="flex items-center gap-2">
           <Avatar className="group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10">
              <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" alt="Alex Doe" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
           <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm">Alex Doe</span>
                <span className="text-xs text-sidebar-foreground/70">alex.doe@example.com</span>
           </div>
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
              <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" alt="Alex Doe" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
