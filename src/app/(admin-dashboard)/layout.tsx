"use client"
import Cookies from "js-cookie";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./dashboard/_components/sidebar";
import DashboardHeader from "./dashboard/_components/dashboard-header";
import { SidebarAutoClose } from "@/components/SidebarClose/SidebarAutoClose";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "lucide-react";
import StoreProviders from "@/redux/StoreProviders";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");

    } else {
      setChecked(true);
    }
  }, [router]);
  if (!checked) return null;





  return (
    <SidebarProvider>
      <StoreProviders>
        <SidebarAutoClose />

        <div className="flex min-h-screen w-full">
          <DashboardSidebar />

          <div className="flex flex-1 flex-col min-w-0">
            {/* Header */}
            <header className="flex h-25 items-center gap-4 border-b pr-5 pl-4">
              <SidebarTrigger />
              <DashboardHeader />
            </header>

            {/* Content */}
            <main className="flex-1 bg-muted/40 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </StoreProviders>

    </SidebarProvider >
  );
}
