import RoleApplicationsTable from "./role-applications-table";
import { roleService, RoleApplicationData } from "@/db/new-role-service";
import { notFound } from "next/navigation";

interface RoleApplicationsPageProps {
  params: {
    new_role_id: string;
  };
}

export default async function RoleApplicationsPage({
  params,
}: RoleApplicationsPageProps) {
  // Fetch role details and applications from database
  const role = await roleService.getRoleById(params.new_role_id);
  
  if (!role) {
    notFound();
  }

  const applications: RoleApplicationData[] = await roleService.getRoleApplications(params.new_role_id);

  return (
    <div
      className="flex flex-col w-full px-16 py-8"
      style={{ maxWidth: "1200px" }}
    >
      {/* Header Section */}
      <div className="mt-5">
        <h1 className="text-3xl font-semibold text-black mb-2">
          {role.title} Applications
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <a
            href="/roles"
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            ← List of Roles
          </a>
          <span className="text-gray-400">›</span>
          <span className="font-medium text-gray-900">{role.title}</span>
        </div>
      </div>

      {/* Client-side Applications Table Component */}
      <RoleApplicationsTable
        applicants={applications}
        roleId={params.new_role_id}
        roleTitle={role.title}
      />
    </div>
  );
}
