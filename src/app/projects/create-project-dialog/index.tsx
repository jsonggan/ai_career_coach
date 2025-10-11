"use client";

import { useEffect, useRef, useState } from "react";
import { Project, RoleCandidateList } from "@/app/api/projects/types";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PromptCreation from "./prompt-creation";
import RoleCuration from "./role-curation";
import CandidateSelection from "./candidate-selection";
import { useProjectList } from "@/query/projects";
import { useCreateProjectDialogStore } from "@/store/create-dialog";

const initialProject = {
  client: "Confidential",
  status: "New",
};

function CreateProjectDialog() {
  const toastRef = useRef<Toast>(null);
  const { refetch } = useProjectList();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { open, params, closeDialog } = useCreateProjectDialogStore();
  const [candidateList, setCandidateList] = useState<RoleCandidateList[]>([]);
  const [project, setProject] = useState<Partial<Project>>(initialProject);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (params) {
      setProject((curr) => ({
        ...curr,
        ...params,
      }));
    }
  }, [open, params]);

  return (
    <>
      <Dialog
        visible={open}
        onHide={closeDialog}
        header={currentStep === 0 ? "Create New Project" : project.name}
        style={{
          width: "30vw",
        }}
        breakpoints={{
          "1800px": "40vw",
          "1300px": "50vw",
          "960px": "50vw",
          "768px": "80vw",
          "640px": "100vw",
        }}
        pt={{
          closeButton: {
            className: loading ? "hidden" : "flex",
          },
          content: {
            className: "pb-0",
          },
        }}
      >
        {currentStep === 0 && (
          <PromptCreation
            project={project}
            onChangeProject={setProject}
            onChangeLoading={setLoading}
            onGenerateRolesError={() =>
              toastRef.current?.show({
                severity: "error",
                summary: "Something went wrong",
                detail:
                  "We had some issues generating the project roles and objectives. Please try again later.",
              })
            }
            onGenerateRolesSuccess={() => setCurrentStep((curr) => curr + 1)}
          />
        )}
        {currentStep === 1 && (
          <RoleCuration
            project={project}
            onChangeLoading={setLoading}
            onPreviousClick={() => setCurrentStep((curr) => curr - 1)}
            onGenerateCandidatesSuccess={() =>
              setCurrentStep((curr) => curr + 1)
            }
            onChangeCandidateList={setCandidateList}
            onGenerateCandidatesError={() =>
              toastRef.current?.show({
                severity: "error",
                summary: "Something went wrong",
                detail:
                  "We had some issues finding candidates. Please try again later.",
              })
            }
          />
        )}
        {currentStep === 2 && (
          <CandidateSelection
            project={project}
            candidateList={candidateList}
            onChangeProject={setProject}
            onChangeLoading={setLoading}
            onPreviousClick={() => setCurrentStep((curr) => curr - 1)}
            onCreateSuccess={(project) => {
              closeDialog();
              refetch();
              setCurrentStep(0);
              setProject(initialProject);
              setCandidateList([]);
              setLoading(false);
              toastRef.current?.show({
                severity: "success",
                summary: "Project Created",
                detail: `Project ${project.name} has been created successfully`,
              });
            }}
            onCreateError={() =>
              toastRef.current?.show({
                severity: "error",
                summary: "Something went wrong",
                detail:
                  "We had some issues creating the project. Please try again later.",
              })
            }
          />
        )}
      </Dialog>
      <Toast ref={toastRef} position="bottom-right" />
    </>
  );
}

export default CreateProjectDialog;
