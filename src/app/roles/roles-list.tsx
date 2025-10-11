"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";

import { RoleData } from "@/db/new-role-service";
import { CreateRoleModal } from "./create-role-modal";

interface RolesListProps {
  roles: RoleData[];
}

interface RoleFormData {
  title: string;
  description: string;
  skills: string[];
  yearsOfExperience: string;
  department: string;
}

export default function RolesList({ roles }: RolesListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current page roles
  const currentRoles = filteredRoles.slice(first, first + rows);

  const handleCreateRole = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleModalNext = (roleData: RoleFormData) => {
    console.log("Create role with data:", roleData);
    setIsCreateModalOpen(false);
    // Refresh the page to show new role
    router.refresh();
  };

  const handleRoleClick = (roleId: string) => {
    router.push(`/roles/${roleId}`);
  };

  // Custom pagination logic
  const totalPages = Math.ceil(filteredRoles.length / rows);
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

  return (
    <div className="">
      {/* Search and Create Button */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <span className="p-input-icon-left">
            <i className="pi pi-search pl-2" />
            <InputText
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-[#2663EB] focus:ring-1 focus:outline-none"
            />
          </span>
        </div>

        <Button
          label="Create New Role"
          icon="pi pi-plus"
          className="bg-[#2663EB] text-white gap-2 px-4 py-2 rounded-md"
          onClick={handleCreateRole}
        />
      </div>

      {/* Custom Roles Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200">
                  No. of Employees
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium border-b border-gray-200">
                  Year
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center px-6 py-8 text-gray-500"
                  >
                    No roles found
                  </td>
                </tr>
              ) : (
                currentRoles.map((role, index) => (
                  <tr
                    key={role.id}
                    onClick={() => handleRoleClick(role.id)}
                    className={`group border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        {role.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 group-hover:text-gray-900 transition-colors">
                      {role.candidates}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        value={role.active ? "Active" : "Inactive"}
                        severity={role.active ? "success" : "danger"}
                        className={`text-white px-2 py-1 text-xs rounded-md 
                          ${role.active ? "bg-green-500" : "bg-red-500"}`}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-700 group-hover:text-gray-900 transition-colors">
                      {role.year}
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
          Showing {first + 1} to {Math.min(first + rows, filteredRoles.length)}{" "}
          of {filteredRoles.length} entries
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

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onNext={handleModalNext}
      />
    </div>
  );
}
