import { Tag } from "primereact/tag";
import { ProjectStatus as ProjectStatusEnum } from "@/app/api/projects/types";
import { ProjectStatusProps } from "./types";

function ProjectStatus(props: ProjectStatusProps) {
  const { status } = props;
  return (
    <Tag
      value={status}
      className="border-round-xl px-2 font-light"
      style={{
        fontSize: "0.65rem",
        paddingTop: "0.2rem",
        paddingBottom: "0.2rem",
      }}
      severity={
        status === ProjectStatusEnum.New
          ? undefined
          : status === ProjectStatusEnum.Completed
            ? "success"
            : ("warning" as any)
      }
    />
  );
}

export default ProjectStatus;
