import { prisma } from "@/db/prisma";

export interface EmployeeInformation {
  name: string;
  jobRole: string;
  systemRole: string;
  rank: string;
  skillSet: string[];
  documents: Array<{
    filename: string;
    extractedContent: string;
  }>;
  selfAssessments: Array<{
    goalAchieved: string;
    keyStrength: string;
    areaForImprovement: string;
    overallSelfRating: number;
    additionalComment: string;
  }>;
  peerFeedbacks: Array<{
    rating: number;
    commentOnStrength: string;
    suggestionForImprovement: string;
    finalComment: string;
    commenter: {
      name: string;
      jobRole: string;
    };
  }>;
  managerEvaluations: Array<{
    performanceRating: number;
    commentOnGoalAchieved: string;
    commentOnStrength: string;
    suggestionForImprovement: string;
    finalComment: string;
  }>;
}

export interface GetEmployeeInformationResponse {
  success: boolean;
  data: Record<string, EmployeeInformation>;
  error?: string;
}

export interface GetEmployeeInformationParams {
  employeeIds: string[];
}

export async function getEmployeeInformation(
  params: GetEmployeeInformationParams
): Promise<GetEmployeeInformationResponse> {
  try {
    const { employeeIds } = params;

    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      return {
        success: true,
        data: {},
      };
    }

    const employees = await prisma.user.findMany({
      where: { userId: { in: employeeIds } },
      select: {
        userId: true,
        name: true,
        jobRole: true,
        systemRole: true,
        rank: true,
        skillSet: true,
        documents: {
          select: { filename: true, extractedContent: true },
        },
        selfAssessments: {
          select: {
            goalAchieved: true,
            keyStrength: true,
            areaForImprovement: true,
            overallSelfRating: true,
            additionalComment: true,
          },
        },
        peerFeedbacks: {
          select: {
            rating: true,
            commentOnStrength: true,
            suggestionForImprovement: true,
            finalComment: true,
            commenter: { select: { name: true, jobRole: true } },
          },
        },
        managerEvaluations: {
          select: {
            performanceRating: true,
            commentOnGoalAchieved: true,
            commentOnStrength: true,
            suggestionForImprovement: true,
            finalComment: true,
          },
        },
      },
    });

    const employeeInfoMap: Record<string, EmployeeInformation> = {};
    employees.forEach((employee) => {
      employeeInfoMap[employee.userId] = {
        name: employee.name,
        jobRole: employee.jobRole,
        systemRole: employee.systemRole,
        rank: employee.rank || "",
        skillSet: employee.skillSet,
        documents: employee.documents.map((doc) => ({
          filename: doc.filename,
          extractedContent: doc.extractedContent,
        })),
        selfAssessments: employee.selfAssessments.map((assessment) => ({
          goalAchieved: assessment.goalAchieved || "",
          keyStrength: assessment.keyStrength || "",
          areaForImprovement: assessment.areaForImprovement || "",
          overallSelfRating: assessment.overallSelfRating || 0,
          additionalComment: assessment.additionalComment || "",
        })),
        peerFeedbacks: employee.peerFeedbacks.map((feedback) => ({
          rating: feedback.rating || 0,
          commentOnStrength: feedback.commentOnStrength || "",
          suggestionForImprovement: feedback.suggestionForImprovement || "",
          finalComment: feedback.finalComment || "",
          commenter: feedback.commenter,
        })),
        managerEvaluations: employee.managerEvaluations.map((evaluation) => ({
          performanceRating: evaluation.performanceRating || 0,
          commentOnGoalAchieved: evaluation.commentOnGoalAchieved || "",
          commentOnStrength: evaluation.commentOnStrength || "",
          suggestionForImprovement: evaluation.suggestionForImprovement || "",
          finalComment: evaluation.finalComment || "",
        })),
      };
    });

    return {
      success: true,
      data: employeeInfoMap,
    };
  } catch (error) {
    console.error("Error fetching employee information:", error);
    return {
      success: false,
      data: {},
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export const getEmployeeInformationToolSchema = {
  type: "function",
  name: "getEmployeeInformation",
  description: "Get full information of list of employees including assessments, feedback, and evaluations",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      employeeIds: {
        type: "array",
        items: { type: "string" },
        description: "List of employee userId strings (UUID)",
      },
    },
    required: ["employeeIds"],
    additionalProperties: false,
  },
};
