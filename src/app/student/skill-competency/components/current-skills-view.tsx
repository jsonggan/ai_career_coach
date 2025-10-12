"use client";

import { useState } from "react";

interface Skill {
  id: string;
  name: string;
  category: "hard" | "soft";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  certificates: number;
  projects: number;
  courses: number;
}

interface CurrentSkillsViewProps {
  showHardSkillsOnly?: boolean;
}

export default function CurrentSkillsView({ showHardSkillsOnly = false }: CurrentSkillsViewProps) {
  // Mock data - in real app, this would come from API/database
  const [skills] = useState<Skill[]>([
    {
      id: "1",
      name: "JavaScript",
      category: "hard",
      level: "intermediate",
      certificates: 2,
      projects: 5,
      courses: 3
    },
    {
      id: "2",
      name: "React",
      category: "hard",
      level: "intermediate",
      certificates: 1,
      projects: 4,
      courses: 2
    },
    {
      id: "3",
      name: "Python",
      category: "hard",
      level: "beginner",
      certificates: 0,
      projects: 2,
      courses: 1
    },
    {
      id: "4",
      name: "Data Structures",
      category: "hard",
      level: "advanced",
      certificates: 1,
      projects: 3,
      courses: 4
    },
    {
      id: "5",
      name: "Communication",
      category: "soft",
      level: "intermediate",
      certificates: 0,
      projects: 0,
      courses: 2
    },
    {
      id: "6",
      name: "Teamwork",
      category: "soft",
      level: "advanced",
      certificates: 0,
      projects: 6,
      courses: 1
    },
    {
      id: "7",
      name: "Problem Solving",
      category: "soft",
      level: "intermediate",
      certificates: 0,
      projects: 8,
      courses: 2
    },
    {
      id: "8",
      name: "Machine Learning",
      category: "hard",
      level: "beginner",
      certificates: 0,
      projects: 1,
      courses: 1
    }
  ]);

  const filteredSkills = showHardSkillsOnly 
    ? skills.filter(skill => skill.category === "hard")
    : skills;

  const hardSkills = skills.filter(skill => skill.category === "hard");
  const softSkills = skills.filter(skill => skill.category === "soft");

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-yellow-100 text-yellow-800";
      case "intermediate": return "bg-blue-100 text-blue-800";
      case "advanced": return "bg-green-100 text-green-800";
      case "expert": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (total: number) => {
    if (total >= 8) return "bg-green-500";
    if (total >= 5) return "bg-blue-500";
    if (total >= 2) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {showHardSkillsOnly ? "Hard Skills" : "Current Skills"}
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Total: {filteredSkills.length}</span>
          {!showHardSkillsOnly && (
            <>
              <span>Hard: {hardSkills.length}</span>
              <span>Soft: {softSkills.length}</span>
            </>
          )}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div key={skill.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{skill.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                {skill.level}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{skill.certificates}</div>
                <div className="text-xs text-gray-500">Certificates</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{skill.projects}</div>
                <div className="text-xs text-gray-500">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{skill.courses}</div>
                <div className="text-xs text-gray-500">Courses</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Total: {skill.certificates + skill.projects + skill.courses} items
              </div>
              <div className={`w-3 h-3 rounded-full ${getProgressColor(skill.certificates + skill.projects + skill.courses)}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Skill Button */}
      <div className="mt-6 pt-4 border-t">
        <button className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
          + Add New Skill
        </button>
      </div>
    </div>
  );
}
