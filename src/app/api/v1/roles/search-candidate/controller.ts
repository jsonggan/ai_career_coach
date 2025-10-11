import OpenAI from "openai";
import { prisma } from "@/db/prisma";
import { getSkillTags, getSkillTagsToolSchema } from "./tools/get-skill-tags";
import { getEmployeeInformation, getEmployeeInformationToolSchema } from "./tools/get-employee-information";
import { finalizeCandidates, finalizeCandidatesToolSchema } from "./tools/finalize-candidates";
import { SYSTEM_PROMPT, buildSystemMessage, RoleInformation } from "./prompt";

function getToolsSchema() {
  return [
    getSkillTagsToolSchema,
    getEmployeeInformationToolSchema,
    finalizeCandidatesToolSchema,
  ];
}

async function executeTool(name: string, args: any, newRoleId: number): Promise<any> {
  if (name === "getSkillTags") {
    const result = await getSkillTags({ department: args.department });
    return result.data;
  }
  if (name === "getEmployeeInformation") {
    const result = await getEmployeeInformation({ employeeIds: args.employeeIds });
    return result.data;
  }
  if (name === "finalizeCandidates") {
    const result = await finalizeCandidates({
      results: Array.isArray(args.results) ? args.results : [],
      newRoleId: newRoleId,
    });
    return result.dataCount;
  }
  return {};
}


export async function searchCandidatesJson(roleInfo: RoleInformation) {
  const client = new OpenAI();
  const tools = getToolsSchema().map((t: any) => ({ type: "function", function: t }));

  let chatMessages: any[] = [
    { role: "system", content: SYSTEM_PROMPT },
    buildSystemMessage(roleInfo),
  ];

  let rounds = 0;
  let lastText = "";

  while (rounds < 5) {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      tools: tools as any,
      tool_choice: "required",
      service_tier: "priority",
    });

    const choice = completion.choices[0];
    const message = choice.message as any;

    lastText = message?.content || "";

    const toolCalls = message?.tool_calls || [];
    if (!toolCalls.length) {
      break;
    }

    chatMessages.push(message);

    for (const toolCall of toolCalls) {
      const name = toolCall.function?.name as string;
      let args: any = {};
      try {
        args = JSON.parse(toolCall.function?.arguments || "{}");
      } catch { }

      console.log(`🔧 Tool Call: ${name}`, { args });

      if (name === "finalizeCandidates") {
        const result = await finalizeCandidates({
          results: Array.isArray(args.results) ? args.results : [],
          newRoleId: roleInfo.newRoleId,
        });
        console.log(`✅ Tool Complete: ${name}`, { candidateCount: result.dataCount || 0 });
        return result.dataCount as any;
      } else {
        const result = await executeTool(name, args, roleInfo.newRoleId);
        console.log(`✅ Tool Complete: ${name}`, { resultKeys: Object.keys(result || {}) });
        chatMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    rounds += 1;
  }

  return { text: lastText } as { text: string };
}

export async function searchCandidatesStream(
  roleInfo: RoleInformation,
  sendEvent: (event: string, data: any) => void
) {
  const client = new OpenAI();
  const tools = getToolsSchema().map((t: any) => ({ type: "function", function: t }));

  let chatMessages: any[] = [
    { role: "system", content: SYSTEM_PROMPT },
    buildSystemMessage(roleInfo),
  ];

  let rounds = 0;
  let lastText = "";
  const maxRounds = 5;

  sendEvent('status', {
    type: 'progress',
    message: 'Initializing AI conversation...',
    progress: { current: 0, total: maxRounds, step: 'initialization' }
  });

  while (rounds < maxRounds) {
    sendEvent('status', {
      type: 'progress',
      message: `Starting round ${rounds + 1} of ${maxRounds}...`,
      progress: { current: rounds + 1, total: maxRounds, step: 'ai_processing' }
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      tools: tools as any,
      tool_choice: "required",
      service_tier: "priority",
    });

    const choice = completion.choices[0];
    const message = choice.message as any;

    lastText = message?.content || "";

    const toolCalls = message?.tool_calls || [];
    if (!toolCalls.length) {
      sendEvent('status', {
        type: 'progress',
        message: 'No more tools to execute. Conversation completed.',
        progress: { current: rounds + 1, total: maxRounds, step: 'completed' }
      });
      break;
    }

    chatMessages.push(message);

    sendEvent('status', {
      type: 'progress',
      message: `Found ${toolCalls.length} tool(s) to execute in round ${rounds + 1}`,
      progress: { current: rounds + 1, total: maxRounds, step: 'tool_execution' }
    });

    for (let i = 0; i < toolCalls.length; i++) {
      const toolCall = toolCalls[i];
      const name = toolCall.function?.name as string;
      let args: any = {};
      try {
        args = JSON.parse(toolCall.function?.arguments || "{}");
      } catch { }

      sendEvent('tool', {
        type: 'start',
        name,
        args,
        message: `Executing ${name}...`,
        progress: { current: i + 1, total: toolCalls.length, round: rounds + 1 }
      });

      console.log(`🔧 Tool Call: ${name}`, { args });

      if (name === "finalizeCandidates") {
        sendEvent('tool', {
          type: 'progress',
          name,
          message: `Finalizing candidates and saving to database...`,
        });

        const result = await finalizeCandidates({
          results: Array.isArray(args.results) ? args.results : [],
          newRoleId: roleInfo.newRoleId,
        });

        console.log(`✅ Tool Complete: ${name}`, { candidateCount: result.dataCount || 0 });

        sendEvent('tool', {
          type: 'complete',
          name,
          result: { candidateCount: result.dataCount || 0 },
          message: `Successfully processed ${result.dataCount || 0} candidates`
        });

        sendEvent('status', {
          type: 'complete',
          message: `Candidate search completed successfully. Found ${result.dataCount || 0} candidates.`
        });

        return result.dataCount as any;
      } else {
        const result = await executeTool(name, args, roleInfo.newRoleId);

        console.log(`✅ Tool Complete: ${name}`, { resultKeys: Object.keys(result || {}) });

        sendEvent('tool', {
          type: 'complete',
          name,
          result: { resultKeys: Object.keys(result || {}) },
          message: `Tool ${name} completed successfully`
        });

        chatMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    rounds += 1;

    sendEvent('status', {
      type: 'progress',
      message: `Round ${rounds} completed. ${maxRounds - rounds} rounds remaining.`,
      progress: { current: rounds, total: maxRounds, step: 'round_complete' }
    });
  }

  sendEvent('status', {
    type: 'complete',
    message: 'Maximum rounds reached. Process completed.',
    progress: { current: maxRounds, total: maxRounds, step: 'max_rounds_reached' }
  });

  return { text: lastText } as { text: string };
}

export async function getRoleInformationById(newRoleId: number): Promise<RoleInformation | null> {
  try {
    const newRole = await prisma.newRole.findUnique({
      where: { newRoleId },
      include: {
        candidateEvaluations: {
          select: {
            candidateEvaluationId: true,
            candidateEvaluation: true,
          },
        },
        roleRelatedQuestions: {
          select: {
            roleRelatedQuestionId: true,
            roleRelatedQuestion: true,
          },
        },
      },
    });

    if (!newRole) {
      return null;
    }

    return {
      newRoleId: newRole.newRoleId,
      roleTitle: newRole.roleName,
      roleDescription: newRole.descriptionAi || '',
      roleDescriptionAi: newRole.descriptionAi || '',
      yearsOfExperience: newRole.yearOfExperience || '',
      department: newRole.department || undefined,
      skills: newRole.skill || [],
      candidateEvaluationQuestions: newRole.candidateEvaluations,
      roleRelatedQuestions: newRole.roleRelatedQuestions,
    };
  } catch (error) {
    console.error("Error fetching role information:", error);
    return null;
  }
}
