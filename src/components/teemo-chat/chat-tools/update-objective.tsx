import clsx from "clsx";
import styles from "../index.module.css";
import { useState } from "react";
import { Button } from "primereact/button";
import { Project } from "@/app/api/projects/types";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

type Objective = Project["objectives"][number];

interface UpdateObjectiveProps {
  objective: Objective;
  onDelete: (objective: Objective) => void;
  onConfirm: (objective: Objective) => void;
  interactionDisabled?: boolean;
}

function UpdateObjective(props: UpdateObjectiveProps) {
  const { objective, interactionDisabled = false, onDelete, onConfirm } = props;
  const [name, setName] = useState(objective.name);
  const [description, setDescription] = useState(objective.description);

  const hasChanged =
    name !== objective.name || description !== objective.description;

  return (
    <div className={clsx("flex flex-column", styles.chatTools)}>
      <span className="text-xs text-color mb-1">Name</span>
      <InputText
        className="p-inputtext-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={interactionDisabled}
      />
      <span className="text-xs text-color mt-3 mb-1">Description</span>
      <InputTextarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={interactionDisabled}
        rows={5}
      />
      {!interactionDisabled && (
        <div className="flex justify-content-between mt-3">
          <Button
            rounded
            outlined
            severity="danger"
            label="Delete"
            size="small"
            icon="pi pi-trash"
            className="p-2 px-3"
            onClick={() => onDelete(objective)}
          />
          <Button
            rounded
            outlined
            label="Update"
            size="small"
            className="p-2 px-3"
            disabled={!hasChanged}
            onClick={() =>
              onConfirm({
                id: objective.id,
                name,
                description,
              })
            }
          />
        </div>
      )}
    </div>
  );
}

export default UpdateObjective;
