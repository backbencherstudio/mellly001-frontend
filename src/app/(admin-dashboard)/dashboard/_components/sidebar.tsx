"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarData } from "./Dashboard-sidebar";
import { LogOut } from "lucide-react";
import { disconnectSocket } from "@/lib/Socket";
import Image from "next/image";
import React from "react";

export default function DashboardSidebar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    disconnectSocket();
    Cookies.remove("token");
    Cookies.remove("userType");
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-3 pb-10">
            <div className="shrink-1">
              <Image
                src="/assets/images/logo (2).png"
                width={47}
                height={40}
                alt="Logo"
                className="object-contain"
              />
            </div>
            <div className="pt-1 group-data-[collapsible=icon]:hidden">
              <p className="text-[#101828] font-bold text-base">Admin Panel</p>
              <p className="mt-1 text-[12px] text-[#6A7282]">Cleaner Service</p>
            </div>
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {SidebarData.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="data-[active=true]:bg-[#F3FFF8] data-[active=true]:text-[#03652B] data-[active=true]:hover:bg-[#F3FFF8]"
                    >
                      <Link href={item.href}>
                        <Icon className={`h-4 w-4 ${isActive ? "text-[#03652B]" : "text-muted-foreground"}`} />
                        <span className="text-base">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpen(true)}
              className="text-red-600"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to logout?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    You will be signed out from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}