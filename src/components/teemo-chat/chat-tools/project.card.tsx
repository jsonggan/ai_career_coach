import { Project } from "@/app/api/projects/types";
import ProjectStatus from "@/components/project-status";
import { Button } from "primereact/button";

interface ProjectCardProps {
  project: Project;
  onProjectView: (project: Project) => void;
  onProjectSelect?: (project: Project) => void;
  interactionDisabled?: boolean;
}

function ProjectCard(props: ProjectCardProps) {
  const { project, onProjectView, onProjectSelect, interactionDisabled } =
    props;

  return (
    <div className="surface-card p-2 border-round w-full flex flex-column w-full gap-1 border-left-3 border-green-500">
      <h5 className="m-0 font-light">
        {project.name}{" "}
        <span className="text-color-secondary">({project.client})</span>
      </h5>
      <p className="m-0 text-color-secondary text-xs">
        {project.objectives.length} objectives - {project.roles.length} roles
      </p>
      <div className="min-w mt-1">
        <ProjectStatus status={project.status} />
      </div>
      <div className="flex align-items-center justify-content-end gap-2">
        <Button
          text
          label="View"
          severity="secondary"
          className="p-0"
          pt={{
            label: {
              className: "text-xs font-light",
            },
          }}
          onClick={() => onProjectView(project)}
        />
        {!interactionDisabled && (
          <Button
            text
            label="Select"
            className="p-0"
            pt={{
              label: {
                className: "text-xs font-light",
              },
            }}
            onClick={() => onProjectSelect?.(project)}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
