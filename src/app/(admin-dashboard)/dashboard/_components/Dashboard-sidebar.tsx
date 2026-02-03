import BookingIcon from "@/components/icon/BookingIcon";
import CleanerIcon from "@/components/icon/CleanersIcon";
import HomeWonerIcon from "@/components/icon/HomeWonerIcon";
import JobAppruvalIcon from "@/components/icon/JobAppruvalIcon";
import PaymentIcon from "@/components/icon/PaymentIcon";
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
    icon: HomeWonerIcon,
  },
  {
    id: 3,
    name: "Cleaners",
    href: "/dashboard/cleaners",
    icon: CleanerIcon,
  },
  {
    id: 4,
    name: "Bookings",
    href: "/dashboard/booking",
    icon: BookingIcon,
  },
    {
    id: 4,
    name: "Payments",
    href: "/dashboard/payments",
    icon: PaymentIcon,
  },
  {
    id: 5,
    name: "Job Approvals",
    href: "/dashboard/jobAppruve",
    icon: JobAppruvalIcon,
  },
];
