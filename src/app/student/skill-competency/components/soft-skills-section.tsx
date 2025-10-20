"use client";

import { useState } from "react";

interface SoftSkill {
  id: string;
  name: string;
  description: string;
  peerRating: number;
  improvementAreas: string[];
  strengths: string[];
  improvementSuggestions: {
    area: string;
    actions: string[];
    resources: string[];
  }[];
}

export default function SoftSkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const softSkills: SoftSkill[] = [
    {
      id: "1",
      name: "Communication",
      description: "Ability to express ideas clearly and listen effectively",
      peerRating: 8,
      improvementAreas: ["Public speaking", "Written communication"],
      strengths: ["Active listening", "Team collaboration"],
      improvementSuggestions: [
        {
          area: "Public speaking",
          actions: [
            "Join Toastmasters or similar speaking club",
            "Practice presentations in front of mirror daily",
            "Record yourself speaking and analyze body language",
            "Start with small group presentations before larger audiences"
          ],
          resources: [
            "Coursera: Introduction to Public Speaking",
            "TED Talks on effective communication",
            "Book: 'Talk Like TED' by Carmine Gallo"
          ]
        },
        {
          area: "Written communication",
          actions: [
            "Write daily journal entries to practice clarity",
            "Use Grammarly to improve writing structure",
            "Read professional emails and analyze effective patterns",
            "Practice writing executive summaries of complex topics"
          ],
          resources: [
            "edX: Writing Professional Emails and Memos",
            "Book: 'On Writing Well' by William Zinsser",
            "Harvard Business Review writing guides"
          ]
        }
      ]
    },
    {
      id: "2",
      name: "Leadership",
      description: "Ability to guide and motivate others towards common goals",
      peerRating: 7,
      improvementAreas: ["Decision making", "Conflict resolution"],
      strengths: ["Team building", "Vision setting"],
      improvementSuggestions: [
        {
          area: "Decision making",
          actions: [
            "Practice the DECIDE framework for complex decisions",
            "Seek diverse perspectives before making major decisions",
            "Set decision deadlines to avoid analysis paralysis",
            "Document decision rationale to learn from outcomes"
          ],
          resources: [
            "LinkedIn Learning: Decision Making Strategies",
            "Book: 'Decisive' by Chip Heath and Dan Heath",
            "Harvard Business Review decision-making articles"
          ]
        },
        {
          area: "Conflict resolution",
          actions: [
            "Learn active listening techniques for heated discussions",
            "Practice separating people from problems",
            "Role-play difficult conversations with trusted friends",
            "Study mediation and negotiation techniques"
          ],
          resources: [
            "Coursera: Conflict Resolution and Mediation",
            "Book: 'Getting to Yes' by Roger Fisher",
            "Conflict resolution workshops and seminars"
          ]
        }
      ]
    },
    {
      id: "3",
      name: "Problem Solving",
      description: "Ability to analyze problems and develop effective solutions",
      peerRating: 8,
      improvementAreas: ["Creative thinking"],
      strengths: ["Analytical thinking", "Solution implementation"],
      improvementSuggestions: [
        {
          area: "Creative thinking",
          actions: [
            "Practice brainstorming using mind mapping techniques",
            "Try the 'Six Thinking Hats' method for different perspectives",
            "Engage in creative hobbies like drawing or music",
            "Challenge assumptions by asking 'What if?' questions regularly"
          ],
          resources: [
            "MasterClass: Creativity and Design courses",
            "Book: 'A Whack on the Side of the Head' by Roger von Oech",
            "Design thinking workshops and online courses"
          ]
        }
      ]
    },
    {
      id: "4",
      name: "Teamwork",
      description: "Ability to work effectively with others in a team setting",
      peerRating: 9,
      improvementAreas: [],
      strengths: ["Collaboration", "Supporting others", "Conflict resolution"],
      improvementSuggestions: []
    },
    {
      id: "5",
      name: "Adaptability",
      description: "Ability to adjust to new situations and changing environments",
      peerRating: 7,
      improvementAreas: ["Stress management"],
      strengths: ["Flexibility", "Learning agility"],
      improvementSuggestions: [
        {
          area: "Stress management",
          actions: [
            "Practice daily mindfulness or meditation (10 minutes)",
            "Learn deep breathing techniques for high-stress moments",
            "Develop a personal stress response plan",
            "Regular exercise to build physical resilience"
          ],
          resources: [
            "Headspace or Calm apps for guided meditation",
            "Coursera: Managing Emotions in Times of Uncertainty",
            "Book: 'The Stress Solution' by Dr. Russ Morfitt"
          ]
        }
      ]
    },
    {
      id: "6",
      name: "Time Management",
      description: "Ability to prioritize tasks and manage time effectively",
      peerRating: 6,
      improvementAreas: ["Task prioritization", "Deadline management"],
      strengths: ["Organization", "Planning"],
      improvementSuggestions: [
        {
          area: "Task prioritization",
          actions: [
            "Use the Eisenhower Matrix to categorize tasks by urgency/importance",
            "Implement the Pomodoro Technique for focused work sessions",
            "Create weekly priority lists and review daily",
            "Learn to say 'no' to non-essential commitments"
          ],
          resources: [
            "LinkedIn Learning: Time Management Fundamentals",
            "Book: 'Getting Things Done' by David Allen",
            "Todoist or Asana for task management"
          ]
        },
        {
          area: "Deadline management",
          actions: [
            "Break large projects into smaller, manageable milestones",
            "Set personal deadlines 2-3 days before actual deadlines",
            "Use calendar blocking to allocate specific time for tasks",
            "Track time spent on different activities to identify patterns"
          ],
          resources: [
            "Project management courses (Coursera, edX)",
            "RescueTime app for time tracking",
            "Book: 'The 7 Habits of Highly Effective People'"
          ]
        }
      ]
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

                {/* AI-Powered Improvement Suggestions */}
                {skill.improvementSuggestions.length > 0 && (
                  <div className="mt-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="text-lg">🤖</div>
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">AI-Powered Improvement Recommendations</h4>
                          <p className="text-blue-700 text-sm">
                            Based on peer feedback patterns and learning data, here are specific actions to improve your {skill.name.toLowerCase()} skills.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {skill.improvementSuggestions.map((suggestion, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-blue-100">
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mr-2">
                                Focus Area
                              </span>
                              {suggestion.area}
                            </h5>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {/* Action Steps */}
                              <div>
                                <h6 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                  <span className="text-green-600 mr-1">📋</span>
                                  Action Steps
                                </h6>
                                <ul className="space-y-1">
                                  {suggestion.actions.map((action, actionIndex) => (
                                    <li key={actionIndex} className="text-sm text-gray-600 flex items-start">
                                      <span className="text-green-500 mr-2 mt-0.5">•</span>
                                      {action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {/* Resources */}
                              <div>
                                <h6 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                  <span className="text-blue-600 mr-1">📚</span>
                                  Recommended Resources
                                </h6>
                                <ul className="space-y-1">
                                  {suggestion.resources.map((resource, resourceIndex) => (
                                    <li key={resourceIndex} className="text-sm text-gray-600 flex items-start">
                                      <span className="text-blue-500 mr-2 mt-0.5">•</span>
                                      {resource}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

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
