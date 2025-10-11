"use client";

interface EvaluationQuestionsStepProps {
  candidateEvaluationQuestions: string[];
  setCandidateEvaluationQuestions: (questions: string[]) => void;
  roleRelatedQuestions: string[];
  setRoleRelatedQuestions: (questions: string[]) => void;
  isGeneratingQuestions: boolean;
}

export function EvaluationQuestionsStep({
  candidateEvaluationQuestions,
  setCandidateEvaluationQuestions,
  roleRelatedQuestions,
  setRoleRelatedQuestions,
  isGeneratingQuestions,
}: EvaluationQuestionsStepProps) {
  // Helper functions for managing questions
  const updateCandidateQuestion = (index: number, newQuestion: string) => {
    setCandidateEvaluationQuestions(
      candidateEvaluationQuestions.map((q, i) =>
        i === index ? newQuestion : q
      )
    );
  };

  const deleteCandidateQuestion = (index: number) => {
    setCandidateEvaluationQuestions(
      candidateEvaluationQuestions.filter((_, i) => i !== index)
    );
  };

  const addCandidateQuestion = () => {
    setCandidateEvaluationQuestions(["", ...candidateEvaluationQuestions]);
  };

  const updateRoleQuestion = (index: number, newQuestion: string) => {
    setRoleRelatedQuestions(
      roleRelatedQuestions.map((q, i) => (i === index ? newQuestion : q))
    );
  };

  const deleteRoleQuestion = (index: number) => {
    setRoleRelatedQuestions(roleRelatedQuestions.filter((_, i) => i !== index));
  };

  const addRoleQuestion = () => {
    setRoleRelatedQuestions(["", ...roleRelatedQuestions]);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-left">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Candidate Evaluation Questions
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Review and customize the evaluation questions for this role.
          </p>
        </div>

        {/* Loading state for question generation */}
        {isGeneratingQuestions && (
          <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <i className="pi pi-spin pi-spinner text-2xl text-primary-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Generating Questions
              </h3>
              <p className="text-sm text-gray-600">
                AI is creating custom evaluation questions for this role...
              </p>
            </div>
          </div>
        )}

        {/* Questions sections - only show when not generating */}
        {!isGeneratingQuestions && (
          <>
            {/* Candidate Evaluation Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold text-gray-800">
                  Candidate Evaluation
                </h4>
                <button
                  onClick={addCandidateQuestion}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <i className="pi pi-plus text-xs" />
                  Add Question
                </button>
              </div>
              <div className="space-y-3">
                {candidateEvaluationQuestions.map((question, index) => (
                  <div key={index} className="">
                    <div className="flex items-center gap-2">
                      <textarea
                        value={question}
                        onChange={(e) =>
                          updateCandidateQuestion(index, e.target.value)
                        }
                        placeholder="Enter evaluation question..."
                        className="flex-1 text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                      <button
                        onClick={() => deleteCandidateQuestion(index)}
                        className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete question"
                      >
                        <i className="pi pi-trash text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role-Related Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold text-gray-800">
                  Role-Related Questions
                </h4>
                <button
                  onClick={addRoleQuestion}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <i className="pi pi-plus text-xs" />
                  Add Question
                </button>
              </div>
              <div className="space-y-3">
                {roleRelatedQuestions.map((question, index) => (
                  <div key={index} className="">
                    <div className="flex items-center gap-3">
                      <textarea
                        value={question}
                        onChange={(e) =>
                          updateRoleQuestion(index, e.target.value)
                        }
                        placeholder="Enter role-related question..."
                        className="flex-1 text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                      <button
                        onClick={() => deleteRoleQuestion(index)}
                        className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete question"
                      >
                        <i className="pi pi-trash text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
