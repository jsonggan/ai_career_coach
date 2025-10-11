"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { faker } from "@faker-js/faker";
import { Candidate, Project } from "../types";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const ProjectObjective = z.object({
  objectives: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    }),
  ),
});

const ProjectRole = z.object({
  roles: z.array(
    z.object({
      role: z.string(),
      description: z.string(),
      skills: z.array(z.string()),
    }),
  ),
});

const ProjectRoleCandidate = z.object({
  candidates: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      skills: z.array(z.string()),
      match: z.number(),
    }),
  ),
});

const SYSTEM_PROMPT =
  "You are a manager whose role is to manage projects, allocate the correct resources to these projects, and making sure these projects are successful.";

function queryChat(message: string, format?: z.ZodObject<any>) {
  return openaiClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-4o-2024-08-06",
    response_format: format
      ? zodResponseFormat(format, "event")
      : { type: "json_object" },
  });
}

export async function generateProjectObjectives(project: Partial<Project>) {
  const { name, description } = project;
  const chatCompletion = await openaiClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `The project name that you will be doing is ${name}. The project description is as follows:
${description}

I want you to generate 5 objectives for this project to be successful.
`,
      },
    ],
    model: "gpt-4o-2024-08-06",
    response_format: zodResponseFormat(ProjectObjective, "objectives"),
  });

  const [firstChoice] = chatCompletion.choices;
  const objectives = JSON.parse(firstChoice.message.content || "")
    .objectives as Project["objectives"];
  return objectives.map((obj) => ({
    ...obj,
    id: faker.string.uuid(),
  }));
}

export async function generateProjectRoles(project: Partial<Project>) {
  const { name, description } = project;
  const chatCompletion = await openaiClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `The project name that you will be doing is ${name}. The project description is as follows:
${description}

I want you to return 5 to 8 roles with the skills (as many as required) that are required for this role to make this project a success.
`,
      },
    ],
    model: "gpt-4o-2024-08-06",
    response_format: zodResponseFormat(ProjectRole, "roles"),
  });

  const [firstChoice] = chatCompletion.choices;
  const roles = JSON.parse(firstChoice.message.content || "")
    .roles as Project["roles"];
  return roles.map((role) => ({
    ...role,
    id: faker.string.uuid(),
  }));
}

export async function generateRoleCandidates(role: Project["roles"][number]) {
  const chatCompletion = await openaiClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `A project currently requires that you fill in a ${role.role} role:
description: ${role.description}
skills: ${role.skills.join(", ")}

I want you to return 10 potential candidates to fill in this roles. At least 3 of these candidates should have a matching number of at least 80% and at least 2 should be below 30%, the rest should be between 30% and 80%.

The matching number (percentage between 0 and 95) is calculated based on the eligibility of the candidate to fill this role.

The skills should be array of skillsets that the role requires, can be as many as needed does not need to match, will be used for matching.
`,
      },
    ],
    model: "gpt-4o-2024-08-06",
    response_format: zodResponseFormat(ProjectRoleCandidate, "candidates"),
  });

  const [firstChoice] = chatCompletion.choices;
  const candidates = JSON.parse(firstChoice.message.content || "")
    .candidates as Candidate[];
  return {
    id: role.id,
    candidates: candidates.map((candidate) => ({
      ...candidate,
      name: faker.person.firstName() + " " + faker.person.lastName(),
      avatar: faker.image.avatarGitHub(),
      id: faker.string.uuid(),
    })),
  };
}
