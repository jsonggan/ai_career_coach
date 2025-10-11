"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RoleInformationStep } from "./role-information-step";
import { JobDescriptionStep } from "./job-description-step";
import { EvaluationQuestionsStep } from "./evaluation-questions-step";
import { CandidateSearchStep } from "./candidate-search-step";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (roleData: RoleData) => void;
}

interface RoleData {
  title: string;
  description: string;
  skills: string[];
  yearsOfExperience: string;
  department: string;
  jobDescription?: string;
  candidateEvaluationQuestions?: string[];
  roleRelatedQuestions?: string[];
}

export function CreateRoleModal({
  isOpen,
  onClose,
  onNext,
}: CreateRoleModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [department, setDepartment] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);
  const [generatedJD, setGeneratedJD] = useState<string>("");
  const [editedJD, setEditedJD] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // State for candidate search (step 4)
  const [newRoleId, setNewRoleId] = useState<number | null>(null);
  const [isSearchingCandidates, setIsSearchingCandidates] = useState(false);
  const [searchProgress, setSearchProgress] = useState<{
    message: string;
    progress?: { current: number; total: number; step: string };
  }>({ message: "" });
  const [toolProgress, setToolProgress] = useState<{
    name: string;
    type: string;
    message: string;
    progress?: { current: number; total: number; round: number };
  } | null>(null);
  const [searchComplete, setSearchComplete] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  // State for editable questions - initially empty, populated by AI
  const [candidateEvaluationQuestions, setCandidateEvaluationQuestions] =
    useState<string[]>([]);

  const [roleRelatedQuestions, setRoleRelatedQuestions] = useState<string[]>(
    []
  );

  // Handle modal visibility and body scroll
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const generateJobDescription = async () => {
    setIsGeneratingJD(true);
    try {
      const response = await fetch("/api/v1/roles/generate-jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleTitle: title.trim(),
          roleDescription: description.trim(),
          yearsOfExperience: yearsOfExperience,
          department: department || undefined,
          skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate job description");
      }

      const data = await response.json();
      setGeneratedJD(data.job_description || "");
    } catch (error) {
      console.error("Error generating job description:", error);
      setGeneratedJD("Error generating job description. Please try again.");
    } finally {
      setIsGeneratingJD(false);
    }
  };

  const generateQuestions = async () => {
    if (!title.trim() || !description.trim() || !yearsOfExperience) {
      toast.error("Please complete the role information first");
      return;
    }

    // Use the job description from step 2 if available, otherwise use the initial description
    const jobDescriptionToUse = editedJD || generatedJD || description.trim();

    setIsGeneratingQuestions(true);
    try {
      const response = await fetch("/api/v1/roles/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleTitle: title.trim(),
          roleDescription: jobDescriptionToUse,
          yearsOfExperience: yearsOfExperience,
          department: department || undefined,
          skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();

      console.log("Generated questions response:", data);

      // Update the questions with generated content
      // The response has questions nested under 'skills' object
      if (
        data.skills?.candidateEvaluationQuestions &&
        Array.isArray(data.skills.candidateEvaluationQuestions)
      ) {
        setCandidateEvaluationQuestions(
          data.skills.candidateEvaluationQuestions
        );
      }

      if (
        data.skills?.roleRelatedQuestions &&
        Array.isArray(data.skills.roleRelatedQuestions)
      ) {
        setRoleRelatedQuestions(data.skills.roleRelatedQuestions);
      }

      toast.success("Questions generated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const startCandidateSearch = async (roleId: number) => {
    setIsSearchingCandidates(true);
    setSearchComplete(false);
    setSearchProgress({ message: "Connecting to candidate search system..." });

    try {
      const response = await fetch("/api/v1/roles/search-candidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_role_id: roleId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          let currentEvent = "";
          for (const line of lines) {
            if (line.startsWith("event:")) {
              currentEvent = line.substring(6).trim();
            } else if (line.startsWith("data:")) {
              try {
                const data = JSON.parse(line.substring(5).trim());

                switch (currentEvent) {
                  case "status":
                    setSearchProgress({
                      message: data.message,
                      progress: data.progress,
                    });
                    if (data.type === "complete") {
                      setSearchComplete(true);
                      setIsSearchingCandidates(false);
                    }
                    break;
                  case "tool":
                    setToolProgress({
                      name: data.name,
                      type: data.type,
                      message: data.message,
                      progress: data.progress,
                    });
                    break;
                  case "result":
                    setSearchResult(data);
                    break;
                  case "error":
                    console.error("Search error:", data.message);
                    toast.error(data.message, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    });
                    setIsSearchingCandidates(false);
                    break;
                }
              } catch (e) {
                console.error("Failed to parse SSE data:", e);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error: any) {
      console.error("Error during candidate search:", error);
      setSearchProgress({ message: `Error: ${error.message}` });
      setIsSearchingCandidates(false);
      toast.error(`Failed to search candidates: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Auto-generate questions when we reach step 3
  useEffect(() => {
    if (
      currentStep === 3 &&
      !isGeneratingQuestions &&
      candidateEvaluationQuestions.length === 0 &&
      roleRelatedQuestions.length === 0
    ) {
      generateQuestions();
    }
  }, [currentStep]);

  // Auto-start candidate search when we reach step 4
  useEffect(() => {
    if (
      currentStep === 4 &&
      newRoleId &&
      !isSearchingCandidates &&
      !searchComplete
    ) {
      startCandidateSearch(newRoleId);
    }
  }, [currentStep, newRoleId]);

  const handleNext = async () => {
    if (currentStep === 1) {
      if (
        title.trim() &&
        description.trim() &&
        selectedSkills.length > 0 &&
        yearsOfExperience
      ) {
        setCurrentStep(2);
        await generateJobDescription();
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      await handleCreateRole();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateRole = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/v1/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleTitle: title.trim(),
          roleDescription: description.trim(),
          roleDescriptionAi: editedJD || generatedJD || "",
          yearsOfExperience: yearsOfExperience,
          department: department || undefined,
          skills: selectedSkills,
          candidateEvaluationQuestions: candidateEvaluationQuestions.filter(
            (q) => q.trim() !== ""
          ),
          roleRelatedQuestions: roleRelatedQuestions.filter(
            (q) => q.trim() !== ""
          ),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create role");
      }

      const result = await response.json();

      // Store the new role ID and move to candidate search step
      setNewRoleId(result.newRoleId || result.id);
      setCurrentStep(4);

      toast.success(
        `Role "${title.trim()}" has been created successfully! Now searching for candidates...`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the transition duration
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <div className="fixed z-50 inset-0">
        <div
          className={`fixed inset-0 bg-black z-0 transition-opacity duration-300 ${
            isVisible ? "bg-opacity-50" : "bg-opacity-0"
          }`}
          onClick={handleClose}
        />
        <div className="flex h-full min-h-full items-center justify-center z-50">
          <div
            className={`relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
              isVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Role
                  </h2>
                  <div className="mt-2">
                    {/* Step Progress Indicator */}
                    <div className="flex items-center mt-3">
                      {[
                        { step: 1, label: "Role Information" },
                        { step: 2, label: "Job Description" },
                        { step: 3, label: "Evaluation Questions" },
                        { step: 4, label: "Find Candidates" },
                      ].map(({ step, label }, index) => (
                        <div key={step} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                step <= currentStep
                                  ? "bg-primary-600 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {step}
                            </div>
                            <span
                              className={`text-xs mt-1 text-center ${
                                step <= currentStep
                                  ? "text-primary-600 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                          {index < 3 && (
                            <div
                              className={`w-16 mx-2 h-0.5 mb-5 ${
                                step < currentStep
                                  ? "bg-primary-600"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="pi pi-times text-xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Step 1: Role Information */}
              {currentStep === 1 && (
                <RoleInformationStep
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  selectedSkills={selectedSkills}
                  setSelectedSkills={setSelectedSkills}
                  yearsOfExperience={yearsOfExperience}
                  setYearsOfExperience={setYearsOfExperience}
                  department={department}
                  setDepartment={setDepartment}
                />
              )}

              {/* Step 2: Job Description */}
              {currentStep === 2 && (
                <JobDescriptionStep
                  generatedJD={generatedJD}
                  editedJD={editedJD}
                  setEditedJD={setEditedJD}
                  isGeneratingJD={isGeneratingJD}
                />
              )}

              {/* Step 3: Evaluation Questions */}
              {currentStep === 3 && (
                <EvaluationQuestionsStep
                  candidateEvaluationQuestions={candidateEvaluationQuestions}
                  setCandidateEvaluationQuestions={
                    setCandidateEvaluationQuestions
                  }
                  roleRelatedQuestions={roleRelatedQuestions}
                  setRoleRelatedQuestions={setRoleRelatedQuestions}
                  isGeneratingQuestions={isGeneratingQuestions}
                />
              )}

              {/* Step 4: Candidate Search */}
              {currentStep === 4 && (
                <CandidateSearchStep
                  newRoleId={newRoleId}
                  isSearchingCandidates={isSearchingCandidates}
                  searchProgress={searchProgress}
                  toolProgress={toolProgress}
                  searchComplete={searchComplete}
                  searchResult={searchResult}
                  title={title}
                  description={description}
                  selectedSkills={selectedSkills}
                  yearsOfExperience={yearsOfExperience}
                  department={department}
                  editedJD={editedJD}
                  generatedJD={generatedJD}
                  candidateEvaluationQuestions={candidateEvaluationQuestions}
                  roleRelatedQuestions={roleRelatedQuestions}
                  onNext={onNext}
                />
              )}
            </div>

            {/* Footer */}
            {currentStep < 4 && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <i className="pi pi-arrow-left" />
                        Back
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={
                        (currentStep === 1 &&
                          (!title.trim() ||
                            !description.trim() ||
                            selectedSkills.length === 0 ||
                            !yearsOfExperience)) ||
                        (currentStep === 3 && isCreating)
                      }
                      className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                        (currentStep === 1 &&
                          (!title.trim() ||
                            !description.trim() ||
                            selectedSkills.length === 0 ||
                            !yearsOfExperience)) ||
                        (currentStep === 3 && isCreating)
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary-600 text-white hover:bg-primary-700"
                      }`}
                    >
                      {currentStep === 3 && isCreating ? (
                        <>
                          <i className="pi pi-spin pi-spinner text-sm" />
                          Creating Role...
                        </>
                      ) : currentStep === 3 ? (
                        <>
                          <i className="pi pi-check" />
                          Create Role
                        </>
                      ) : (
                        "Next"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
