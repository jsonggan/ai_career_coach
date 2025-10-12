"use client";

import { useState } from "react";
import CurrentSkillsView from "./current-skills-view";
import AISkillSuggestions from "./ai-skill-suggestions";
import CourseRecommendations from "./course-recommendations";
import ProjectIdeaGenerator from "./project-idea-generator";
import SoftSkillsSection from "./soft-skills-section";
import SkillsetAnalysis from "./skillset-analysis";

export default function SkillCompetencyClient() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "hard-skills", label: "Hard Skills", icon: "💻" },
    { id: "soft-skills", label: "Soft Skills", icon: "🤝" },
    { id: "recommendations", label: "Recommendations", icon: "💡" },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Competency</h1>
          <p className="text-lg text-gray-600">
            Track your academic skills, get AI-powered recommendations, and monitor your progress throughout your educational journey.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <CurrentSkillsView />
              <SkillsetAnalysis />
            </div>
          )}

          {activeTab === "hard-skills" && (
            <div className="space-y-8">
              <CurrentSkillsView showHardSkillsOnly={true} />
              <AISkillSuggestions />
            </div>
          )}

          {activeTab === "soft-skills" && (
            <SoftSkillsSection />
          )}

          {activeTab === "recommendations" && (
            <div className="space-y-8">
              <AISkillSuggestions />
              <CourseRecommendations />
              <ProjectIdeaGenerator />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
