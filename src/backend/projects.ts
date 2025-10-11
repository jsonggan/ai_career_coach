import { Project, RoleCandidateList } from "@/app/api/projects/types";
import { apiClient } from "./http";

export function fetchProjects() {
  return apiClient.get<Project[]>("/projects").then((res) => res.data);
}

export function suggestProjectRolesAndObjectives(project: Partial<Project>) {
  return apiClient
    .post<Partial<Project>>("/projects/query", project, {
      params: {
        context: "roles",
      },
    })
    .then((res) => res.data);
}

export function suggestProjectCandidateList(project: Partial<Project>) {
  return apiClient
    .post<RoleCandidateList[]>("/projects/query", project, {
      params: {
        context: "users",
      },
    })
    .then((res) => res.data);
}

export function createProject(project: Partial<Project>) {
  return apiClient
    .post<Partial<Project>>("/projects", project)
    .then((res) => res.data);
}
