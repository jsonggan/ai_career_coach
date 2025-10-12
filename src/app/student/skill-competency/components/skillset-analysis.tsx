"use client";

import { useState } from "react";

interface SkillCategory {
  name: string;
  skills: string[];
  keyStrengths: string[];
  keyWeaknesses: string[];
  totalSkills: number;
  trend: "up" | "down" | "stable";
}

interface CapabilityAssessment {
  category: string;
  score: number;
  description: string;
  recommendations: string[];
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  skills: string[];
  estimatedTime: string;
  difficulty: string;
  priority: "high" | "medium" | "low";
}

export default function SkillsetAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months");

  // Mock data - in real app, this would come from AI analysis
  const skillCategories: SkillCategory[] = [
    {
      name: "Programming Languages",
      skills: ["JavaScript", "Python", "TypeScript", "Java"],
      keyStrengths: ["Strong JavaScript fundamentals", "Good Python syntax knowledge"],
      keyWeaknesses: ["Limited Java experience", "Need more TypeScript practice"],
      totalSkills: 4,
      trend: "up"
    },
    {
      name: "Web Development",
      skills: ["React", "Node.js", "HTML/CSS", "Express.js"],
      keyStrengths: ["Solid React component design", "Good HTML/CSS styling"],
      keyWeaknesses: ["Backend API design", "Advanced React patterns"],
      totalSkills: 4,
      trend: "up"
    },
    {
      name: "Data & Analytics",
      skills: ["SQL", "Data Analysis", "Statistics"],
      keyStrengths: ["Basic SQL queries", "Data visualization skills"],
      keyWeaknesses: ["Complex joins and optimization", "Statistical modeling"],
      totalSkills: 3,
      trend: "stable"
    },
    {
      name: "Cloud & DevOps",
      skills: ["AWS", "Docker", "Git"],
      keyStrengths: ["Git version control", "Basic containerization"],
      keyWeaknesses: ["AWS services knowledge", "CI/CD pipeline setup"],
      totalSkills: 3,
      trend: "up"
    },
    {
      name: "Soft Skills",
      skills: ["Communication", "Leadership", "Problem Solving", "Teamwork"],
      keyStrengths: ["Excellent teamwork", "Strong problem-solving approach"],
      keyWeaknesses: ["Public speaking confidence", "Leadership decision-making"],
      totalSkills: 4,
      trend: "stable"
    }
  ];

  const capabilityAssessments: CapabilityAssessment[] = [
    {
      category: "Technical Proficiency",
      score: 6.8,
      description: "Strong foundation in programming with room for growth in advanced topics",
      recommendations: [
        "Focus on system design and architecture",
        "Learn cloud computing platforms",
        "Improve database optimization skills"
      ]
    },
    {
      category: "Problem Solving",
      score: 8.2,
      description: "Excellent analytical thinking and solution development capabilities",
      recommendations: [
        "Practice with complex algorithmic problems",
        "Work on real-world project challenges",
        "Mentor others to strengthen skills"
      ]
    },
    {
      category: "Communication",
      score: 7.5,
      description: "Good communication skills with potential for leadership roles",
      recommendations: [
        "Practice technical presentations",
        "Improve written documentation skills",
        "Take on mentoring opportunities"
      ]
    },
    {
      category: "Learning Agility",
      score: 8.0,
      description: "Quick to adapt and learn new technologies and concepts",
      recommendations: [
        "Explore emerging technologies",
        "Take on challenging projects",
        "Share knowledge with peers"
      ]
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: "1",
      name: "Full-Stack Developer",
      description: "Complete web development skills for modern applications",
      skills: ["React", "Node.js", "Database Design", "API Development", "Deployment"],
      estimatedTime: "4-6 months",
      difficulty: "intermediate",
      priority: "high"
    },
    {
      id: "2",
      name: "Data Scientist",
      description: "Analytics and machine learning for data-driven insights",
      skills: ["Python", "Machine Learning", "Statistics", "Data Visualization", "SQL"],
      estimatedTime: "6-8 months",
      difficulty: "advanced",
      priority: "medium"
    },
    {
      id: "3",
      name: "Cloud Engineer",
      description: "Infrastructure and deployment expertise for scalable systems",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Monitoring"],
      estimatedTime: "3-4 months",
      difficulty: "intermediate",
      priority: "high"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return "📈";
      case "down": return "📉";
      case "stable": return "➡️";
      default: return "➡️";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      case "stable": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Skillset Analysis</h2>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year</option>
          </select>
        </div>
        <p className="text-gray-600">
          Comprehensive analysis of your skills, capabilities, and learning recommendations.
        </p>
      </div>

      {/* Skill Categories Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Skill Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillCategories.map((category, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getTrendColor(category.trend)}`}>
                    {getTrendIcon(category.trend)}
                  </span>
                  <span className="text-sm text-gray-500">{category.totalSkills} skills</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {category.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                    <span className="text-green-500 mr-1">✓</span>
                    Key Strengths
                  </h5>
                  <div className="space-y-1">
                    {category.keyStrengths.map((strength, strengthIndex) => (
                      <div key={strengthIndex} className="text-sm text-gray-700 pl-4">
                        • {strength}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-orange-700 mb-2 flex items-center">
                    <span className="text-orange-500 mr-1">⚠</span>
                    Areas to Improve
                  </h5>
                  <div className="space-y-1">
                    {category.keyWeaknesses.map((weakness, weaknessIndex) => (
                      <div key={weaknessIndex} className="text-sm text-gray-700 pl-4">
                        • {weakness}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capability Assessment */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Capability Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capabilityAssessments.map((assessment, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{assessment.category}</h4>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(assessment.score)} ${getScoreColor(assessment.score)}`}>
                  {assessment.score}/10
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h5>
                <ul className="space-y-1">
                  {assessment.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Paths */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Learning Paths</h3>
        <div className="space-y-4">
          {learningPaths.map((path) => (
            <div key={path.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{path.name}</h4>
                  <p className="text-sm text-gray-600">{path.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(path.priority)}`}>
                    {path.priority} priority
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span>⏱️ {path.estimatedTime}</span>
                <span>📊 {path.difficulty}</span>
                <span>🎯 {path.skills.length} skills</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {path.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
              
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Start Learning Path →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">AI Analysis Summary</h4>
            <p className="text-gray-700 text-sm">
              Your strongest areas are problem-solving and learning agility. Focus on cloud technologies and 
              system design to become a well-rounded full-stack developer. Your soft skills are excellent, 
              making you a strong candidate for leadership roles as you advance in your career.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
