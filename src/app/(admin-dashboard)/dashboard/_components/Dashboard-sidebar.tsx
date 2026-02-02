import {
  LayoutDashboard,
  Users,
  Brain,
  Settings,
  BriefcaseBusiness,
} from "lucide-react";

export interface SidebarDataType {
  id: number;
  name: string;
  href: string;
  icon: React.ElementType;
}

export const SidebarData: SidebarDataType[] = [
  {
    id: 1,
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    name: "Homeowners",
    href: "/dashboard/homeowners",
    icon: Users,
  },
  {
    id: 3,
    name: "Cleaners",
    href: "/dashboard/cleaners",
    icon: Brain,
  },
  {
    id: 4,
    name: "Bookings",
    href: "/dashboard/booking",
    icon: BriefcaseBusiness,
  },
    {
    id: 4,
    name: "Payments",
    href: "/dashboard/payments",
    icon: BriefcaseBusiness,
  },
  {
    id: 5,
    name: "Job Approvals",
    href: "/dashboard/jobAppruve",
    icon: Settings,
  },
];
