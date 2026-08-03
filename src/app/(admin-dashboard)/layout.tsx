"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Sidebar } from "lucide-react";
import { Toaster } from "sonner";

import DashboardHeader from "./dashboard/_components/dashboard-header";
import DashboardSidebar from "./dashboard/_components/sidebar";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { SidebarAutoClose } from "@/components/SidebarClose/SidebarAutoClose";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
        <SocketProvider>
          <SidebarAutoClose />

          <div className="flex min-h-screen w-full">
            <DashboardSidebar />

            <div className="flex flex-1 flex-col min-w-0">
              {/* Header */}
              <header className="flex h-25 sticky top-0 z-50 bg-white items-center gap-4 border-b pr-5 pl-4">
                <SidebarTrigger />
                <DashboardHeader />
              </header>

              {/* Content */}
              <main className="flex-1 bg-muted/40 p-6 overflow-auto">
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: "#008000",
                      color: "#fff",
                    },
                  }}
                />
                {children}
              </main>
            </div>
          </div>
        </SocketProvider>
      </StoreProviders>

    </SidebarProvider >
  );
}
