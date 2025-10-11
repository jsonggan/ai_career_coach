import type { Metadata } from "next";
import Image from "next/image";
import clsx from "clsx";
import Providers from "./providers";
import { Inter } from "next/font/google";
import NavigationItem from "@/components/navigation-item";
import { cookies } from "next/headers";
import { SidebarToggle } from "./sidebar-toggle";
import { ToastContainer } from "react-toastify";

import "primeicons/primeicons.css";
import "./globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

const navItems = [
  {
    icon: "pi pi-home",
    title: "Command Center",
    subtitle: "Overview and statistics",
    role: "HR Admin",
    href: "/dashboard",
  },
  {
    icon: "pi pi-file-edit",
    title: "Self Assessment",
    subtitle: "Complete your evaluation",
    role: "Employee",
    href: "/self-assessment",
  },
  {
    icon: "pi pi-comments",
    title: "Peer Assessment",
    subtitle: "360° colleague evaluation",
    role: "Peer",
    href: "/peer-assessment",
  },
  {
    icon: "pi pi-users",
    title: "Supervisor Review",
    subtitle: "Evaluate unit members",
    role: "Manager",
    href: "/supervisor-review",
  },
  {
    icon: "pi pi-sparkles",
    title: "Roles",
    subtitle: "Find the best candidates",
    role: "HR Admin",
    href: "/roles",
  },
];

export const metadata: Metadata = {
  title: "TalentForge",
  description: "Unlock your talent",
};

function Navigation({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <nav
      className={clsx(
        "hidden md:flex flex-col gap-2 bg-white p-3 h-screen overflow-y-auto transition-all duration-300",
        isCollapsed ? "w-20" : "w-[300px]"
      )}
    >
      <div className="flex flex-row items-center gap-2 pt-4">
        <Image
          alt="TalentForge"
          className="cursor-pointer flex-shrink-0"
          src="/logo.png"
          width={32}
          height={32}
        />
        {!isCollapsed && (
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-lg font-semibold">Defence Personnel</h3>
            <p className="text-sm text-gray-500">Assessment Management</p>
          </div>
        )}
        <SidebarToggle isCollapsed={isCollapsed} />
      </div>

      <div className="border-b border-gray-200 mt-4 mb-2"></div>

      <ul
        className="list-none p-0 m-0 flex flex-col gap-2"
        style={{ listStyle: "none" }}
      >
        {navItems.map((item) => (
          <NavigationItem
            key={item.title}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
      </ul>
      <div className="flex h-full"></div>

      <div className="border-b border-gray-200 mt-4 mb-2"></div>
      <a href="/profile">
        <div
          className={clsx(
            "flex items-center mb-4 hover:bg-gray-50 cursor-pointer px-4 py-2 rounded-md transition-all",
            isCollapsed ? "justify-center" : "flex-row gap-2"
          )}
          title={isCollapsed ? "COL Edward Lim" : ""}
        >
          <Image
            src="/avatar.png"
            alt="avatar"
            width={32}
            height={32}
            className="w-8"
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <h3 className="text-md">COL Edward Lim</h3>
              <p className="text-xs text-gray-500">
                Joint Task Force Commander
              </p>
            </div>
          )}
        </div>
      </a>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read sidebar state from cookie
  const cookieStore = cookies();
  const isCollapsed = cookieStore.get("sidebar-collapsed")?.value === "true";

  return (
    <Providers>
      <html lang="en" className="overflow-hidden" data-color-mode="light">
        <head>
          {/* <link id="theme-link" rel="stylesheet" href="/css/light-theme.css" /> */}
        </head>
        <body
          className={clsx(
            inter.className,
            "h-screen w-screen flex overflow-hidden"
          )}
        >
          <Navigation isCollapsed={isCollapsed} />
          <main className="flex-1 bg-gray-50 flex flex-col items-center h-screen pb-8 min-h-0 min-w-0 overflow-y-auto">
            {children}
            {/* <TeemoChat /> */}
            {/* <CreateProjectDialog /> */}
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </body>
      </html>
    </Providers>
  );
}
