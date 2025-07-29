'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Coins, AlertCircle, BarChart3, Settings } from "lucide-react";

// Mobile navigation data
const MOBILE_NAV_ITEMS = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Token",
    icon: Coins,
    url: "/dashboard/token",
  },
  {
    title: "Feedback",
    icon: AlertCircle,
    url: "/dashboard/feedback",
  },
  {
    title: "Analysis",
    icon: BarChart3,
    url: "/dashboard/analysis",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
  },
];

type NavbarVariant = 'circle' | 'partial-fill' | 'underline' | 'dash' | 'pill';

interface MobileNavbarProps {
  variant?: NavbarVariant;
}

const MobileNavbar = ({ variant = 'underline' }: MobileNavbarProps) => {
  const pathname = usePathname();

  const getActiveIndicator = (isActive: boolean) => {
    if (!isActive) return null;

    switch (variant) {
      case 'circle':
        return (
          <div className="absolute -inset-2 bg-orange-100 rounded-full opacity-60" />
        );
      
      case 'partial-fill':
        return (
          <div className="absolute inset-0 bg-orange-500 rounded-sm opacity-30" />
        );
      
      case 'underline':
        return (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full" />
        );
      
      case 'dash':
        return (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-orange-500 rounded-full" />
        );
      
      case 'pill':
        return (
          <div className="absolute inset-0 bg-orange-50 rounded-lg -z-10" />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around px-2 py-3">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.url;
          
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 relative min-w-0 flex-1",
                isActive 
                  ? "text-orange-500" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {/* Icon container */}
              <div className="relative mb-1">
                <item.icon 
                  className={cn(
                    "w-6 h-6 transition-all duration-200",
                    isActive && "text-orange-500"
                  )} 
                />
                
                {/* Active indicator based on variant */}
                {getActiveIndicator(isActive)}
              </div>
              
              {/* Text label */}
              <span 
                className={cn(
                  "text-xs font-medium transition-colors duration-200 text-center leading-tight",
                  isActive ? "text-orange-500" : "text-gray-500"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar; 