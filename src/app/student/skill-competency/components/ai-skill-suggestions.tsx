"use client";

import { useState } from "react";

interface SkillGap {
  skill: string;
  importance: "high" | "medium" | "low";
  demand: number; // percentage of job postings requiring this skill
  reason: string;
  category: "technical" | "soft" | "domain";
}

interface CareerPath {
  id: string;
  name: string;
  match: number; // percentage match with user's current skills
  requiredSkills: string[];
  missingSkills: string[];
}

export default function AISkillSuggestions() {
  const [selectedCareerPath, setSelectedCareerPath] = useState<string>("software-engineer");

  // Mock data - in real app, this would come from AI analysis
  const skillGaps: SkillGap[] = [
    {
      skill: "Machine Learning",
      importance: "high",
      demand: 78,
      reason: "High demand in current job market, especially for fresh graduates in tech roles",
      category: "technical"
    },
    {
      skill: "Cloud Computing (AWS/Azure)",
      importance: "high",
      demand: 85,
      reason: "Essential for modern software development and deployment",
      category: "technical"
    },
    {
      skill: "System Design",
      importance: "medium",
      demand: 65,
      reason: "Important for senior roles and technical interviews",
      category: "technical"
    },
    {
      skill: "Leadership",
      importance: "medium",
      demand: 45,
      reason: "Valuable for career progression and team management roles",
      category: "soft"
    },
    {
      skill: "Data Analysis",
      importance: "high",
      demand: 72,
      reason: "Growing field with high demand across industries",
      category: "domain"
    }
  ];

  const careerPaths: CareerPath[] = [
    {
      id: "software-engineer",
      name: "Software Engineer",
      match: 75,
      requiredSkills: ["JavaScript", "React", "Python", "System Design", "Cloud Computing"],
      missingSkills: ["System Design", "Cloud Computing"]
    },
    {
      id: "data-scientist",
      name: "Data Scientist",
      match: 45,
      requiredSkills: ["Python", "Machine Learning", "Data Analysis", "Statistics", "SQL"],
      missingSkills: ["Machine Learning", "Statistics", "SQL"]
    },
    {
      id: "product-manager",
      name: "Product Manager",
      match: 60,
      requiredSkills: ["Communication", "Problem Solving", "Leadership", "Data Analysis", "Business Strategy"],
      missingSkills: ["Leadership", "Business Strategy"]
    }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical": return "💻";
      case "soft": return "🤝";
      case "domain": return "📊";
      default: return "📋";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Skill Gap Analysis</h2>
        <p className="text-gray-600">
          Based on your current skills and career path selection, here are the skills you should focus on developing.
        </p>
      </div>

      {/* Career Path Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Your Career Path</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {careerPaths.map((path) => (
            <div
              key={path.id}
              onClick={() => setSelectedCareerPath(path.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedCareerPath === path.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{path.name}</h4>
                <span className="text-sm font-medium text-blue-600">{path.match}% match</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>Required: {path.requiredSkills.length} skills</div>
                <div>Missing: {path.missingSkills.length} skills</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Skills to Develop</h3>
        <div className="space-y-4">
          {skillGaps.map((gap, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(gap.category)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{gap.skill}</h4>
                    <p className="text-sm text-gray-600 capitalize">{gap.category} Skill</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getImportanceColor(gap.importance)}`}>
                    {gap.importance} priority
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{gap.demand}%</div>
                    <div className="text-xs text-gray-500">job demand</div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{gap.reason}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>📈 High demand</span>
                  <span>🎯 Career relevant</span>
                </div>
                <div className="text-sm text-gray-600">
                  Priority: {gap.importance}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Market Analysis</h4>
            <p className="text-blue-800 text-sm">
              Based on current job market trends and your selected career path, Machine Learning and Cloud Computing 
              show the highest demand growth. These skills appear in 78% and 85% of relevant job postings respectively. 
              Focus on these high-impact areas to maximize your career opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
