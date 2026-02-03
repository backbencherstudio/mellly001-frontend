"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarData } from "./Dashboard-sidebar";
import { LogOut } from "lucide-react";
import Image from "next/image";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    // 🔥 এই লাইনটাই magic
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
       
<div className="flex items-center gap-3 pb-10">
  {/* Logo Image – NEVER shrink */}
  <div className="shrink-1  ">
    <Image
      src="/assets/images/logo (2).png"
      width={47}
      height={40}
      alt="Logo"
      className="object-contain"
    />
  </div>

  {/* Text – hide when icon mode */}
  <div className="pt-1 group-data-[collapsible=icon]:hidden">
    <p className="text-[#101828] font-bold text-base">
      Admin Panel
    </p>
    <p className="mt-1 text-[12px] text-[#6A7282]">
      Maid Service
    </p>
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
          className="
            data-[active=true]:bg-[#F3FFF8]
            data-[active=true]:text-[#03652B]
            data-[active=true]:hover:bg-[#F3FFF8]
          "
        >
          <Link href={item.href}>
            <Icon
              className={`h-4 w-4 ${
                isActive ? "text-[#03652B] font-semibold " : "text-muted-foreground"
              }`}
            />
            <span className="text-base ">{item.name}</span>
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
              onClick={() => router.push("/login")}
              className="text-red-600"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
