'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Coins, AlertCircle, BarChart3, Settings } from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/lib/auth-context";

export default function WorkingMobileNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log('Signing out from mobile nav...');
      await signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Token", icon: Coins, url: "/dashboard/token" },
    { title: "Feedback", icon: AlertCircle, url: "/dashboard/feedback" },
    { title: "Analysis", icon: BarChart3, url: "/dashboard/analysis" },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
    { title: "Sign Out", icon: FaSignOutAlt, action: "signOut" },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      style={{ display: 'block' }}
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.url;
          
          // Handle action-based items (like Sign Out)
          if ("action" in item && item.action === "signOut") {
            return (
              <button
                key={item.title}
                onClick={handleSignOut}
                className="flex flex-col items-center justify-center py-2 px-1 flex-1 min-w-0 text-gray-500 hover:text-red-500"
              >
                <div className="relative mb-1">
                  <item.icon className="w-6 h-6 text-gray-500 hover:text-red-500" />
                </div>
                <span className="text-xs font-medium text-center text-gray-500 hover:text-red-500">
                  {item.title}
                </span>
              </button>
            );
          }
          
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