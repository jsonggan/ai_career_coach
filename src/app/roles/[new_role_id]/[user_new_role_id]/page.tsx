import CandidateEvaluationPage from "./candidate-evaluation-page";
import { roleService, CandidateEvaluationData } from "@/db/new-role-service";
import { notFound } from "next/navigation";

interface UserRoleApplicationsPageProps {
  params: {
    new_role_id: string;
    user_new_role_id: string;
  };
}

export default async function UserRoleApplicationsPage({
  params,
}: UserRoleApplicationsPageProps) {
  // Fetch candidate evaluation data from database
  const evaluationData: CandidateEvaluationData | null =
    await roleService.getCandidateEvaluationData(
      params.new_role_id,
      params.user_new_role_id
    );

  if (!evaluationData) {
    notFound();
  }

  return (
    <div
      className="flex flex-col w-full px-16 py-8"
      style={{ maxWidth: "1500px" }}
    >
      {/* Header Section */}
      <div className="mt-5">
        <a
          href={`/roles/${params.new_role_id}`}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back to Applications
        </a>
      </div>

      <CandidateEvaluationPage
        candidateId={evaluationData.candidateId}
        candidateName={evaluationData.candidateName}
        roleTitle={evaluationData.roleTitle}
        evaluationSections={evaluationData.evaluationSections}
        roleQuestions={evaluationData.roleQuestions}
        applicationData={evaluationData.applicationData}
        documents={evaluationData.documents}
      />
    </div>
  );
}
