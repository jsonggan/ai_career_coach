"use client";

import {
  Candidate,
  Project,
  RoleCandidateList,
} from "@/app/api/projects/types";
import { createProject } from "@/backend/projects";
import MatchChip from "@/components/match-chip";
import clsx from "clsx";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";

interface CandidateSelectionProps {
  project: Partial<Project>;
  candidateList: RoleCandidateList[];
  onChangeProject: (project: Partial<Project>) => void;
  onChangeLoading: (loading: boolean) => void;
  onPreviousClick: () => void;
  onCreateSuccess: (project: Partial<Project>) => void;
  onCreateError: () => void;
}

function CandidateSelection(props: CandidateSelectionProps) {
  const {
    project,
    candidateList,
    onChangeLoading,
    onCreateError,
    onCreateSuccess,
    onChangeProject,
    onPreviousClick,
  } = props;
  const [loading, setLoading] = useState(false);

  const filled = project.roles?.reduce(
    (count, { user }) => count + (user ? 1 : 0),
    0,
  );

  const onCandidateClick = (roleId: string, candidate: Candidate) => {
    onChangeProject({
      ...project,
      roles: project.roles?.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            user: candidate,
            match: candidate.match,
          };
        }

        return role;
      }),
    });
  };

  const onCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    onChangeLoading(true);
    try {
      const createdProject = await createProject(project);
      onCreateSuccess(createdProject);
    } catch (e) {
      onCreateError();
    } finally {
      setLoading(false);
      onChangeLoading(false);
    }
  };

  return (
    <form className="relative" onSubmit={onCreateProject}>
      <div className="flex flex-column gap-4 pb-5">
        {project.roles?.map(({ id, role, description, user, skills }) => {
          const cand = candidateList.find(({ id: roleId }) => roleId === id);
          const candidates = cand?.candidates || [];

          return (
            <div key={id} className="flex flex-column gap-2">
              <h4 className="text-md font-semibold m-0">{role}</h4>
              <p className="m-0 text-color-secondary font-light text-sm">
                {description}
              </p>
              <p className="text-color-secondary font-light m-0 text-xs">
                {skills.join(" • ")}
              </p>
              <div className="w-full overflow-x-auto min-w-0">
                <div className="flex gap-4 py-3 align-items-stretch">
                  {candidates
                    .sort((a, b) => b.match - a.match)
                    .map((candidate) => {
                      const {
                        id: candidateId,
                        avatar,
                        name,
                        match,
                        skills: candidateSkills,
                      } = candidate;
                      const isSelected = user?.id === candidateId;

                      return (
                        <button
                          key={candidate.id}
                          type="button"
                          className={clsx(
                            "relative border-none border-round-xl py-4 flex flex-column gap-2 align-items-center w-18rem flex-shrink-0 cursor-pointer flex-grow-1 border-2 border-transparent",
                            isSelected
                              ? "bg-blue-50 border-blue-200"
                              : "surface-ground",
                          )}
                          onClick={() => onCandidateClick(id, candidate)}
                        >
                          <Avatar
                            image={avatar}
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
                            {name}
                          </p>
                          <p className="m-0 text-center text-sm text-color-secondary mb-2">
                            {role}
                          </p>
                          <MatchChip value={match} />
                          <div className="flex flex-wrap justify-content-center gap-1 mt-2">
                            {candidateSkills.map((name) => (
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
                            checked={isSelected}
                          />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 surface-card sticky bottom-0 left-0 py-3 justify-content-between align-items-center">
        <Button
          rounded
          label="Previous Step"
          className="p-button-sm mr-0"
          type="button"
          severity="secondary"
          disabled={loading}
          onClick={onPreviousClick}
        />
        <p
          className={clsx(
            "m-0 text-sm",
            filled !== project.roles?.length
              ? "text-orange-500"
              : "text-color-secondary",
          )}
        >
          {filled} / {project.roles?.length} Roles filled
        </p>
        <Button
          rounded
          label="Create Project"
          className="p-button-sm mr-0"
          type="submit"
          loading={loading}
          disabled={filled !== project.roles?.length}
        />
      </div>
    </form>
  );
}

export default CandidateSelection;
