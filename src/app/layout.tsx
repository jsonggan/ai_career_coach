import type { Metadata } from "next";
import Image from "next/image";
import clsx from "clsx";
import Providers from "./providers";
import { Inter } from "next/font/google";
import NavigationItem from "@/components/navigation-item";
import { cookies } from "next/headers";
import { SidebarToggle } from "./sidebar-toggle";
import { ModeSelector } from "./mode-selector";
import { ToastContainer } from "react-toastify";

import "primeicons/primeicons.css";
import "./globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

// Navigation items for both modes
const commonNavItems = [
  {
    icon: "pi pi-chart-line",
    title: "Skill Competency",
    subtitle: "Track your skills & progress",
    role: "All",
    href: "/skills",
  },
  {
    icon: "pi pi-upload",
    title: "Upload Portfolio",
    subtitle: "Certificates, courses & projects",
    role: "All",
    href: "/portfolio",
  },
];

// Navigation items specific to students
const studentNavItems = [
  {
    icon: "pi pi-book",
    title: "Courses & Major",
    subtitle: "Academic planning & tracking",
    role: "Student",
    href: "/courses",
  },
  {
    icon: "pi pi-map",
    title: "Academic Track",
    subtitle: "Plan your learning path",
    role: "Student",
    href: "/track",
  },
  {
    icon: "pi pi-users",
    title: "Academic Community",
    subtitle: "Get advice on professors & courses",
    role: "Student",
    href: "/academic-community",
  },
];

// Navigation items specific to working professionals
const professionalNavItems = [
  {
    icon: "pi pi-star",
    title: "Rank & Tier",
    subtitle: "Current position & level",
    role: "Professional",
    href: "/rank",
  },
  {
    icon: "pi pi-arrow-up",
    title: "Career Advancement",
    subtitle: "How to get promoted",
    role: "Professional",
    href: "/advancement",
  },
  {
    icon: "pi pi-comments",
    title: "Career Community",
    subtitle: "Professional advice & networking",
    role: "Professional",
    href: "/career-community",
  },
];

export const metadata: Metadata = {
  title: "AI Career Coach",
  description: "Your intelligent career development companion",
};

function Navigation({ isCollapsed, userMode }: { isCollapsed: boolean; userMode: 'student' | 'working-professional' }) {
  // Get navigation items based on user mode
  const getNavItems = () => {
    const baseItems = [...commonNavItems];
    
    if (userMode === 'student') {
      return [...baseItems, ...studentNavItems];
    } else {
      return [...baseItems, ...professionalNavItems];
    }
  };

  const navItems = getNavItems();

  return (
    <nav
      className={clsx(
        "hidden md:flex flex-col gap-2 bg-white p-3 h-screen overflow-y-auto transition-all duration-300",
        isCollapsed ? "w-20" : "w-[300px]"
      )}
    >
      <div className="flex flex-row items-center gap-2 pt-4">
        <Image
          alt="AI Career Coach"
          className="cursor-pointer flex-shrink-0 p-1"
          src="/logo.png"
          width={32}
          height={32}
        />
        {!isCollapsed && (
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-lg font-semibold">AI Career Coach</h3>
            <p className="text-sm text-gray-500">Your Development Partner</p>
          </div>
        )}
        <SidebarToggle isCollapsed={isCollapsed} />
      </div>

      <div className="border-b border-gray-200 mt-4 mb-2"></div>
      
      {/* Mode Selector */}
      <div className="mb-4">
        <ModeSelector currentMode={userMode} isCollapsed={isCollapsed} />
      </div>

      <div className="border-b border-gray-200 mb-2"></div>

      <ul
        className="list-none p-0 m-0 flex flex-col gap-4"
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
          title={isCollapsed ? "Your Profile" : ""}
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
              <h3 className="text-md">Your Profile</h3>
              <p className="text-xs text-gray-500">
                {userMode === 'student' ? 'Student Profile' : 'Professional Profile'}
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
  
  // Read user mode from cookie, default to student
  const userMode = (cookieStore.get("user-mode")?.value as 'student' | 'working-professional') || 'student';

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
          <Navigation isCollapsed={isCollapsed} userMode={userMode} />
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
