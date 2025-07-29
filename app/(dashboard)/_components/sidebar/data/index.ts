// import * as Icons from "../icons";
import { HomeIcon, Layers2, ReceiptPoundSterling, Settings, Users2 } from 'lucide-react';
import { TbChecklist } from "react-icons/tb";
import { FaSignOutAlt } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  LayoutDashboard, 
  Coins, 
  AlertCircle, 
  BarChart3, 
  ChevronLeft,
  TrendingUp,
  Users,
  UserPlus,
  TrendingDown,
  FileText,
  Search,
  ChevronDown,
  MoreVertical,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

export const NAV_DATA = [
  {
    label: "",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
        items: [
        ],
      },
      {
        title: "Token",
        url: "/dashboard/token",
        icon: Coins,
        items: [
        ],
      },
      {
        title: "Feedback",
        url: "/dashboard/feedback",
        icon: AlertCircle,
        items: [
        ],
      },
      {
        title: "Analysis",
        url: "/dashboard/analysis",
        icon: BarChart3,
        items: [
        ],
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings ,
        items: [
        ],
      },
      {
        title: "Sign Out",
        url: "/dashboard/logout",
        icon: FaSignOutAlt,
        items: [
        ],
      },
    ],
  },
  // {
  //   label: "OTHERS",
  //   items: [
  //     {
  //       title: "Charts",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Basic Chart",
  //           url: "/charts/basic-chart",
  //         },
  //       ],
  //     },
  //     {
  //       title: "UI Elements",
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: "Alerts",
  //           url: "/ui-elements/alerts",
  //         },
  //         {
  //           title: "Buttons",
  //           url: "/ui-elements/buttons",
  //         },
  //       ],
  //     },
  //     // {
  //     //   title: "Authentication",
  //     //   icon: Icons.Authentication,
  //     //   items: [
  //     //     {
  //     //       title: "Sign In",
  //     //       url: "/auth/sign-in",
  //     //     },
  //     //   ],
  //     // },
  //   ],
  // },
];
