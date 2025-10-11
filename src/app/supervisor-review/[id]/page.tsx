import ManagerEvaluationForm from "../form";
import { SupervisorLayout } from "../components";
import { userService, UserData } from "@/db/user-service";

type PageProps = {
  params: { id: string };
};

export default async function ManagerReviewByIdPage({ params }: PageProps) {
  const defaultUserId: string = "93b45baa-8655-479b-9aa5-3b3bf6db1f0e"; // for demo purpose only

  const employees: UserData[] = await userService.getEmployeesUnderManager(defaultUserId);
  const employee = employees.find((e) => e.userId === params.id);

  return (
    <SupervisorLayout employees={employees}>
      <ManagerEvaluationForm
        defaultValues={{
          personnelName: employee?.name ?? "",
          defenceRole: employee?.jobRole ?? "",
          assessmentCycle: "Mid-Year 2025",
        }}
      />
    </SupervisorLayout>
  );
}
