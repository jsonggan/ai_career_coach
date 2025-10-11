import { Project } from "@/app/api/projects/types";

export interface ProjectDataTableProps {
  onRowClick: (row: Project) => void;
}
