"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

interface NavigationItemProps {
  item: {
    icon: string;
    title: string;
    subtitle: string;
    role: string;
    href: string;
  };
  isCollapsed?: boolean;
}

export default function NavigationItem({
  item,
  isCollapsed = false,
}: NavigationItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname.includes(item.href) ||
    (pathname === "/" && item.href === "/dashboard");

  return (
    <li style={{ listStyle: "none" }}>
      <Link href={item.href} className="no-underline">
        <div
          className={clsx(
            "flex items-center rounded-xl p-3 cursor-pointer transition-all duration-150",
            isCollapsed ? "justify-center" : "gap-3",
            isActive
              ? "bg-blue-50 border border-blue-200"
              : "bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200"
          )}
          title={isCollapsed ? item.title : ""}
        >
          <i
            className={clsx(
              item.icon,
              "text-xl flex-shrink-0",
              isActive ? "text-blue-600" : "text-gray-500"
            )}
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span
                className={`text-base ${isActive ? "text-blue-600" : "text-gray-800 "}`}
              >
                {item.title}
              </span>
              <span
                className={`text-gray-600 text-sm ${isActive ? "" : "font-light"}`}
              >
                {item.subtitle}
              </span>
              <span className="text-blue-500 mt-1 text-xs">{item.role}</span>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}
