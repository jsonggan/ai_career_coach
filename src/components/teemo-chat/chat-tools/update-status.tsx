import clsx from "clsx";
import styles from "../index.module.css";
import { useState } from "react";
import { Button } from "primereact/button";
import {
  Project,
  ProjectStatus as ProjectStatusEnum,
} from "@/app/api/projects/types";
import { Dropdown } from "primereact/dropdown";
import ProjectStatus from "@/components/project-status";

interface UpdateStatusProps {
  project: Project;
  onConfirm: (status: string) => void;
  interactionDisabled?: boolean;
}

function UpdateStatus(props: UpdateStatusProps) {
  const { project, interactionDisabled = false, onConfirm } = props;
  const [status, setStatus] = useState(project.status);
  const hasChanged = status !== project.status;

  return (
    <div className={clsx("flex flex-column", styles.chatTools)}>
      <span className="text-xs text-color mb-1">Status</span>
      <Dropdown
        options={Object.values(ProjectStatusEnum).map((val) => ({
          value: val,
          label: val,
        }))}
        optionLabel="label"
        value={status}
        onChange={(e) => setStatus(e.value)}
        disabled={interactionDisabled}
      />
      {!interactionDisabled && (
        <div className="flex justify-content-end mt-3">
          <Button
            rounded
            outlined
            label="Update"
            size="small"
            className="p-2 px-3"
            disabled={!hasChanged}
            onClick={() => onConfirm(status)}
          />
        </div>
      )}
    </div>
  );
}

export default UpdateStatus;
