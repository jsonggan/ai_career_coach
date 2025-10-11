"use client";

import { useState } from "react";

export default function UserProfile() {
  const [selectedGrowthArea, setSelectedGrowthArea] = useState("");
  const [certificationsTab, setCertificationsTab] = useState("completed");

  // Mock user data
  const userData = {
    name: "COL Edward Lim",
    title: "Joint Task Force Commander",
    avatar: "/avatar.png",
    manager: "BG Matt Johnson",
    currentSkills: [
      { name: "Mission Planning", color: "bg-primary-100 text-primary-800" },
      { name: "Joint Operations", color: "bg-primary-100 text-primary-800" },
      { name: "Command & Control", color: "bg-primary-100 text-primary-800" },
      { name: "Leadership", color: "bg-red-100 text-red-800" },
    ],
    additionalSkillsCount: 3,
    growthSkills: [
      "Tactical Operations",
      "Intelligence Analysis",
      "Risk Assessment",
      "Joint Operations Planning",
      "Command Systems",
      "Strategic Planning",
      "C4ISR",
      "Cyber Operations",
    ],
    skillLevels: {
      Leadership: 90,
      "Mission Planning": 85,
      "Joint Operations": 88,
      "Command & Control": 82,
      "Risk Assessment": 75,
      "Intelligence Analysis": 70,
      "Strategic Planning": 78,
    },
    skillImprovement: [
      {
        name: "Advanced Joint Operations",
        currentLevel: 2,
        nextLevel: 3,
        progress: 60,
      },
      {
        name: "Cyber Defence Operations",
        currentLevel: 1,
        nextLevel: 2,
        progress: 45,
      },
      {
        name: "Intelligence Analysis",
        currentLevel: 2,
        nextLevel: 3,
        progress: 30,
      },
      {
        name: "Strategic Planning",
        currentLevel: 1,
        nextLevel: 2,
        progress: 70,
      },
    ],
    advancedSkills: [
      "C4ISR Systems",
      "Mission Critical Software",
      "Joint Operations Protocols",
      "Tactical Planning Tools",
    ],
    journalEntries: [
      {
        id: 1,
        title: "Advanced Joint Operations Planning",
        platform: "SAF Training Institute",
        category: "Operations",
        progress: 85,
      },
      {
        id: 2,
        title: "Command and Control Leadership",
        platform: "SAF Training Institute",
        category: "Leadership",
        progress: 60,
      },
      {
        id: 3,
        title: "Intelligence Analysis and Operations",
        platform: "SAF Training Institute",
        category: "Intelligence",
        progress: 70,
      },
      {
        id: 4,
        title: "Cyber Defence Operations",
        platform: "SAF Training Institute",
        category: "Cyber",
        progress: 45,
      },
    ],
    certifications: [
      {
        id: 1,
        name: "Joint Operations Command Certificate",
        issuer: "SAF Command & Staff College",
        dateCompleted: "2024-03-15",
        expiryDate: "2027-03-15",
        status: "Active",
        level: "Advanced",
        credentialId: "JOC-2024-001",
      },
      {
        id: 2,
        name: "Cyber Security Leadership Certification",
        issuer: "Digital Security Institute",
        dateCompleted: "2023-11-20",
        expiryDate: "2026-11-20",
        status: "Active",
        level: "Professional",
        credentialId: "CSL-2023-847",
      },
      {
        id: 3,
        name: "Intelligence Analysis Specialist",
        issuer: "Defence Intelligence Organisation",
        dateCompleted: "2023-08-10",
        expiryDate: null,
        status: "Permanent",
        level: "Specialist",
        credentialId: "IAS-2023-293",
      },
      {
        id: 4,
        name: "Risk Assessment & Management",
        issuer: "SAF Safety Institute",
        dateCompleted: "2022-12-05",
        expiryDate: "2025-12-05",
        status: "Expiring Soon",
        level: "Intermediate",
        credentialId: "RAM-2022-156",
      },
    ],
    recommendedCertifications: [
      {
        id: 1,
        name: "Advanced Joint Command Operations",
        issuer: "SAF Command & Staff College",
        duration: "6 months",
        level: "Advanced",
        category: "joint-command",
        prerequisites: ["Joint Operations Command Certificate"],
        description: "Master advanced joint operations planning and execution",
        estimatedHours: 120,
        cost: "Funded",
      },
      {
        id: 2,
        name: "Intelligence Fusion Analyst Certification",
        issuer: "Defence Intelligence Organisation",
        duration: "4 months",
        level: "Professional",
        category: "intelligence-analysis",
        prerequisites: ["Intelligence Analysis Specialist"],
        description:
          "Advanced multi-source intelligence analysis and fusion techniques",
        estimatedHours: 80,
        cost: "Funded",
      },
      {
        id: 3,
        name: "Cyber Threat Hunting Professional",
        issuer: "Cyber Security Agency",
        duration: "3 months",
        level: "Professional",
        category: "cyber-operations",
        prerequisites: ["Basic Cyber Security"],
        description: "Advanced threat detection and incident response",
        estimatedHours: 60,
        cost: "$2,500",
      },
      {
        id: 4,
        name: "UAS Operations Commander",
        issuer: "Republic of Singapore Air Force",
        duration: "2 months",
        level: "Advanced",
        category: "air-operations",
        prerequisites: ["UAS Basic Operations"],
        description: "Leadership and command of unmanned aerial systems",
        estimatedHours: 100,
        cost: "Funded",
      },
      {
        id: 5,
        name: "Maritime Security Operations",
        issuer: "Republic of Singapore Navy",
        duration: "3 months",
        level: "Professional",
        category: "naval-operations",
        prerequisites: ["Basic Maritime Operations"],
        description: "Advanced maritime security and boarding operations",
        estimatedHours: 90,
        cost: "Funded",
      },
      {
        id: 6,
        name: "Combat Engineering Leadership",
        issuer: "Singapore Army",
        duration: "4 months",
        level: "Advanced",
        category: "army-operations",
        prerequisites: ["Combat Engineering Basic"],
        description: "Advanced combat engineering and EOD operations",
        estimatedHours: 110,
        cost: "Funded",
      },
      {
        id: 7,
        name: "Strategic Logistics Planning",
        issuer: "SAF Logistics Command",
        duration: "2 months",
        level: "Professional",
        category: "logistics-operations",
        prerequisites: ["Basic Logistics"],
        description: "Advanced supply chain and logistics management",
        estimatedHours: 70,
        cost: "Funded",
      },
      {
        id: 8,
        name: "Project Management Professional (PMP)",
        issuer: "Project Management Institute",
        duration: "Self-paced",
        level: "Professional",
        category: "general",
        prerequisites: ["3 years project management experience"],
        description: "Industry-standard project management certification",
        estimatedHours: 35,
        cost: "$405",
      },
    ],
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Permanent":
        return "bg-primary-100 text-primary-800 border-primary-200";
      case "Expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Function to get recommended certifications based on career path
  const getRecommendedCertifications = (careerPath: string) => {
    if (!careerPath)
      return userData.recommendedCertifications.filter(
        (cert) => cert.category === "general"
      );

    return userData.recommendedCertifications.filter(
      (cert) => cert.category === careerPath || cert.category === "general"
    );
  };

  // Function to get skills based on selected career path
  const getSkillsForCareerPath = (careerPath: string) => {
    const skillsMap: Record<string, string[]> = {
      "joint-command": [
        "Mission Planning",
        "Joint Operations",
        "Command & Control",
        "Risk Assessment",
        "Strategic Planning",
        "Inter-Service Coordination",
      ],
      "intelligence-analysis": [
        "All-Source Analysis",
        "Intelligence Fusion",
        "Targeting",
        "Collection Management",
        "Briefing",
        "OSINT",
      ],
      "cyber-operations": [
        "SOC Leadership",
        "Incident Response",
        "Threat Hunting",
        "Cyber Defence",
        "Information Operations",
        "Purple Teaming",
      ],
      "air-operations": [
        "UAS Operations",
        "Air Battle Management",
        "Airspace Control",
        "Mission Planning",
        "Safety Management",
        "ISR Operations",
      ],
      "naval-operations": [
        "USV/UUV Operations",
        "Maritime Security",
        "VBSS Tactics",
        "Marine Engineering",
        "Boarding Operations",
        "Naval Combat Systems",
      ],
      "army-operations": [
        "Infantry Tactics",
        "Combat Engineering",
        "EOD Operations",
        "Route Clearance",
        "Small-Unit Leadership",
        "Field Operations",
      ],
      "logistics-operations": [
        "Supply Planning",
        "Movement Control",
        "Demand Forecasting",
        "Contracting",
        "HA/DR Logistics",
        "Sustainment Operations",
      ],
    };
    return skillsMap[careerPath] || [];
  };

  // Spider chart component (simplified representation)
  const SpiderChart = () => {
    const skills = Object.entries(userData.skillLevels);
    const maxValue = 100;
    const centerX = 150;
    const centerY = 150;
    const radius = 100;

    // Calculate points for the polygon
    const points = skills.map((skill, index) => {
      const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
      const value = skill[1];
      const distance = (value / maxValue) * radius;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      return { x, y, label: skill[0], value: skill[1] };
    });

    // Create the polygon path
    const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

    return (
      <div className="flex justify-center">
        <svg width="300" height="300" className="overflow-visible">
          {/* Background grid */}
          {[20, 40, 60, 80, 100].map((percent) => {
            const r = (percent / 100) * radius;
            const gridPoints = skills
              .map((_, index) => {
                const angle =
                  (index * 2 * Math.PI) / skills.length - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(" ");

            return (
              <polygon
                key={percent}
                points={gridPoints}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis lines */}
          {points.map((point, index) => {
            const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
            const endX = centerX + radius * Math.cos(angle);
            const endY = centerY + radius * Math.sin(angle);

            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
            />
          ))}

          {/* Labels */}
          {points.map((point, index) => {
            const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
            const labelDistance = radius + 30;
            const labelX = centerX + labelDistance * Math.cos(angle);
            const labelY = centerY + labelDistance * Math.sin(angle);

            return (
              <text
                key={index}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {point.label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  // Simple reusable components (Tailwind-only)
  const Badge = ({
    className = "",
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );

  const Progress = ({ value = 0 }: { value: number }) => (
    <div
      className="w-full bg-gray-100 rounded-full h-2"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-2 rounded-full bg-primary-600"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <img
            src={userData.avatar || "/placeholder.svg"}
            alt={userData.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            aria-label="Share"
            className="rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 p-2 shadow-sm"
            type="button"
          >
            {/* simple share icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
          </button>
          <button
            aria-label="Settings"
            className="rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 p-2 shadow-sm"
            type="button"
          >
            {/* simple settings gear icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.69 0 1.31-.39 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.3l.06.06c.51.51 1.24.66 1.88.4.64-.26 1.02-.88 1.02-1.57V2a2 2 0 1 1 4 0v.09c0 .69.39 1.31 1 1.57.64.26 1.37.11 1.88-.4l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.51.51-.66 1.24-.4 1.88.26.64.88 1.02 1.57 1.02H22a2 2 0 1 1 0 4h-.09c-.69 0-1.31.39-1.57 1.02z" />
            </svg>
          </button>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            <span className="text-gray-400">Hello </span>
            {userData.name}
          </h1>
          <p className="text-xl text-gray-600 mt-2">{userData.title}</p>
        </div>

        {/* Current Skills */}
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {userData.currentSkills.map((skill, index) => (
            <Badge key={index} className={skill.color}>
              {skill.name}
            </Badge>
          ))}
          <Badge className="bg-gray-100 text-gray-800">
            +{userData.additionalSkillsCount}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Improvement */}
        <div className="rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <h3 className="text-2xl font-bold">Defence Skill Development</h3>
            {/* <button
              className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2 text-primary-600 hover:bg-primary-50"
              onClick={() => onSuccess?.("skills")}
              type="button"
            >
              View Skills
            </button> */}
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-primary-600 font-medium">Current Level</span>
                <span className="text-green-600 font-medium">Next Level</span>
                <span className="text-gray-500">Advanced Skills</span>
              </div>

              {userData.skillImprovement.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {skill.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      Level {skill.currentLevel}
                    </span>
                  </div>
                  <Progress value={skill.progress} />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">
                Advanced Defence Systems
              </h4>
              <div className="space-y-2">
                {userData.advancedSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700">{skill}</span>
                    <span className="text-gray-400">-</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spider Chart */}
        <div className="rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold">Defence Skills Overview</h3>
          </div>
          <div className="p-6">
            <SpiderChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Growth Section */}
        <div className="rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold">I want to develop in</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="relative">
              <select
                value={selectedGrowthArea}
                onChange={(e) => setSelectedGrowthArea(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="" disabled>
                  Select Defence Career Path
                </option>
                <option value="joint-command">
                  Joint Command & Operations
                </option>
                <option value="intelligence-analysis">
                  Intelligence Analysis
                </option>
                <option value="cyber-operations">Cyber Operations</option>
                <option value="air-operations">Air Operations</option>
                <option value="naval-operations">Naval Operations</option>
                <option value="army-operations">Army Operations</option>
                <option value="logistics-operations">
                  Logistics Operations
                </option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▾
              </span>
            </div>

            {/* Existing Skills - Always shown */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Your current defence skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {userData.growthSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-primary-50 text-primary-700 border border-primary-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Suggested Skills - Only shown when career path is selected */}
            {selectedGrowthArea && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Recommended skills to develop:
                </p>
                <div className="flex flex-wrap gap-2">
                  {getSkillsForCareerPath(selectedGrowthArea).map(
                    (skill, index) => (
                      <Badge
                        key={index}
                        className="bg-green-50 text-green-700 border border-green-200"
                      >
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

            {/* View Courses Button - Bottom right corner */}
            {/* {selectedGrowthArea && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => onSuccess?.("courses")}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
                  type="button"
                >
                  View Training Programs
                </button>
              </div>
            )} */}
          </div>
        </div>

        {/* Training Journal */}
        <div className="rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <h3 className="text-2xl font-bold">Training Journal</h3>
            {/* <button
              className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2 text-primary-600 hover:bg-primary-50"
              type="button"
            >
              View Training Record
            </button> */}
          </div>
          <div className="p-6 space-y-4">
            {userData.journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {entry.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">
                        {entry.platform}
                      </span>
                      <Badge className="text-xs bg-primary-50 text-primary-700 border border-primary-200">
                        {entry.category}
                      </Badge>
                    </div>
                    <Progress value={entry.progress} />
                  </div>
                  {/* Chevron */}
                  <svg
                    className="h-5 w-5 text-gray-400 ml-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications & Courses Section */}
      <div className="rounded-2xl border border-gray-100 shadow-sm bg-white">
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-2xl font-bold">Certifications & Courses</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {
                userData.certifications.filter(
                  (cert) =>
                    cert.status === "Active" || cert.status === "Permanent"
                ).length
              }{" "}
              Active
            </span>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2 text-primary-600 hover:bg-primary-50"
              type="button"
            >
              Add Certificate
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setCertificationsTab("completed")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                certificationsTab === "completed"
                  ? "border-primary-500 text-primary-600 bg-primary-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              My Certificates ({userData.certifications.length})
            </button>
            <button
              onClick={() => setCertificationsTab("recommended")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                certificationsTab === "recommended"
                  ? "border-primary-500 text-primary-600 bg-primary-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Recommended (
              {getRecommendedCertifications(selectedGrowthArea).length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {certificationsTab === "completed" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                    </div>
                    <Badge
                      className={`${getStatusBadgeStyle(cert.status)} border text-xs`}
                    >
                      {cert.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Level:</span>
                      <span className="font-medium text-gray-900">
                        {cert.level}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Completed:</span>
                      <span className="text-gray-900">
                        {formatDate(cert.dateCompleted)}
                      </span>
                    </div>
                    {cert.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Expires:</span>
                        <span className="text-gray-900">
                          {formatDate(cert.expiryDate)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-mono text-xs text-gray-700">
                        {cert.credentialId}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                    <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                      View Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {!selectedGrowthArea && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">
                    Select a career path above to see personalized certificate
                    recommendations
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getRecommendedCertifications("").map((cert) => (
                      <div
                        key={cert.id}
                        className="border border-purple-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-purple-50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {cert.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {cert.issuer}
                            </p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                            General
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">
                          {cert.description}
                        </p>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Duration:</span>
                            <span className="font-medium text-gray-900">
                              {cert.duration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Level:</span>
                            <span className="font-medium text-gray-900">
                              {cert.level}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Cost:</span>
                            <span className="font-medium text-gray-900">
                              {cert.cost}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4 pt-3 border-t border-purple-200">
                          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedGrowthArea && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getRecommendedCertifications(selectedGrowthArea).map(
                    (cert) => (
                      <div
                        key={cert.id}
                        className={`border rounded-lg p-4 hover:shadow-sm transition-shadow ${
                          cert.category === selectedGrowthArea
                            ? "bg-green-50 border-green-200"
                            : "bg-purple-50 border-purple-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {cert.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {cert.issuer}
                            </p>
                          </div>
                          <Badge
                            className={`text-xs ${
                              cert.category === selectedGrowthArea
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-purple-100 text-purple-800 border-purple-200"
                            }`}
                          >
                            {cert.category === selectedGrowthArea
                              ? "Recommended"
                              : "General"}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">
                          {cert.description}
                        </p>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Duration:</span>
                            <span className="font-medium text-gray-900">
                              {cert.duration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Level:</span>
                            <span className="font-medium text-gray-900">
                              {cert.level}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Hours:</span>
                            <span className="font-medium text-gray-900">
                              {cert.estimatedHours}h
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Cost:</span>
                            <span className="font-medium text-gray-900">
                              {cert.cost}
                            </span>
                          </div>
                        </div>

                        {cert.prerequisites &&
                          cert.prerequisites.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">
                                Prerequisites:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {cert.prerequisites.map((prereq, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-gray-100 text-gray-600 text-xs"
                                  >
                                    {prereq}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                        <div
                          className={`flex justify-end mt-4 pt-3 border-t ${
                            cert.category === selectedGrowthArea
                              ? "border-green-200"
                              : "border-purple-200"
                          }`}
                        >
                          <button
                            className={`text-sm font-medium ${
                              cert.category === selectedGrowthArea
                                ? "text-green-600 hover:text-green-800"
                                : "text-purple-600 hover:text-purple-800"
                            }`}
                          >
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
