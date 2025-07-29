'use client'
import Sidebar from "./_components/sidebar/sidebar";
import MobileNavbar from "./_components/sidebar/mobile-navbar";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";


export default function DashboardLayoutChildren({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  return (
    <div className="flex bg-white min-h-screen w-full" style={{fontFamily: 'var(--font-poppins)'}}>
    
      {/* Foreground Content */}
      <div className="flex flex-1 z-10">
        {/* Sidebar - Only show on desktop */}
        <div className="hidden md:block pl-16">
          <Sidebar />
        </div>
    
        <div className="flex-1 mt-6 w-full flex items-center justify-center ">
          {/* {pathname} */}
          <div className="my-12 p-4 pb-20 md:pb-4 w-full max-w-7xl">{children}</div>
        </div>
      </div>
      
      {/* Mobile Navigation Bar */}
      <MobileNavbar />
    </div>
  );
}
