"use client";

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

interface CandidateSearchStepProps {
  newRoleId: number | null;
  isSearchingCandidates: boolean;
  searchProgress: {
    message: string;
    progress?: { current: number; total: number; step: string };
  };
  toolProgress: {
    name: string;
    type: string;
    message: string;
    progress?: { current: number; total: number; round: number };
  } | null;
  searchComplete: boolean;
  searchResult: any;
  title: string;
  description: string;
  selectedSkills: string[];
  yearsOfExperience: string;
  department: string;
  editedJD: string;
  generatedJD: string;
  candidateEvaluationQuestions: string[];
  roleRelatedQuestions: string[];
  onNext: (roleData: RoleData) => void;
}

export function CandidateSearchStep({
  newRoleId,
  isSearchingCandidates,
  searchProgress,
  toolProgress,
  searchComplete,
  searchResult,
  title,
  description,
  selectedSkills,
  yearsOfExperience,
  department,
  editedJD,
  generatedJD,
  candidateEvaluationQuestions,
  roleRelatedQuestions,
  onNext,
}: CandidateSearchStepProps) {
  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {searchComplete
              ? "🎉 Candidate Search Complete!"
              : "🔍 Finding Best Candidates"}
          </h3>
          <p className="text-gray-600">
            {searchComplete
              ? "AI has successfully analyzed candidates for your role"
              : "Our AI is analyzing candidate profiles and matching them to your role requirements"}
          </p>
        </div>

        {/* Progress Section */}
        {!searchComplete && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            {/* Overall Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                {searchProgress.progress && (
                  <span className="text-sm text-gray-500">
                    {searchProgress.progress.current}/
                    {searchProgress.progress.total}
                  </span>
                )}
              </div>

              {searchProgress.progress && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(searchProgress.progress.current / searchProgress.progress.total) * 100}%`,
                    }}
                  ></div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {isSearchingCandidates && (
                  <i className="pi pi-spin pi-spinner text-primary-600 text-sm" />
                )}
                <span className="text-sm text-gray-700">
                  {searchProgress.message}
                </span>
              </div>
            </div>

            {/* Tool Progress */}
            {toolProgress && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Current Tool: {toolProgress.name}
                  </span>
                  {toolProgress.progress && (
                    <span className="text-sm text-gray-500">
                      Round {toolProgress.progress.round} -{" "}
                      {toolProgress.progress.current}/
                      {toolProgress.progress.total}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {toolProgress.type === "start" ||
                  toolProgress.type === "progress" ? (
                    <i className="pi pi-spin pi-spinner text-green-600 text-xs" />
                  ) : (
                    <i className="pi pi-check text-green-600 text-xs" />
                  )}
                  <span className="text-xs text-gray-600">
                    {toolProgress.message}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completion Section */}
        {searchComplete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <i className="pi pi-check text-white text-sm" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">
                  Search Complete!
                </h4>
                <p className="text-sm text-green-700">
                  {typeof searchResult === "number"
                    ? `Found and processed ${searchResult} candidates`
                    : "Successfully completed candidate analysis"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href={`/roles/${newRoleId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <i className="pi pi-external-link text-sm" />
                View Role & Candidates
              </a>
              <button
                onClick={() => {
                  const roleData = {
                    title: title.trim(),
                    description: description.trim(),
                    skills: selectedSkills,
                    yearsOfExperience: yearsOfExperience,
                    department: department,
                    jobDescription: editedJD || generatedJD || "",
                    candidateEvaluationQuestions:
                      candidateEvaluationQuestions.filter(
                        (q) => q.trim() !== ""
                      ),
                    roleRelatedQuestions: roleRelatedQuestions.filter(
                      (q) => q.trim() !== ""
                    ),
                  };
                  onNext(roleData);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <i className="pi pi-times text-sm" />
                Close
              </button>
            </div>
          </div>
        )}

        {/* Search Process Info */}
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="pi pi-info-circle text-primary-600 text-sm mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">
                What&apos;s happening behind the scenes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Analyzing role requirements and extracting key skills</li>
                <li>
                  Searching through employee database for potential matches
                </li>
                <li>Evaluating candidate profiles against role criteria</li>
                <li>Ranking and finalizing the best candidate matches</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
