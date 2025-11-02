import Image from "next/image";
import clsx from "clsx";
import NavigationItem from "@/components/navigation-item";
import { cookies } from "next/headers";
import { SidebarToggle } from "../sidebar-toggle";

const studentNavItems = [
  {
    icon: "pi pi-book",
    title: "Courses, Major & Career",
    subtitle: "Academic planning & tracking",
    role: "Student",
    href: "/student/academy-track",
  },
  {
    icon: "pi pi-upload",
    title: "Upload Portfolio",
    subtitle: "Certificates, courses & projects",
    role: "Student",
    href: "/student/upload-portfolio",
  },
  {
    icon: "pi pi-users",
    title: "Peer Review",
    subtitle: "Review and get reviewed by peers",
    role: "Student",
    href: "/student/peer-review",
  },
  {
    icon: "pi pi-chart-line",
    title: "Skill Competency",
    subtitle: "Track your skills & progress",
    role: "Student",
    href: "/student/skill-competency",
  },
  {
    icon: "pi pi-comments",
    title: "Community",
    subtitle: "Get advice on professors & courses",
    role: "Student",
    href: "/student/community",
  },
];

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
          alt="AI Career Coach"
          className="cursor-pointer flex-shrink-0 p-1"
          src="/logo.png"
          width={32}
          height={32}
        />
        {!isCollapsed && (
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-lg font-semibold">Pathly</h3>
            <p className="text-sm text-gray-500">AI Career Coach</p>
          </div>
        )}
        <SidebarToggle isCollapsed={isCollapsed} />
      </div>

      <div className="border-b border-gray-200 mt-4 mb-2"></div>

      <ul
        className="list-none p-0 m-0 flex flex-col gap-4"
        style={{ listStyle: "none" }}
      >
        {studentNavItems.map((item) => (
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
          title={isCollapsed ? "Andrew Ng" : ""}
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
              <h3 className="text-md">Andrew Ng</h3>
              <p className="text-xs text-gray-500">Student Profile</p>
            </div>
          )}
        </div>
      </a>
    </nav>
  );
}

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const isCollapsed = cookieStore.get("sidebar-collapsed")?.value === "true";

  return (
    <>
      <Navigation isCollapsed={isCollapsed} />
      <main className="flex-1 bg-gray-50 flex flex-col items-center h-screen pb-8 min-h-0 min-w-0 overflow-y-auto">
        {children}
      </main>
    </>
  );
}
