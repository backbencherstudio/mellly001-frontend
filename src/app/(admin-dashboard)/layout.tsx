"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./dashboard/_components/sidebar";
import DashboardHeader from "./dashboard/_components/dashboard-header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setIsAuth(true);
    }
  }, []);


  if (isAuth === null) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
}
