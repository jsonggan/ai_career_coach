"use client";

interface JobDescriptionStepProps {
  generatedJD: string;
  editedJD: string;
  setEditedJD: (jd: string) => void;
  isGeneratingJD: boolean;
}

export function JobDescriptionStep({
  generatedJD,
  editedJD,
  setEditedJD,
  isGeneratingJD,
}: JobDescriptionStepProps) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Job Description</h3>
          {isGeneratingJD && (
            <div className="flex items-center gap-2 text-blue-600">
              <i className="pi pi-spin pi-spinner text-sm" />
              <span className="text-sm">Generating...</span>
            </div>
          )}
        </div>

        <textarea
          value={editedJD || generatedJD}
          onChange={(e) => setEditedJD(e.target.value)}
          disabled={isGeneratingJD}
          className={`w-full min-h-96 font-mono text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${
            isGeneratingJD ? "bg-gray-50 cursor-not-allowed" : ""
          }`}
          placeholder={
            isGeneratingJD
              ? "Generating job description..."
              : "Edit the job description..."
          }
        />
      </div>
    </>
  );
}
