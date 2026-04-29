"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarAutoClose() {
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();

    useEffect(() => {
        // Route change holei mobile sidebar close hoye jay.
        // `useIsMobile()` mount/navigation time e briefly false-as te pare,
        // tai condition na kore always close korai safest.
        setOpenMobile(false);
    }, [pathname, setOpenMobile]);

    return null;
}