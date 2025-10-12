"use client";

import { useState } from "react";

interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  skills: string[];
  category: string;
  resources: string[];
  estimatedTime: string;
}

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ProjectIdeaGenerator() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProjects, setGeneratedProjects] = useState<ProjectIdea[]>([]);

  const availableSkills = [
    "JavaScript", "React", "Python", "Machine Learning", "Data Analysis",
    "Node.js", "MongoDB", "AWS", "Docker", "GraphQL", "TypeScript",
    "Vue.js", "Angular", "SQL", "Redis", "Kubernetes"
  ];

  const mockProjectIdeas: ProjectIdea[] = [
    {
      id: "1",
      title: "Personal Finance Tracker",
      description: "A web application to track expenses, income, and financial goals with data visualization.",
      difficulty: "intermediate",
      duration: "4-6 weeks",
      skills: ["React", "Node.js", "MongoDB", "Chart.js"],
      category: "Web Development",
      resources: ["React Documentation", "MongoDB Atlas", "Chart.js Tutorial"],
      estimatedTime: "40-60 hours"
    },
    {
      id: "2",
      title: "AI-Powered Study Assistant",
      description: "A chatbot that helps students with homework, provides study tips, and tracks learning progress.",
      difficulty: "advanced",
      duration: "8-10 weeks",
      skills: ["Python", "Machine Learning", "NLP", "React", "FastAPI"],
      category: "AI/ML",
      resources: ["OpenAI API", "FastAPI Documentation", "React Hooks Guide"],
      estimatedTime: "80-120 hours"
    },
    {
      id: "3",
      title: "Task Management Dashboard",
      description: "A collaborative task management tool with real-time updates and team collaboration features.",
      difficulty: "intermediate",
      duration: "6-8 weeks",
      skills: ["Vue.js", "Node.js", "Socket.io", "PostgreSQL"],
      category: "Web Development",
      resources: ["Vue.js Guide", "Socket.io Documentation", "PostgreSQL Tutorial"],
      estimatedTime: "60-80 hours"
    }
  ];

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(inputMessage, selectedSkills),
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const generateAIResponse = (message: string, skills: string[]): string => {
    const responses = [
      `Based on your skills in ${skills.join(", ")}, here are some project ideas that would help you grow:`,
      `Great question! With your background in ${skills.join(" and ")}, I'd recommend focusing on projects that combine multiple technologies.`,
      `Let me suggest some projects that align with your interests and current skill set.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateProjectIdeas = () => {
    if (selectedSkills.length === 0) {
      alert("Please select at least one skill to generate project ideas!");
      return;
    }

    // Filter projects based on selected skills
    const relevantProjects = mockProjectIdeas.filter(project =>
      project.skills.some(skill => selectedSkills.includes(skill))
    );

    setGeneratedProjects(relevantProjects);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Project Idea Generator</h2>
        <p className="text-gray-600">
          Chat with our AI to get personalized project ideas based on your skills and interests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Selection */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Select Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSkills.includes(skill)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedSkills.length} skills
            </p>
          </div>

          <div>
            <button
              onClick={generateProjectIdeas}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate Project Ideas
            </button>
          </div>

          {/* Generated Projects */}
          {generatedProjects.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Generated Projects</h3>
              <div className="space-y-4">
                {generatedProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>⏱️ {project.duration}</span>
                      <span>🕒 {project.estimatedTime}</span>
                      <span>📂 {project.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Chat with AI Assistant</h3>
          
          {/* Chat Messages */}
          <div className="h-96 border rounded-lg p-4 overflow-y-auto bg-gray-50">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🤖</div>
                <p>Start a conversation to get personalized project ideas!</p>
                <p className="text-sm mt-2">Try asking: "What projects can I build with React and Python?"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-900 border"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about project ideas..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            />
            <button
              onClick={handleSendMessage}
              disabled={isGenerating || !inputMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>

          {/* Quick Prompts */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "What can I build with my current skills?",
                "Suggest a beginner-friendly project",
                "I want to learn machine learning"
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(prompt)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
