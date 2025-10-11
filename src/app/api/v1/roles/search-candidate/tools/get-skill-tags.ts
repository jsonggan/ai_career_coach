import { prisma } from "@/db/prisma";

export interface GetSkillTagsParams {
  department?: string;
}

export interface GetSkillTagsResponse {
  success: boolean;
  data: Record<string, string[]>;
  error?: string;
}

export async function getSkillTags(params: GetSkillTagsParams = {}): Promise<GetSkillTagsResponse> {
  try {
    const { department } = params;

    const users = await prisma.user.findMany({
      where: department ? ({ department } as any) : {},
      select: { userId: true, skillSet: true },
    });

    const skillTagsMap: Record<string, string[]> = {};
    users.forEach((user) => {
      skillTagsMap[user.userId] = user.skillSet;
    });

    return {
      success: true,
      data: skillTagsMap,
    };
  } catch (error) {
    console.error("Error fetching skill tags:", error);
    return {
      success: false,
      data: {},
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export const getSkillTagsToolSchema = {
  type: "function",
  name: "getSkillTags",
  description: "Get all employee skill tags mapped by userId, filtered by department",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      department: {
        type: "string",
        description: "department name to filter employees by",
      },
    },
    required: ["department"],
    additionalProperties: false,
  },
};
