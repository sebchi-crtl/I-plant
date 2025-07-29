'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Coins, AlertCircle, BarChart3, Settings } from "lucide-react";

export default function WorkingMobileNav() {
  const pathname = usePathname();

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Token", icon: Coins, url: "/dashboard/token" },
    { title: "Feedback", icon: AlertCircle, url: "/dashboard/feedback" },
    { title: "Analysis", icon: BarChart3, url: "/dashboard/analysis" },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      style={{ display: 'block' }}
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.url;
          
          return (
            <Link
              key={item.title}
              href={item.url}
              className={`flex flex-col items-center justify-center py-2 px-1 flex-1 min-w-0 ${
                isActive ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <div className="relative mb-1">
                <item.icon 
                  className={`w-6 h-6 ${
                    isActive ? 'text-orange-500' : 'text-gray-500'
                  }`}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium text-center ${
                isActive ? 'text-orange-500' : 'text-gray-500'
              }`}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 