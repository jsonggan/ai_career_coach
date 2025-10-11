import RolesList from "./roles-list";
import { roleService, RoleData } from "@/db/new-role-service";

export default async function RolesPage() {
  const roles: RoleData[] = await roleService.getAllRoles();
  return (
    <div
      className="flex flex-col w-full px-16 py-8"
      style={{ maxWidth: "1200px" }}
    >
      {/* Header Section */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-semibold text-black mb-2">
          List of Roles
        </h1>
        <p className="text-gray-600 m-0">
          Manage and view all available roles and their candidates
        </p>
      </div>

      {/* Client-side Roles List Component */}
      <RolesList roles={roles} />
    </div>
  );
}
