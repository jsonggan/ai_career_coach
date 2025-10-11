"use client";

import { useState } from "react";
import { UserData } from "@/db/user-service";

type Props = {
  className?: string;
  employees: UserData[];
};
function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  return initials || "?";
}


export default function EmployeeSelector({ className, employees }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Employee to Review
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full max-w-xl flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-left text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <span className="text-gray-500">Select an employee...</span>
          <i className="pi pi-chevron-down text-gray-500 ml-2" />
        </button>

        {open && (
          <div className="absolute z-10 mt-2 w-full max-w-xl bg-white border border-gray-200 rounded-md shadow-lg">
            <ul className="max-h-72 overflow-y-auto py-1">
              {employees.map((e) => (
                <li key={e.userId}>
                  <a
                    href={`/supervisor-review/${e.userId}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-sm text-gray-900"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                      {getInitials(e.rank + " " + e.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{e.rank + " " + e.name}</span>
                      <span className="text-gray-600 text-xs">
                        {e.jobRole}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
