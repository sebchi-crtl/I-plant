import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import DashboardLayoutChildren from "./dashboard-layout.children";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Eco Dryer Dashboard",
  description: "Eco Dryer Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={` ${poppins.variable} antialiased `}>
      <DashboardLayoutChildren>
        {children}
      </DashboardLayoutChildren>
    </div>
  );
}