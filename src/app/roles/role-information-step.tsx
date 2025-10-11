"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface RoleInformationStepProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  yearsOfExperience: string;
  setYearsOfExperience: (years: string) => void;
  department: string;
  setDepartment: (department: string) => void;
}

export function RoleInformationStep({
  title,
  setTitle,
  description,
  setDescription,
  selectedSkills,
  setSelectedSkills,
  yearsOfExperience,
  setYearsOfExperience,
  department,
  setDepartment,
}: RoleInformationStepProps) {
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomSkill, setShowCustomSkill] = useState(false);
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);

  const departmentOptions = [
    "Army",
    "Navy (RSN)",
    "Air Force (RSAF)",
    "Cyber Defence",
    "Intelligence",
    "Logistics",
    "Medical",
    "Engineering",
    "Training",
    "Administration",
    "Joint Operations",
    "Special Operations",
    "DSTA",
    "DSO",
    "MINDEF HQ",
  ];

  const generateSkills = async () => {
    if (!title.trim() || !description.trim() || !yearsOfExperience) {
      return;
    }

    setIsGeneratingSkills(true);
    try {
      const response = await fetch("/api/v1/roles/generate-skill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleTitle: title.trim(),
          roleDescription: description.trim(),
          yearsOfExperience,
          department: department || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate skills");
      }

      const data = await response.json();
      setRecommendedSkills(data.skills || []);
    } catch (error) {
      console.error("Error generating skills:", error);
      toast.error("Failed to generate skills. Please try again.");
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(
      selectedSkills.includes(skill)
        ? selectedSkills.filter((s) => s !== skill)
        : [...selectedSkills, skill]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
      setShowCustomSkill(false);
    }
  };

  return (
    <>
      <div className="flex items-start gap-2 p-3 bg-primary-50 rounded-lg">
        <i className="pi pi-info-circle text-primary-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-primary-800">
          <p className="font-medium mb-1">
            Tips for creating effective role descriptions:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Be specific about key responsibilities and daily tasks</li>
            <li>Include required qualifications and experience levels</li>
            <li>
              Mention any special requirements (security clearance,
              certifications)
            </li>
            <li>Describe the role&apos;s impact on mission objectives</li>
            <li>Include reporting structure and team dynamics</li>
          </ul>
        </div>
      </div>

      {/* Role Title */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Role Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g., Joint Task Force Commander, Operations Planner (J3), Intelligence Analyst (J2)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Role Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Role Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          placeholder="Describe the role responsibilities, requirements, and key functions. Include details about operational duties, leadership requirements, technical skills needed, and how this role contributes to mission success..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Years of Experience and Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700"
          >
            Preferred Years of Experience{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            id="experience"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select experience level</option>
            <option value="0-2">0-2 years (Entry Level)</option>
            <option value="3-5">3-5 years (Mid Level)</option>
            <option value="6-10">6-10 years (Senior Level)</option>
            <option value="11-15">11-15 years (Expert Level)</option>
            <option value="16+">16+ years (Leadership Level)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department (Optional)
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select department</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommended Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Recommended Skills
            </h3>
            <button
              onClick={generateSkills}
              disabled={
                !title.trim() ||
                !description.trim() ||
                !yearsOfExperience ||
                isGeneratingSkills
              }
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isGeneratingSkills ? (
                <>
                  <i className="pi pi-spin pi-spinner text-xs" />
                  Generating...
                </>
              ) : (
                <>Generate Skills</>
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {selectedSkills.length} skill
              {selectedSkills.length !== 1 ? "s" : ""} selected
            </span>
          </div>
        </div>

        {recommendedSkills.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {recommendedSkills.map((skill) => (
              <div
                key={skill}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedSkills.includes(skill)
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleSkillToggle(skill)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {skill}
                  </span>
                  {selectedSkills.includes(skill) && (
                    <i className="pi pi-check text-primary-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Skills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Additional Skills
          </h3>
          {!showCustomSkill && (
            <button
              onClick={() => setShowCustomSkill(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <i className="pi pi-plus" />
              Add Custom Skill
            </button>
          )}
        </div>

        {showCustomSkill && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter custom skill"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomSkill()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={handleAddCustomSkill}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowCustomSkill(false);
                setCustomSkill("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Selected Skills */}
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <div
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm capitalize"
              >
                {skill}
                <i
                  className="pi pi-times cursor-pointer hover:text-red-500 text-xs"
                  onClick={() => handleSkillToggle(skill)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
