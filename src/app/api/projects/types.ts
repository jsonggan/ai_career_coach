import projects from "./data.json";

export type Project = (typeof projects)[number];

export interface Candidate {
  id: string;
  name: string;
  role: string;
  skills: string[];
  avatar: string;
  match: number;
}

export interface RoleCandidateList {
  id: string;
  candidates: Candidate[];
}

export enum ProjectStatus {
  New = "New",
  InProgress = "In Progress",
  Completed = "Completed",
}
