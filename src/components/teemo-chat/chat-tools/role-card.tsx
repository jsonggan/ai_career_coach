import { Project } from "@/app/api/projects/types";
import MatchChip from "@/components/match-chip";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { useState } from "react";

interface RoleCardProps {
  role: Project["roles"][number];

  onRoleDeleteRequest?: (role: Project["roles"][number]) => void;
  onRoleSelect?: (role: Project["roles"][number]) => void;
  onRoleReassignRequest?: (role: Project["roles"][number]) => void;
  interactionDisabled?: boolean;
}

function RoleCard(props: RoleCardProps) {
  const {
    role,
    onRoleDeleteRequest,
    onRoleReassignRequest,
    onRoleSelect,
    interactionDisabled,
  } = props;
  const [isSkillsHidden, setIsSkillsHidden] = useState(true);
  const [isUserSkillsHidden, setIsUserSkillsHidden] = useState(true);

  return (
    <div className="surface-card p-2 border-round w-full flex flex-column w-full gap-1 border-left-3 border-bluegray-300">
      <h5 className="m-0 font-light">{role.role}</h5>
      <p className="m-0 text-color-secondary text-xs">{role.description}</p>
      {!isSkillsHidden && (
        <div className="flex flex-wrap gap-2 mt-2">
          {role.skills?.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              className="py-1 px-2"
              pt={{
                label: {
                  className: "text-xs m-0",
                },
              }}
            />
          ))}
        </div>
      )}
      <div className="flex w-full justify-content-end mt-1">
        <Button
          text
          label={isSkillsHidden ? "Show Skills" : "Hide Skills"}
          severity="secondary"
          className="p-0"
          onClick={() => setIsSkillsHidden((curr) => !curr)}
          pt={{
            label: {
              className: "text-xs font-light",
            },
          }}
        />
      </div>
      {role.user && (
        <div className="w-full flex flex-column align-items-center surface-50 border-round-xl pt-2 pb-2 my-2">
          <Avatar
            image={role.user.avatar}
            shape="circle"
            size="large"
            pt={{
              image: {
                width: 64,
                height: 64,
              },
            }}
          />
          <p className="m-0 text-center font-normal mt-2 text-xs">
            {role.user.name}
          </p>
          <p className="m-0 text-center text-xs text-color-secondary">
            {role.user.role}
          </p>
          <div className="mb-1 mt-2">
            <MatchChip value={role.match} />
          </div>
        </div>
      )}
      {!interactionDisabled && (
        <div className="flex align-items-center justify-content-between gap-2">
          <Button
            text
            label="Delete"
            severity="danger"
            className="p-0"
            pt={{
              label: {
                className: "text-xs font-light",
              },
            }}
            onClick={() => onRoleDeleteRequest?.(role)}
          />
          <div className="flex align-items-center justify-content-end gap-2">
            <Button
              text
              label="Edit Role"
              className="p-0"
              pt={{
                label: {
                  className: "text-xs font-light",
                },
              }}
              onClick={() => onRoleSelect?.(role)}
            />
            <Button
              text
              label="Reassign"
              className="p-0"
              pt={{
                label: {
                  className: "text-xs font-light",
                },
              }}
              onClick={() => onRoleReassignRequest?.(role)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleCard;
