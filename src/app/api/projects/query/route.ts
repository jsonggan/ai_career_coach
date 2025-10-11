import { type NextRequest } from "next/server";
import { Project } from "../types";
import {
  generateProjectObjectives,
  generateProjectRoles,
  generateRoleCandidates,
} from "./utils";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const context = searchParams.get("context");
  const project = (await request.json()) as Partial<Project>;

  if (context === "roles") {
    const [objectives, roles] = await Promise.all([
      generateProjectObjectives(project),
      generateProjectRoles(project),
    ]);

    return Response.json({
      ...project,
      objectives,
      roles,
    });
  }

  if (context === "users") {
    if (!project.roles?.length) {
      return Response.json(
        {
          ok: false,
        },
        {
          status: 400,
        },
      );
    }

    const candidateList = await Promise.all(
      project.roles.map((role) => generateRoleCandidates(role)),
    );
    return Response.json(candidateList);
  }

  return Response.json(
    {
      ok: false,
    },
    {
      status: 400,
    },
  );
}
