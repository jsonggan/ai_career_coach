"use client";

import { useState } from "react";

interface SoftSkill {
  id: string;
  name: string;
  description: string;
  peerRating: number;
  improvementAreas: string[];
  strengths: string[];
}

interface PeerReview {
  id: string;
  reviewerName: string;
  skill: string;
  rating: number;
  comment: string;
  date: string;
  isAnonymous: boolean;
}

export default function SoftSkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Mock data - in real app, this would come from database
  const softSkills: SoftSkill[] = [
    {
      id: "1",
      name: "Communication",
      description: "Ability to express ideas clearly and listen effectively",
      peerRating: 8,
      improvementAreas: ["Public speaking", "Written communication"],
      strengths: ["Active listening", "Team collaboration"]
    },
    {
      id: "2",
      name: "Leadership",
      description: "Ability to guide and motivate others towards common goals",
      peerRating: 7,
      improvementAreas: ["Decision making", "Conflict resolution"],
      strengths: ["Team building", "Vision setting"]
    },
    {
      id: "3",
      name: "Problem Solving",
      description: "Ability to analyze problems and develop effective solutions",
      peerRating: 8,
      improvementAreas: ["Creative thinking"],
      strengths: ["Analytical thinking", "Solution implementation"]
    },
    {
      id: "4",
      name: "Teamwork",
      description: "Ability to work effectively with others in a team setting",
      peerRating: 9,
      improvementAreas: [],
      strengths: ["Collaboration", "Supporting others", "Conflict resolution"]
    },
    {
      id: "5",
      name: "Adaptability",
      description: "Ability to adjust to new situations and changing environments",
      peerRating: 7,
      improvementAreas: ["Stress management"],
      strengths: ["Flexibility", "Learning agility"]
    },
    {
      id: "6",
      name: "Time Management",
      description: "Ability to prioritize tasks and manage time effectively",
      peerRating: 6,
      improvementAreas: ["Task prioritization", "Deadline management"],
      strengths: ["Organization", "Planning"]
    }
  ];

  const peerReviews: PeerReview[] = [
    {
      id: "1",
      reviewerName: "Sarah Chen",
      skill: "Communication",
      rating: 8,
      comment: "Excellent at explaining complex concepts in simple terms. Always available to help team members understand new ideas.",
      date: "2024-01-10",
      isAnonymous: false
    },
    {
      id: "2",
      reviewerName: "Anonymous",
      skill: "Leadership",
      rating: 7,
      comment: "Shows good leadership potential. Could improve on making quicker decisions during team meetings.",
      date: "2024-01-08",
      isAnonymous: true
    },
    {
      id: "3",
      reviewerName: "Michael Tan",
      skill: "Problem Solving",
      rating: 9,
      comment: "Outstanding problem-solving skills. Always comes up with creative and practical solutions.",
      date: "2024-01-12",
      isAnonymous: false
    },
    {
      id: "4",
      reviewerName: "Lisa Wong",
      skill: "Teamwork",
      rating: 9,
      comment: "A great team player who always supports others and contributes positively to team dynamics.",
      date: "2024-01-14",
      isAnonymous: false
    }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBackground = (rating: number) => {
    if (rating >= 8) return "bg-green-100";
    if (rating >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  const getSkillReviews = (skillName: string) => {
    return peerReviews.filter(review => review.skill === skillName);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Soft Skills Assessment</h2>
          <p className="text-gray-600">
            Your soft skills evaluated through peer reviews.
          </p>
        </div>

        {/* Skills Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {softSkills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{skill.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-bold ${getRatingColor(skill.peerRating)}`}>
                  {skill.peerRating}/10
                </span>
                <span className="text-xs text-gray-500">Peer Rating</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
            
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Peer Reviews</span>
                <div className="flex items-center space-x-1">
                  {renderStars(skill.peerRating)}
                  <span className="text-xs text-gray-500 ml-1">({skill.peerRating})</span>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Skill View */}
      {selectedSkill && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {(() => {
            const skill = softSkills.find(s => s.id === selectedSkill);
            if (!skill) return null;

            const reviews = getSkillReviews(skill.name);

            return (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{skill.name}</h3>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Peer Rating Display */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Peer Rating</h4>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 ${getRatingColor(skill.peerRating)}`}>
                          {skill.peerRating}/10
                        </div>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          {renderStars(skill.peerRating)}
                        </div>
                        <div className="text-sm text-gray-500">Based on peer feedback</div>
                      </div>
                    </div>
                  </div>

                  {/* Strengths and Improvement Areas */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Strengths & Areas for Improvement</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-700 mb-2">Strengths</h5>
                        <div className="space-y-1">
                          {skill.strengths.map((strength, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-green-500">✓</span>
                              <span className="text-sm text-gray-700">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-orange-700 mb-2">Areas for Improvement</h5>
                        <div className="space-y-1">
                          {skill.improvementAreas.map((area, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-orange-500">→</span>
                              <span className="text-sm text-gray-700">{area}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* Action Items */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-3">Next Steps</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Request peer reviews for skills you want to improve</p>
          <p>• Join soft skills development workshops</p>
          <p>• Practice skills in real-world scenarios</p>
        </div>
      </div>
    </div>
  );
}
