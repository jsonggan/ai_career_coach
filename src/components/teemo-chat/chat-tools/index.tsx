import { ToolInvocation } from "ai";
import { Candidate, Project } from "@/app/api/projects/types";
import styles from "../index.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import UpdateTimeline from "./update-timeline";
import ProjectCard from "./project.card";
import UpdateObjective from "./update-objective";
import ObjectiveCard from "./objective-card";
import UpdateStatus from "./update-status";
import { Button } from "primereact/button";
import { CreateProjectParams } from "@/store/create-dialog";
import RoleCard from "./role-card";
import UpdateRole from "./update-role";
import ReassignRole from "./reassign-role";

interface ChatToolsProps {
  invocations: ToolInvocation[];

  interactionDisabled?: boolean;
  onProjectSelect?: (project: Project) => void;
  onTimelineChangeRequest?: (start: string, end: string) => void;

  onObjectiveUpdateRequest?: (objective: Project["objectives"][number]) => void;
  onObjectiveDeleteRequest?: (objective: Project["objectives"][number]) => void;
  onObjectiveSelect?: (objective: Project["objectives"][number]) => void;

  onRoleDeleteRequest?: (role: Project["roles"][number]) => void;
  onRoleSelect?: (role: Project["roles"][number]) => void;
  onRoleUpdateRequest?: (role: Project["roles"][number]) => void;
  onRoleReassignRequest?: (role: Project["roles"][number]) => void;

  onCandidateSelect: (roleId: string, candidate: Partial<Candidate>) => void;

  onStatusUpdate?: (status: string) => void;

  onCreateClick?: (params: CreateProjectParams) => void;

  onProjectAspectClick?: (aspect: string) => void;
}

function ChatTools(props: ChatToolsProps) {
  const {
    invocations,
    interactionDisabled,
    onObjectiveSelect,
    onTimelineChangeRequest,
    onProjectSelect,
    onObjectiveDeleteRequest,
    onObjectiveUpdateRequest,
    onRoleReassignRequest,
    onRoleDeleteRequest,
    onRoleUpdateRequest,
    onRoleSelect,
    onStatusUpdate,
    onProjectAspectClick,
    onCreateClick,
    onCandidateSelect,
  } = props;
  const router = useRouter();
  const lastInvocation = invocations[invocations.length - 1];

  const onProjectView = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  switch (lastInvocation.state) {
    case "result":
      if (lastInvocation.toolName === "searchProject") {
        return (
          <div
            className={clsx(
              "flex flex-column gap-2 align-items-center",
              styles.chatTools,
            )}
          >
            {lastInvocation.result?.map((project: Project) => {
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onProjectView={onProjectView}
                  onProjectSelect={onProjectSelect}
                  interactionDisabled={interactionDisabled}
                />
              );
            })}
          </div>
        );
      }

      if (lastInvocation.toolName === "updateProjectTimelineRequest") {
        return (
          <UpdateTimeline
            start={lastInvocation.result?.start}
            end={lastInvocation.result?.end}
            onConfirm={(start, end) => onTimelineChangeRequest?.(start, end)}
            interactionDisabled={interactionDisabled}
          />
        );
      }

      if (lastInvocation.toolName === "updateProjectRoleRequest") {
        return (
          <UpdateRole
            role={lastInvocation.result}
            onConfirm={(role) => onRoleUpdateRequest?.(role)}
            onDelete={onRoleDeleteRequest}
            interactionDisabled={interactionDisabled}
          />
        );
      }

      if (lastInvocation.toolName === "reassignRoleRequest") {
        return (
          <ReassignRole
            toolData={lastInvocation.result}
            onCandidateSelect={onCandidateSelect}
            interactionDisabled={interactionDisabled}
          />
        );
      }

      if (
        lastInvocation.toolName === "selectUpdateProjectRoleRequest" ||
        lastInvocation.toolName === "deleteProjectRole" ||
        lastInvocation.toolName === "updateProjectRoleById" ||
        lastInvocation.toolName === "reassignRole"
      ) {
        return (
          <div
            className={clsx(
              "flex flex-column gap-2 align-items-center",
              styles.chatTools,
            )}
          >
            {lastInvocation.result?.map((role: Project["roles"][number]) => (
              <RoleCard
                key={role.id}
                role={role}
                onRoleDeleteRequest={onRoleDeleteRequest}
                onRoleSelect={onRoleSelect}
                onRoleReassignRequest={onRoleReassignRequest}
                interactionDisabled={interactionDisabled}
              />
            ))}
          </div>
        );
      }

      if (lastInvocation.toolName === "selectUpdateProjectObjectiveRequest") {
        return (
          <div
            className={clsx(
              "flex flex-column gap-2 align-items-center",
              styles.chatTools,
            )}
          >
            {lastInvocation.result?.map(
              (objective: Project["objectives"][number]) => {
                return (
                  <ObjectiveCard
                    key={objective.id}
                    objective={objective}
                    onObjectiveDeleteRequest={onObjectiveDeleteRequest}
                    onObjectiveSelect={onObjectiveSelect}
                    interactionDisabled={interactionDisabled}
                  />
                );
              },
            )}
          </div>
        );
      }

      if (lastInvocation.toolName === "updateProjectObjectiveRequest") {
        return (
          <UpdateObjective
            objective={lastInvocation.result}
            onConfirm={(objective) => onObjectiveUpdateRequest?.(objective)}
            onDelete={(objective) => onObjectiveDeleteRequest?.(objective)}
            interactionDisabled={interactionDisabled}
          />
        );
      }

      if (lastInvocation.toolName === "updateProjectStatusRequest") {
        return (
          <UpdateStatus
            project={lastInvocation.result}
            onConfirm={(status) => onStatusUpdate?.(status)}
            interactionDisabled={interactionDisabled}
          />
        );
      }

      if (lastInvocation.toolName === "createProjectRequest") {
        return (
          !interactionDisabled && (
            <div
              className={clsx(
                "flex flex-column gap-2 align-items-start",
                styles.chatTools,
              )}
            >
              <Button
                rounded
                outlined
                label="Open Creation Wizard"
                size="small"
                className="p-2 px-3"
                onClick={() => onCreateClick?.(lastInvocation.result)}
              />
            </div>
          )
        );
      }

      if (lastInvocation.toolName === "specifyProjectAspectToUpdate") {
        return (
          !interactionDisabled && (
            <div
              className={clsx(
                "flex flex-row flex-wrap gap-2 align-items-center",
                styles.chatTools,
              )}
            >
              {lastInvocation.result?.map((update: string) => (
                <Button
                  outlined
                  rounded
                  key={update}
                  label={update}
                  className="p-1 px-2"
                  pt={{
                    label: {
                      className: "text-xs",
                    },
                  }}
                  onClick={() => onProjectAspectClick?.(update)}
                />
              ))}
            </div>
          )
        );
      }

      if (
        lastInvocation.toolName === "updateProjectTimeline" ||
        lastInvocation.toolName === "deleteProjectObjectiveById" ||
        lastInvocation.toolName === "updateProjectObjectiveById" ||
        lastInvocation.toolName === "updateProjectStatus"
      ) {
        return (
          <div
            className={clsx(
              "flex flex-column gap-2 align-items-center",
              styles.chatTools,
            )}
          >
            <ProjectCard
              project={lastInvocation.result}
              onProjectView={onProjectView}
              interactionDisabled
            />
          </div>
        );
      }

      return null;
    default:
      return null;
  }
}

export default ChatTools;
