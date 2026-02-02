import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./dashboard/_components/sidebar";
import DashboardHeader from "./dashboard/_components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex h-25 items-center gap-4 border-b pr-5 pl-4">
            <SidebarTrigger />
            <DashboardHeader/>
          </header>

          {/* Content */}
          <main className="flex-1 bg-muted/40 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
