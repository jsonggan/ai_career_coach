import clsx from "clsx";
import styles from "../index.module.css";
import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Project } from "@/app/api/projects/types";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

type Role = Project["roles"][number];

interface UpdateRoleProps {
  role: Role;
  onDelete?: (role: Role) => void;
  onConfirm?: (role: Role) => void;
  interactionDisabled?: boolean;
}

function isSkillsEqual(a: string[], b: string[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((skill) => b.includes(skill));
}

function UpdateRole(props: UpdateRoleProps) {
  const { role, interactionDisabled = false, onDelete, onConfirm } = props;
  const [name, setName] = useState(role.role);
  const [description, setDescription] = useState(role.description);
  const [skills, setSkills] = useState(role.skills);

  const hasChanged = useMemo(() => {
    return (
      name !== role.role ||
      description !== role.description ||
      !isSkillsEqual(skills, role.skills)
    );
  }, [name, description, skills, role]);

  return (
    <div className={clsx("flex flex-column", styles.chatTools)}>
      <span className="text-xs text-color mb-1">Role Name</span>
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
      <span className="text-xs text-color mt-3 mb-1">Skills</span>
      <Chips
        value={skills}
        onChange={(e) => e.value && setSkills(e.value)}
        pt={{
          container: {
            className: "gap-1",
          },
        }}
        disabled={interactionDisabled}
      />
      {!interactionDisabled && (
        <div className="flex justify-content-between mt-3">
          <Button
            rounded
            outlined
            severity="danger"
            label="Delete Role"
            size="small"
            icon="pi pi-trash"
            className="p-2 px-3"
            onClick={() => onDelete?.(role)}
          />
          <Button
            rounded
            outlined
            label="Update"
            size="small"
            className="p-2 px-3"
            disabled={!hasChanged}
            onClick={() =>
              onConfirm?.({
                ...role,
                role: name,
                description,
                skills,
              })
            }
          />
        </div>
      )}
    </div>
  );
}

export default UpdateRole;
