"use client";

import clsx from "clsx";
import { toggleSidebar } from "./actions";

interface SidebarToggleProps {
  isCollapsed: boolean;
}

export function SidebarToggle({ isCollapsed }: SidebarToggleProps) {
  const handleToggle = async () => {
    await toggleSidebar(!isCollapsed);
  };

  return (
    <button
      onClick={handleToggle}
      className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors"
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <i
        className={clsx(
          "pi text-gray-600 text-sm transition-transform duration-300",
          isCollapsed ? "pi-angle-right" : "pi-angle-left"
        )}
      />
    </button>
  );
}
