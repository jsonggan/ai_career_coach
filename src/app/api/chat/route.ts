import { convertToCoreMessages, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
  getLocalProjects,
  searchProjectByKeyword,
  setLocalProjects,
} from "../projects/route";
import { generateRoleCandidates } from "../projects/query/utils";

const SYSTEM_PROMPT = `You are a manager named Teemo whose role is to manage projects, allocate the correct resources to these projects, and making sure these projects are successful.
You are tasked to help address any queries to existing projects and handle create or update requests to existing projects.
When talking about a project you should keep a record of the project id for reference later to update.
When trying to select a project, try to suggest options from the search results first instead of deciding on one immediately.
All timings should be evaluated in Singapore time.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-2024-08-06"),
    system: SYSTEM_PROMPT,
    messages: convertToCoreMessages(messages),
    tools: {
      searchProject: {
        description:
          "Search for projects by text, should always be triggered when the user is searching for a project loosely",
        parameters: z.object({ text: z.string() }),
        execute: async ({ text }) => {
          return searchProjectByKeyword(text);
        },
      },
      specifyProjectAspectToUpdate: {
        description:
          "This function should always be called when the model doesn't know what to update and is asking the user what aspect of the project to update.",
        parameters: z.object({}),
        execute: async () => {
          return ["Status", "Timeline", "Objective", "Role"];
        },
      },
      updateProjectTimelineRequest: {
        description:
          "A request to update the project timeline, returns start and end dates",
        parameters: z.object({ id: z.string() }),
        execute: async ({ id }) => {
          const project = getLocalProjects().find((p) => p.id === id);
          if (!project) {
            return null;
          }
          return {
            start: project.start,
            end: project.end,
          };
        },
      },
      updateProjectTimeline: {
        description:
          "Update the project timeline with ISO format start and end dates",
        parameters: z.object({
          id: z.string(),
          start: z.string(),
          end: z.string(),
        }),
        execute: async ({ id, start, end }) => {
          const copied = [...getLocalProjects()];
          const projectIndex = copied.findIndex((p) => p.id === id);

          if (projectIndex === -1) {
            return;
          }

          copied[projectIndex] = {
            ...copied[projectIndex],
            start,
            end,
          };

          setLocalProjects(copied);
          return copied[projectIndex];
        },
      },
      selectUpdateProjectRoleRequest: {
        description:
          "A request to select a project role to update, keeping a reference of the project id for subsequent requests",
        parameters: z.object({ id: z.string() }),
        execute: async ({ id }) => {
          const project = getLocalProjects().find((p) => p.id === id);
          if (!project) {
            return null;
          }
          return project.roles;
        },
      },
      updateProjectRoleRequest: {
        description: "A request to update a specific role of a project",
        parameters: z.object({
          roleId: z.string(),
        }),
        execute: async ({ roleId }) => {
          const project = getLocalProjects().find(({ roles }) => {
            return roles.some((r) => r.id === roleId);
          });
          if (!project) {
            return null;
          }
          return project.roles.find((r) => r.id === roleId);
        },
      },
      updateProjectRoleById: {
        description: "Update a specific role of a project",
        parameters: z.object({
          projectId: z.string(),
          roleId: z.string(),
          role: z.object({
            role: z.string().describe("the name of the role"),
            description: z.string(),
            skills: z.array(z.string()),
          }),
        }),
        execute: async ({ projectId, roleId, role }) => {
          const copied = [...getLocalProjects()];
          const projectIndex = copied.findIndex((p) => p.id === projectId);
          if (projectIndex === -1) {
            return;
          }

          const roleIndex = copied[projectIndex].roles.findIndex(
            (o) => o.id === roleId,
          );
          if (roleIndex === -1) {
            return;
          }

          copied[projectIndex].roles[roleIndex] = {
            ...copied[projectIndex].roles[roleIndex],
            ...role,
          };
          setLocalProjects(copied);
          return copied[projectIndex].roles;
        },
      },
      deleteProjectRole: {
        description: "Delete the project role",
        parameters: z.object({
          projectId: z.string(),
          roleId: z.string(),
        }),
        execute: async ({ projectId, roleId }) => {
          const copied = [...getLocalProjects()];
          const projectIndex = copied.findIndex((p) => p.id === projectId);
          if (projectIndex === -1) {
            return;
          }

          const roleIndex = copied[projectIndex].roles.findIndex(
            (o) => o.id === roleId,
          );
          if (roleIndex === -1) {
            return;
          }

          copied[projectIndex].roles.splice(roleIndex, 1);
          setLocalProjects(copied);
          return copied[projectIndex].roles;
        },
      },
      reassignRoleRequest: {
        description:
          "A request to reassign a specific role of a project to another user, model must also explain that it managed to find 10 candidates and asks user to choose one. Do not show the avatar in the response",
        parameters: z.object({
          projectId: z.string(),
          roleId: z.string(),
        }),
        execute: async ({ projectId, roleId }) => {
          const projects = getLocalProjects();
          const projectIndex = projects.findIndex((p) => p.id === projectId);
          const role = projects[projectIndex]?.roles.find(
            (r) => r.id === roleId,
          );
          if (!role) {
            return [];
          }

          const candidates = await generateRoleCandidates(role);
          return {
            currentRole: role,
            candidates,
          };
        },
      },
      reassignRole: {
        description: "Reassign a specific role of a project to another user",
        parameters: z.object({
          projectId: z.string(),
          roleId: z.string(),
          person: z.object({
            id: z.string(),
            name: z.string(),
            role: z.string(),
            avatar: z.string(),
            match: z.number(),
          }),
        }),
        execute: async ({ projectId, roleId, person }) => {
          const copied = [...getLocalProjects()];
          const projectIndex = copied.findIndex((p) => p.id === projectId);
          if (projectIndex === -1) {
            return;
          }

          const roleIndex = copied[projectIndex].roles.findIndex(
            (o) => o.id === roleId,
          );
          if (roleIndex === -1) {
            return;
          }

          copied[projectIndex].roles[roleIndex] = {
            ...copied[projectIndex].roles[roleIndex],
            user: {
              ...person,
            },
            match: person.match,
          };

          setLocalProjects(copied);
          return copied[projectIndex].roles;
        },
      },
      selectUpdateProjectObjectiveRequest: {
        description:
          "A request to select a project objective to update, keeping a reference of the project id for subsequent requests",
        parameters: z.object({ id: z.string() }),
        execute: async ({ id }) => {
          const project = getLocalProjects().find((p) => p.id === id);
          if (!project) {
            return null;
          }
          return project.objectives;
        },
      },
      updateProjectObjectiveRequest: {
        description: "A request to update a project objective",
        parameters: z.object({
          objectiveId: z.string(),
        }),
        execute: async ({ objectiveId }) => {
          const project = getLocalProjects().find(({ objectives }) => {
            return objectives.some((o) => o.id === objectiveId);
          });

          if (!project) {
            return null;
          }

          return project.objectives.find((o) => o.id === objectiveId);
        },
      },
      deleteProjectObjectiveById: {
        description: "Delete the project objective",
        parameters: z.object({
          projectId: z.string(),
          objectiveId: z.string(),
        }),
        execute: async ({ projectId, objectiveId }) => {
          const copied = [...getLocalProjects()];
          const projectIndex = copied.findIndex((p) => p.id === projectId);
          if (projectIndex === -1) {
            return;
          }

          const objectiveIndex = copied[projectIndex].objectives.findIndex(
            (o) => o.id === objectiveId,
          );
          if (objectiveIndex === -1) {
            return;
          }

          copied[projectIndex].objectives.splice(objectiveIndex, 1);
          setLocalProjects(copied);
          return copied[projectIndex];
        },
      },
      updateProjectObjectiveById: {
        description: "Update the project objective data",
        parameters: z.object({
          projectId: z.string(),
          objectiveId: z.string(),
          name: z.string(),
          description: z.string(),
        }),
        execute: async ({ projectId, objectiveId, name, description }) => {
          const copied = [...getLocalProjects()];
          const projectIndex = copied.findIndex((p) => p.id === projectId);

          if (projectIndex === -1) {
            return;
          }

          const objectiveIndex = copied[projectIndex].objectives.findIndex(
            (o) => o.id === objectiveId,
          );
          if (objectiveIndex === -1) {
            return;
          }

          copied[projectIndex].objectives[objectiveIndex] = {
            ...copied[projectIndex].objectives[objectiveIndex],
            name,
            description,
          };

          setLocalProjects(copied);
          return copied[projectIndex];
        },
      },
      updateProjectStatusRequest: {
        description: "Request to update the project status",
        parameters: z.object({
          id: z.string(),
        }),
        execute: async ({ id }) => {
          const project = getLocalProjects().find((p) => p.id === id);
          if (!project) {
            return null;
          }
          return project;
        },
      },
      updateProjectStatus: {
        description: "Update the project status",
        parameters: z.object({
          id: z.string(),
          status: z.string(),
        }),
        execute: async ({ id, status }) => {
          const copied = [...getLocalProjects()];
          const projectIndex = copied.findIndex((p) => p.id === id);

          if (projectIndex === -1) {
            return;
          }

          copied[projectIndex] = {
            ...copied[projectIndex],
            status,
          };
          setLocalProjects(copied);
          return copied[projectIndex];
        },
      },
      createProjectRequest: {
        description:
          "Request to create a new project, it does not create a project but just collects the necessary entries before opening the creation wizard",
        parameters: z.object({
          name: z.string(),
          description: z.string(),
          start: z.string(),
          end: z.string(),
        }),
        execute: async ({ name, description, start, end }) => {
          return {
            name,
            description,
            start,
            end,
          };
        },
      },
      getCurrentDate: {
        description:
          "Get the current date when the user referenced dates based on the current date",
        parameters: z.object({}),
        execute: async () => {
          return new Date().toISOString();
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
