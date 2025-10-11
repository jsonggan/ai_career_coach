"use client";

import { Project } from "@/app/api/projects/types";
import { suggestProjectRolesAndObjectives } from "@/backend/projects";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

interface PromptCreationProps {
  project: Partial<Project>;
  onChangeProject: (project: Partial<Project>) => void;
  onChangeLoading: (loading: boolean) => void;
  onGenerateRolesSuccess: () => void;
  onGenerateRolesError: () => void;
}

function PromptCreation(props: PromptCreationProps) {
  const {
    project,
    onChangeProject,
    onChangeLoading,
    onGenerateRolesSuccess,
    onGenerateRolesError,
  } = props;
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const onSuggestRoles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    onChangeLoading(true);
    try {
      const newProject = await suggestProjectRolesAndObjectives(project);
      onChangeProject(newProject);
      onGenerateRolesSuccess();
    } catch (e) {
      onGenerateRolesError();
    } finally {
      setLoading(false);
      onChangeLoading(false);
    }
  };

  return (
    <form onSubmit={onSuggestRoles} className="relative">
      <div className="flex-auto">
        <label htmlFor="name" className="text-sm font-light block mb-2">
          Project Name <span className="text-red-500">*</span>
        </label>
        <InputText
          id="name"
          className="p-inputtext-sm w-full"
          placeholder="e.g. Awesome AI Project"
          value={project.name}
          onChange={(e) =>
            onChangeProject({
              ...project,
              name: e.target.value,
            })
          }
        />
      </div>
      <div className="flex-auto mt-5">
        <label htmlFor="duration" className="text-sm font-light block mb-2">
          Duration <span className="text-red-500">*</span>
        </label>
        <div className="flex align-items-center gap-4">
          <p className="font-light text-sm">From</p>
          <Calendar
            pt={{
              input: {
                root: {
                  className: "p-inputtext-sm",
                },
              },
            }}
            placeholder="dd/mm/yyyy"
            dateFormat="d MM yy"
            value={project.start ? new Date(project.start) : undefined}
            onChange={(e) =>
              onChangeProject({
                ...project,
                start: e?.value?.toISOString(),
              })
            }
          />
          <p className="font-light text-sm">till</p>
          <Calendar
            pt={{
              input: {
                root: {
                  className: "p-inputtext-sm",
                },
              },
            }}
            placeholder="dd/mm/yyyy"
            dateFormat="d MM yy"
            disabled={!project.start}
            minDate={project.start ? new Date(project.start) : undefined}
            value={project.end ? new Date(project.end) : undefined}
            onChange={(e) =>
              onChangeProject({
                ...project,
                end: e?.value?.toISOString(),
              })
            }
          />
        </div>
      </div>
      <div className="flex-auto mt-5 mb-3">
        <label htmlFor="description" className="text-sm font-light block mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <MDEditor
          value={project.description || ""}
          onChange={(value) =>
            onChangeProject({ ...project, description: value })
          }
          preview={isPreviewOpen ? "live" : "edit"}
          fullscreen={false}
          height={200}
          hideToolbar
          textareaProps={{
            placeholder: "Write something about the project...",
          }}
        />
        <div className="flex justify-content-end mt-2">
          <Button
            text
            className="p-0"
            pt={{
              label: {
                className: "font-light text-xs",
              },
            }}
            type="button"
            label={isPreviewOpen ? "Close Preview" : "Show Preview"}
            onClick={() => setIsPreviewOpen((curr) => !curr)}
          />
        </div>
      </div>
      <div className="flex justify-content-end gap-2 surface-card sticky bottom-0 left-0 py-3">
        <Button
          rounded
          label={loading ? "Curating Roles..." : "Curate Roles"}
          className="p-button-sm mr-0"
          type="submit"
          loading={loading}
          disabled={
            !project.name ||
            !project.start ||
            !project.end ||
            !project.description
          }
        />
      </div>
    </form>
  );
}

export default PromptCreation;
