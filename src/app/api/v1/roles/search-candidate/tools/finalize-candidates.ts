import { prisma } from "@/db/prisma";
import fs from "fs";
import path from "path";

export interface CandidateResult {
  user_new_role_id: number;
  new_role_id: number;
  user_id: string;
  overall_rating: number;
  ai_summary: string;
  reviewer_comment: string;
  reviewer_comment_id: number;
  impact_communication: number;
  skill_recency: number;
  years_of_relevant_experience: number;
  total_experience: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  candidate_evaluation: Array<{
    id: number;
    answer: string;
    is_in_resume: boolean;
  }>;
  role_related_question: Array<{
    id: number;
    answer: string;
    is_in_resume: boolean;
  }>;
}

export interface CandidateFinalizeInput {
  employeeId: string;
  overall_rating: number;
  ai_summary: string;
  impact_communication: number;
  skill_recency: number;
  years_of_relevant_experience: number;
  total_experience: number;
  status: string;
  candidate_evaluation: Array<{
    id: number;
    answer: string;
    is_in_resume: boolean;
  }>;
  role_related_question: Array<{
    id: number;
    answer: string;
    is_in_resume: boolean;
  }>;
}

export interface FinalizeCandidatesResponse {
  success: boolean;
  dataCount: number;
  failedCount: number;
  error?: string;
}

export interface FinalizeCandidatesParams {
  results: CandidateFinalizeInput[];
  newRoleId: number;
}

export async function finalizeCandidates(
  params: FinalizeCandidatesParams
): Promise<FinalizeCandidatesResponse> {
  try {
    const { results, newRoleId } = params;

    // Write detailed results to log file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFileName = `candidate-results-${timestamp}.log`;
    const logPath = path.join(process.cwd(), 'logs', logFileName);

    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Build detailed log content
    let logContent = `=== CANDIDATE SEARCH RESULTS LOG ===\n`;
    logContent += `Timestamp: ${new Date().toISOString()}\n`;
    logContent += `New Role ID: ${newRoleId}\n`;
    logContent += `Total Results: ${results.length}\n`;
    logContent += `\n${"=".repeat(80)}\n\n`;

    results.forEach((result, index) => {
      logContent += `CANDIDATE ${index + 1}\n`;
      logContent += `Employee ID: ${result.employeeId}\n`;
      logContent += `Overall Rating: ${result.overall_rating}\n`;
      logContent += `AI Summary: ${result.ai_summary}\n`;
      logContent += `Impact Communication: ${result.impact_communication}\n`;
      logContent += `Skill Recency: ${result.skill_recency}\n`;
      logContent += `Years of Relevant Experience: ${result.years_of_relevant_experience}\n`;
      logContent += `Total Experience: ${result.total_experience}\n`;
      logContent += `Status: ${result.status}\n`;

      logContent += `\n--- CANDIDATE EVALUATION (${result.candidate_evaluation?.length || 0} items) ---\n`;
      if (result.candidate_evaluation && result.candidate_evaluation.length > 0) {
        result.candidate_evaluation.forEach((evaluation, evalIndex) => {
          logContent += `  [${evalIndex + 1}] Question ID: ${evaluation.id}\n`;
          logContent += `      Answer: "${evaluation.answer}"\n`;
          logContent += `      Found in Resume: ${evaluation.is_in_resume}\n`;
        });
      } else {
        logContent += `  No candidate evaluation data\n`;
      }

      logContent += `\n--- ROLE RELATED QUESTIONS (${result.role_related_question?.length || 0} items) ---\n`;
      if (result.role_related_question && result.role_related_question.length > 0) {
        result.role_related_question.forEach((question, qIndex) => {
          logContent += `  [${qIndex + 1}] Question ID: ${question.id}\n`;
          logContent += `      Answer: "${question.answer}"\n`;
          logContent += `      Found in Resume: ${question.is_in_resume}\n`;
        });
      } else {
        logContent += `  No role related question data\n`;
      }

      logContent += `\n${"-".repeat(60)}\n\n`;
    });

    // Write to file
    try {
      fs.writeFileSync(logPath, logContent, 'utf8');
      console.log(`✅ Detailed candidate results written to: ${logPath}`);
    } catch (error) {
      console.error('❌ Failed to write log file:', error);
    }

    // Also write JSON for easy parsing if needed
    const jsonLogPath = path.join(logsDir, `candidate-results-${timestamp}.json`);
    try {
      fs.writeFileSync(jsonLogPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        newRoleId,
        results
      }, null, 2), 'utf8');
      console.log(`✅ JSON results written to: ${jsonLogPath}`);
    } catch (error) {
      console.error('❌ Failed to write JSON log file:', error);
    }

    if (!Array.isArray(results) || results.length === 0) {
      return {
        success: true,
        dataCount: 0,
        failedCount: 0,
      };
    }

    let dataCount = 0;
    let failedCount = 0;

    for (const item of results) {
      try {
        const employeeId = item.employeeId;

        // create user-new-role record
        const userNewRole = await prisma.userNewRole.create({
          data: {
            newRoleId,
            userId: employeeId,
            overallRating: item.overall_rating,
            aiSummary: item.ai_summary,
            reviewerComment: "",
            impactCommunication: item.impact_communication,
            skillRecency: item.skill_recency,
            yearsOfRelevantExperience: item.years_of_relevant_experience,
            totalExperience: item.total_experience,
            status: item.status,
          },
          select: { userNewRoleId: true },
        });

        if (userNewRole) {
          dataCount++;
        }

        if (item.candidate_evaluation?.length) {
          await prisma.userNewRoleCandidateEvaluation.createMany({
            data: item.candidate_evaluation.map((a) => ({
              userNewRoleId: userNewRole.userNewRoleId,
              candidateEvaluationId: a.id,
              candidateEvaluationAnswer: a.answer,
              isInResume: a.is_in_resume,
            })),
          });
        }

        if (item.role_related_question?.length) {
          await prisma.userNewRoleRoleRelatedQuestion.createMany({
            data: item.role_related_question.map((a) => ({
              userNewRoleId: userNewRole.userNewRoleId,
              roleRelatedQuestionId: a.id,
              roleRelatedQuestionAnswer: a.answer,
              isInResume: a.is_in_resume,
            })),
          });
        }

        console.log(`✅ Successfully processed candidate: ${employeeId}`);
      } catch (candidateError) {
        failedCount++;
        console.error(`❌ Failed to process candidate ${item.employeeId}:`, candidateError);

        // Log the failure to the log file as well
        const failureLogContent = `\n❌ FAILED TO PROCESS CANDIDATE: ${item.employeeId}\nError: ${candidateError instanceof Error ? candidateError.message : String(candidateError)}\nTimestamp: ${new Date().toISOString()}\n${"-".repeat(80)}\n`;

        try {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const logFileName = `candidate-results-${timestamp}.log`;
          const logPath = path.join(process.cwd(), 'logs', logFileName);
          fs.appendFileSync(logPath, failureLogContent, 'utf8');
        } catch (logError) {
          console.error('Failed to log candidate processing error:', logError);
        }

        // Continue with the next candidate
        continue;
      }
    }

    return { success: true, dataCount, failedCount };
  } catch (error) {
    console.error("Error finalizing candidates:", error);
    return {
      success: false,
      dataCount: 0,
      failedCount: 0,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export const finalizeCandidatesToolSchema = {
  type: "function",
  name: "finalizeCandidates",
  description: "Provide the top 10 candidates with full details for persistence. CRITICAL: Use the actual candidateEvaluationId and roleRelatedQuestionId from the role information, NOT sequential numbers!",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      results: {
        type: "array",
        description: "top 10 candidate results",
        items: {
          type: "object",
          properties: {
            employeeId: { type: "string", description: "Employee userId" },
            overall_rating: { type: "number", description: "number from 1 to 100", minimum: 1, maximum: 100 },
            ai_summary: { type: "string", description: "100 to 150 words description of the candidate" },
            impact_communication: { type: "number", description: "number from 1 to 100", minimum: 1, maximum: 100 },
            skill_recency: { type: "number", description: "number from 1 to 100", minimum: 1, maximum: 100 },
            years_of_relevant_experience: { type: "number", description: "number of years of relevant experience on the new role" },
            total_experience: { type: "number", description: "number of years of total working experience" },
            status: { type: "string", description: "matching level: high | medium | low", enum: ["high", "medium", "low"] },
            candidate_evaluation: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number", description: "MUST be the actual candidateEvaluationId from the role information, NOT a sequential number" },
                  answer: { type: "string", description: "answer to the candidate evaluation question" },
                  is_in_resume: { type: "boolean", description: "true if the answer is in the resume" },
                },
                required: ["id", "answer", "is_in_resume"],
                additionalProperties: false,
              },
              description: "candidate evaluation questions id and answers, can be empty array if there is no question",
            },
            role_related_question: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number", description: "MUST be the actual roleRelatedQuestionId from the role information, NOT a sequential number" },
                  answer: { type: "string", description: "answer to the role related question" },
                  is_in_resume: { type: "boolean", description: "true if the answer is in the resume" },
                },
                required: ["id", "answer", "is_in_resume"],
                additionalProperties: false,
              },
              description: "role related questions id and answers, can be empty array if there is no question",
            },
          },
          required: [
            "employeeId",
            "overall_rating",
            "ai_summary",
            "impact_communication",
            "skill_recency",
            "years_of_relevant_experience",
            "total_experience",
            "status",
            "candidate_evaluation",
            "role_related_question",
          ],
          additionalProperties: false,
        },
      },
    },
    required: ["results"],
    additionalProperties: false,
  },
};
