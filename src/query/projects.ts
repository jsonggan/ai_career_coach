import { fetchProjects } from "@/backend/projects";
import { useQuery } from "@tanstack/react-query";

export function useProjectList() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
}

export function useProjectById(id: string) {
  const { data, ...rest } = useProjectList();
  return {
    data: data?.find(({ id: projectId }) => String(projectId) === String(id)),
    ...rest,
  };
}
