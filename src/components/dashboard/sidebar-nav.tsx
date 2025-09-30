"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavItems } from "@/lib/data";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

export function SidebarNav({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const isAdmin = userEmail === "kosiserrado@gmail.com";

  return (
    <SidebarMenu>
      {dashboardNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-sidebar-accent"
              )}
              isActive={pathname === item.href}
              tooltip={{ children: item.label }}
            >
              <item.icon className="mr-2 h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
      {isAdmin && (
        <>
        <SidebarSeparator />
        <SidebarMenuItem>
          <Link href="/admin/jobs">
            <SidebarMenuButton
              className={cn(
                "w-full justify-start",
                pathname.startsWith('/admin') && "bg-sidebar-accent"
              )}
              isActive={pathname.startsWith('/admin')}
              tooltip={{ children: "Admin" }}
            >
              <Shield className="mr-2 h-5 w-5" />
              <span>Admin</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        </>
      )}
    </SidebarMenu>
  );
}
