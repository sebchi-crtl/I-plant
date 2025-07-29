'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Coins, AlertCircle, BarChart3, Settings } from "lucide-react";

const SimpleMobileNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Token", icon: Coins, url: "/dashboard/token" },
    { title: "Feedback", icon: AlertCircle, url: "/dashboard/feedback" },
    { title: "Analysis", icon: BarChart3, url: "/dashboard/analysis" },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '12px 8px',
      }}
      className="md:hidden"
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.url;
          
          return (
            <Link
              key={item.title}
              href={item.url}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? '#f97316' : '#6b7280',
                flex: 1,
                minWidth: 0,
              }}
            >
              <div style={{ marginBottom: '4px', position: 'relative' }}>
                <item.icon 
                  style={{
                    width: '24px',
                    height: '24px',
                    color: isActive ? '#f97316' : '#6b7280',
                  }}
                />
                {isActive && (
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '16px',
                      height: '2px',
                      backgroundColor: '#f97316',
                      borderRadius: '1px',
                    }}
                  />
                )}
              </div>
              
              <span 
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  textAlign: 'center',
                  lineHeight: '1.2',
                  color: isActive ? '#f97316' : '#6b7280',
                }}
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

export default SimpleMobileNavbar; 