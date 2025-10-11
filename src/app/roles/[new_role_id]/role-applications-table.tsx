"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { RoleApplicationData } from "@/db/new-role-service";

interface RoleApplicationsTableProps {
  applicants: RoleApplicationData[];
  roleId: string;
  roleTitle: string;
}

type SortField = keyof Pick<
  RoleApplicationData,
  | "name"
  | "impactCommunication"
  | "skillRecency"
  | "yearsRelevantExp"
  | "totalExp"
  | "reviewer"
  | "status"
>;
type SortDirection = "asc" | "desc";

export default function RoleApplicationsTable({
  applicants,
  roleId,
  roleTitle,
}: RoleApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const router = useRouter();

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setFirst(0); // Reset to first page when sorting
  };

  // Sort function
  const sortApplicants = (applicants: RoleApplicationData[]) => {
    if (!sortField) return applicants;

    return [...applicants].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      let comparison = 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  // Filter applicants based on search term
  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply sorting to filtered applicants
  const sortedApplicants = sortApplicants(filteredApplicants);

  // Get current page applicants
  const currentApplicants = sortedApplicants.slice(first, first + rows);

  // Custom pagination logic
  const totalPages = Math.ceil(sortedApplicants.length / rows);
  const currentPage = Math.floor(first / rows) + 1;

  const goToPage = (page: number) => {
    setFirst((page - 1) * rows);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setFirst(first + rows);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setFirst(first - rows);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-500 text-white";
      case "Under Review":
        return "bg-blue-500 text-white";
      case "Pending":
        return "bg-orange-500 text-white";
      case "Rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg
          className="w-4 h-4 ml-1 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      );
    }

    if (sortDirection === "asc") {
      return (
        <svg
          className="w-4 h-4 ml-1 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-4 h-4 ml-1 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-full border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200 min-w-[150px]">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center hover:text-gray-700 transition-colors"
                  >
                    Name
                    {getSortIcon("name")}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200 min-w-[160px]">
                  <button
                    onClick={() => handleSort("impactCommunication")}
                    className="flex items-center hover:text-gray-700 transition-colors"
                  >
                    Impact Communication
                    {getSortIcon("impactCommunication")}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200 min-w-[120px]">
                  <button
                    onClick={() => handleSort("skillRecency")}
                    className="flex items-center hover:text-gray-700 transition-colors"
                  >
                    Skill Recency
                    {getSortIcon("skillRecency")}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200 min-w-[160px]">
                  <button
                    onClick={() => handleSort("yearsRelevantExp")}
                    className="flex items-center hover:text-gray-700 transition-colors"
                  >
                    Years of Relevant Exp
                    {getSortIcon("yearsRelevantExp")}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200 min-w-[100px]">
                  <button
                    onClick={() => handleSort("totalExp")}
                    className="flex items-center hover:text-gray-700 transition-colors"
                  >
                    Total Exp
                    {getSortIcon("totalExp")}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200 min-w-[120px]">
                  <button
                    onClick={() => handleSort("reviewer")}
                    className="flex items-center hover:text-gray-700 transition-colors"
                  >
                    Reviewer
                    {getSortIcon("reviewer")}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200 min-w-[120px]">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center hover:text-gray-700 transition-colors"
                  >
                    Status
                    {getSortIcon("status")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentApplicants.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-6 py-8 text-gray-500"
                  >
                    No applicants found
                  </td>
                </tr>
              ) : (
                currentApplicants.map((applicant, index) => (
                  <tr
                    key={applicant.id}
                    className={`group border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                    onClick={() => {
                      router.push(`/roles/${roleId}/${applicant.id}`);
                    }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        {applicant.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 group-hover:text-gray-900 transition-colors">
                      {applicant.impactCommunication}
                    </td>
                    <td className="px-6 py-4 text-gray-700 group-hover:text-gray-900 transition-colors">
                      {applicant.skillRecency}
                    </td>
                    <td className="px-6 py-4 text-gray-700 group-hover:text-gray-900 transition-colors">
                      {applicant.yearsRelevantExp}
                    </td>
                    <td className="px-6 py-4 text-gray-700 group-hover:text-gray-900 transition-colors">
                      {applicant.totalExp}
                    </td>
                    <td className="px-6 py-4 text-gray-700 group-hover:text-gray-900 transition-colors">
                      {applicant.reviewer}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-md ${getStatusBadge(applicant.status)}`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {first + 1} to{" "}
          {Math.min(first + rows, sortedApplicants.length)} of{" "}
          {sortedApplicants.length} entries
        </div>

        <div className="flex items-center gap-4">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={rows}
              onChange={(e) => {
                setRows(Number(e.target.value));
                setFirst(0); // Reset to first page when changing rows per page
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
