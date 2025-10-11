import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

import { faker } from "@faker-js/faker";
import projects from "./data.json";
import { Project } from "./types";

let localProjects = [...projects];
let vectorStore: MemoryVectorStore | null = null;

export async function GET() {
  return Response.json(localProjects);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const project = { ...payload, id: faker.string.uuid() };
  localProjects = [project, ...localProjects];
  refreshProjectEmbeddings();
  return Response.json(project);
}

export function getLocalProjects() {
  return localProjects;
}

export function setLocalProjects(projects: Project[]) {
  localProjects = projects;
  refreshProjectEmbeddings();
}

export function getVectorStore() {
  return vectorStore;
}

export async function refreshProjectEmbeddings() {
  let embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
  const vStore = new MemoryVectorStore(embeddings);
  await vStore.addDocuments(
    localProjects.map((project) => ({
      pageContent: JSON.stringify(project),
      metadata: project,
    })),
  );
  vectorStore = vStore;
}

export async function searchProjectByKeyword(
  keyword: string,
): Promise<Project[]> {
  if (!vectorStore) {
    throw new Error("Vector Store not initialized");
  }

  const similaritySearchResults = await vectorStore.similaritySearch(
    keyword,
    3,
  );
  return similaritySearchResults.map((doc) => doc.metadata as Project);
}

refreshProjectEmbeddings(); // execute on startup
