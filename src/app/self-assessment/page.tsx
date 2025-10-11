import SelfAssessmentForm from "./form";
import { userService } from "@/db/user-service";

export default async function SelfAssessmentPage() {
  const defaultUserId = "93b45baa-8655-479b-9aa5-3b3bf6db1f0e"; // for demo purpose only

  const userData = await userService.getUserById(defaultUserId);

  return (
    <div
      className="flex flex-col w-full px-16 py-8"
      style={{ maxWidth: "1200px" }}
    >
      {/* Header Section */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Self Assessment
        </h1>
        <p className="text-gray-600 m-0">
          Complete your performance self-evaluation for this review cycle
        </p>
      </div>

      {/* Client-side Form Component */}
      <SelfAssessmentForm userData={userData} />
    </div>
  );
}
