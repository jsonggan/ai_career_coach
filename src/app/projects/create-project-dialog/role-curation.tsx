"use client";

import { useState } from "react";
import { Project, RoleCandidateList } from "@/app/api/projects/types";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { suggestProjectCandidateList } from "@/backend/projects";

interface RoleCurationProps {
  project: Partial<Project>;
  onChangeLoading: (loading: boolean) => void;
  onChangeCandidateList: (candidateList: RoleCandidateList[]) => void;
  onPreviousClick: () => void;
  onGenerateCandidatesSuccess: () => void;
  onGenerateCandidatesError: () => void;
}

function RoleCuration(props: RoleCurationProps) {
  const {
    project,
    onChangeLoading,
    onChangeCandidateList,
    onGenerateCandidatesError,
    onGenerateCandidatesSuccess,
    onPreviousClick,
  } = props;
  const [loading, setLoading] = useState(false);

  const onSuggestCandidates = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    onChangeLoading(true);
    try {
      const candidateList = await suggestProjectCandidateList(project);
      onChangeCandidateList(candidateList);
      onGenerateCandidatesSuccess();
    } catch (e) {
      onGenerateCandidatesError();
    } finally {
      setLoading(false);
      onChangeLoading(false);
    }
  };

  return (
    <form className="relative" onSubmit={onSuggestCandidates}>
      <div className="flex flex-column gap-4 pb-5">
        {project.roles?.map(({ id, role, description, skills }) => (
          <div key={id} className="flex">
            <div className="flex flex-column">
              <h4 className="text-lg font-semibold m-0 mb-2">{role}</h4>
              <p className="m-0 text-color-secondary font-light">
                {description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    pt={{
                      root: {
                        className: "bg-blue-50 py-1 px-2",
                      },
                      label: {
                        className: "text-blue-500 text-sm m-0 mx-1",
                      },
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-content-between gap-2 surface-card sticky bottom-0 left-0 py-3">
        <Button
          rounded
          label="Previous Step"
          className="p-button-sm mr-0"
          type="button"
          severity="secondary"
          disabled={loading}
          onClick={onPreviousClick}
        />
        <Button
          rounded
          label={
            loading ? "Finding Potential Candidates..." : "Select Candidates"
          }
          className="p-button-sm mr-0"
          type="submit"
          loading={loading}
        />
      </div>
    </form>
  );
}

export default RoleCuration;
