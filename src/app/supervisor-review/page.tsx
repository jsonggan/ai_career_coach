import { SupervisorLayout, EmptyState } from "./components";
import { userService, UserData } from "@/db/user-service";

export default async function ManagerReviewPage() {
  const defaultUserId: string = "93b45baa-8655-479b-9aa5-3b3bf6db1f0e"; // for demo purpose only

  const employees: UserData[] = await userService.getEmployeesUnderManager(defaultUserId);
  return (
    <SupervisorLayout employees={employees}>
      <EmptyState />
    </SupervisorLayout>
  );
}
