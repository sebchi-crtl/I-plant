'use client';

import { usePathname } from "next/navigation";
import { useSidebarContext } from "./sidebar-context";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_DATA } from "./data";
import { MenuItem } from "./menu-item";
import { ChevronLeft, ChevronUp, UserIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import WorkingMobileNav from "./working-mobile-nav";

const Sidebar = () => {
  const pathname = usePathname();
  const { isMobile } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Show mobile navbar on mobile devices
  if (isMobile) {
    return <WorkingMobileNav />;
  }

  // Show desktop sidebar on desktop devices
  return (
    <aside 
      style={{ fontFamily: 'var(--font-poppins)' }}
      className={cn(
        "relative text-gray-800 bg-[#131416] py-6 space-y-4 rounded-[2rem] my-20 transition-[width] duration-200 ease-linear sticky top-20 h-[85vh]",
        collapsed ? "w-[80px]" : "w-[290px]",
      )}
      aria-label="Main navigation"
    >
      
      
      <div className="flex h-full flex-col py-4">
        <div className="relative p-4.5 flex items-center justify-between">
          {!collapsed && (
            <Link
              href={"/"}
              className="px-6 font-semibold text-neutral-50 dark:text-gray-200 text-2xl py-2.5 min-[850px]:py-0"
            >
              Welcome!
            </Link>
          )}

          <button
            onClick={toggleCollapsed}
            className={cn(
              "rounded-xl p-2 text-green-200 hover:text-green-500 absolute -right-6 bg-neutral-900 z-10",
              collapsed && "mx-auto",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("size-6 text-center transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* User Profile */}
        {!collapsed && (
          <div className="flex flex-col items-center space-x-3 my-8 gap-4">
            <Avatar className="h-20 min-lg:h-34 w-20 min-lg:w-34">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback className="bg-[#DEF4C6]">
                <UserIcon className="size-26 text-[#B1CF5F]" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="font-semibold text-neutral-50">Farmer Dawn</p>
              <Button size="sm" className="text-xs text-green-200 border border-[#B1CF5F] hover:text-white py-1 px-4 rounded-full h-auto">
                Edit
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="custom-scrollbar mt-4 flex-1 overflow-y-auto px-5 min-[850px]:mt-5">
          {NAV_DATA.map((section) => (
            <div key={section.label} className="mb-6">
              {!collapsed && (
                <h2 className="mb-4 text-sm font-medium text-neutral-100">
                  {section.label}
                </h2>
              )}

              <nav role="navigation" aria-label={section.label}>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      {item.items && item.items.length ? (
                        <div>
                          <MenuItem
                            isActive={item.items.some(
                              ({ url }) => url === pathname,
                            )}
                            onClick={() => !collapsed && toggleExpanded(item.title)}
                            className={cn(collapsed && "justify-center px-2")}
                          >
                            <item.icon
                              className="size-6 shrink-0"
                              aria-hidden="true"
                            />

                            {!collapsed && (
                              <>
                                <span>{item.title}</span>
                                <ChevronUp
                                  className={cn(
                                    "ml-auto rotate-180 transition-transform duration-200",
                                    expandedItems.includes(item.title) && "rotate-0",
                                  )}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </MenuItem>
                        </div>
                      ) : (
                        (() => {
                          const href = "url" in item ? item.url + "" : "/" + "";

                          return (
                            <MenuItem
                              className={cn("flex items-center gap-3 py-3", collapsed && "justify-center px-3")}
                              as="link"
                              href={href}
                              isActive={pathname === href}
                            >
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />
                              {!collapsed && <span>{item.title}</span>}
                            </MenuItem>
                          );
                        })()
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;