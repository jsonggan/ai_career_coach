import { ReactNode } from "react";
import SupervisorBanner from "./supervisor-banner";
import EmployeeSelector from "../employee-selector";
import { UserData } from "@/db/user-service";

interface SupervisorLayoutProps {
  children: ReactNode;
  showEmployeeSelector?: boolean;
  employees: UserData[];
}

export default function SupervisorLayout({
  children,
  showEmployeeSelector = true,
  employees,
}: SupervisorLayoutProps) {
  return (
    <div
      className="flex flex-col w-full px-16 py-8"
      style={{ maxWidth: "1200px" }}
    >
      {/* Supervisor Banner */}
      <SupervisorBanner />

      {/* Header Section */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Supervisor Review
        </h1>
        <p className="text-gray-600 m-0">
          Complete the performance evaluation for your unit personnel
        </p>
      </div>

      {/* Employee Selector (if enabled) */}
      {showEmployeeSelector && <EmployeeSelector className="mb-8" employees={employees} />}

      {/* Content */}
      {children}
    </div>
  );
}
