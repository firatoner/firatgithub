"use client";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />

      <SidebarContent>
        {loading ? (
          <div className="animate-pulse space-y-2 p-4">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ) : (
          <NavMain />
        )}
      </SidebarContent>

      <SidebarFooter>
        {!loading && user && <NavUser user={user} />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
