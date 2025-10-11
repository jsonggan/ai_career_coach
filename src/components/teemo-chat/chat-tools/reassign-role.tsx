import clsx from "clsx";
import styles from "../index.module.css";
import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Candidate, Project } from "@/app/api/projects/types";
import { Avatar } from "primereact/avatar";
import MatchChip from "@/components/match-chip";
import { Chip } from "primereact/chip";
import { RadioButton } from "primereact/radiobutton";

interface ReassignRoleProps {
  toolData: {
    currentRole: Project["roles"][number];
    candidates: {
      candidates: Candidate[];
      id: string;
    };
  };
  onCandidateSelect: (roleId: string, candidate: Partial<Candidate>) => void;
  interactionDisabled?: boolean;
}

interface UserCardProps {
  candidate: Partial<Candidate>;
  selected: boolean;
  onClick: (id: string, candidate: Partial<Candidate>) => void;
  current?: boolean;
}

function UserCard(props: UserCardProps) {
  const { candidate, selected, onClick, current = false } = props;

  return (
    <button
      key={candidate.id}
      type="button"
      className={clsx(
        "relative border-none border-round-xl py-4 flex flex-column gap-2 align-items-center w-14rem flex-shrink-0 cursor-pointer flex-grow-1 border-2 border-transparent",
        selected ? "bg-blue-50 border-blue-200" : "surface-ground",
      )}
      onClick={() => onClick(candidate?.id || "", candidate)}
    >
      <Avatar
        image={candidate.avatar}
        shape="circle"
        size="xlarge"
        pt={{
          image: {
            width: 64,
            height: 64,
          },
        }}
      />
      <p className="m-0 text-center font-normal mt-2 text-sm">
        {candidate.name}{" "}
        {current && <span className="text-green-400">(Current)</span>}
      </p>
      <p className="m-0 text-center text-sm text-color-secondary mb-2">
        {candidate.role}
      </p>
      <MatchChip value={candidate.match || 0} />
      <div className="flex flex-wrap justify-content-center gap-1 mt-2">
        {candidate.skills?.map((name) => (
          <Chip
            key={name}
            label={name}
            pt={{
              root: {
                className: "bg-blue-50 py-1 px-2",
              },
              label: {
                className: "text-blue-500 text-xs m-0 mx-1",
              },
            }}
          />
        ))}
      </div>
      <RadioButton
        className="absolute top-0 right-0 mt-3 mr-3"
        checked={selected}
      />
    </button>
  );
}

function ReassignRole(props: ReassignRoleProps) {
  const { toolData, onCandidateSelect, interactionDisabled } = props;
  const { currentRole, candidates } = toolData;
  const [selectedUser, setSelectedUser] = useState<Partial<Candidate>>(
    currentRole.user,
  );
  const hasChanged = selectedUser?.id !== currentRole.user?.id;

  return (
    <div className={clsx("flex flex-column", styles.chatTools)}>
      <span className="text-xs text-color mb-1">
        Candidates{" "}
        <span className="text-color-secondary">(scroll to see options)</span>
      </span>
      <div className="flex gap-2 overflow-x-auto">
        <UserCard
          candidate={{
            ...currentRole.user,
            match: currentRole.match,
          }}
          selected={selectedUser?.id === currentRole.user?.id}
          onClick={
            interactionDisabled
              ? () => {}
              : () => setSelectedUser(currentRole.user)
          }
          current
        />
        {candidates.candidates?.map((candidate) => (
          <UserCard
            key={candidate.id}
            candidate={candidate}
            selected={selectedUser?.id === candidate.id}
            onClick={
              interactionDisabled
                ? () => {}
                : (_, candidate) => setSelectedUser(candidate)
            }
          />
        ))}
      </div>
      {!interactionDisabled && (
        <div className="flex justify-content-end mt-3">
          <Button
            rounded
            outlined
            label="Reassign"
            size="small"
            className="p-2 px-3"
            disabled={!hasChanged}
            onClick={() => onCandidateSelect(candidates.id, selectedUser)}
          />
        </div>
      )}
    </div>
  );
}

export default ReassignRole;
