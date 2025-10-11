"use client";

import { useState } from "react";

interface EvaluationQuestion {
  id: string;
  question: string;
  status: "NOT_IN_RESUME" | "IN_RESUME" | "PENDING";
  answer?: string;
  summary?: string;
}

interface RoleQuestion {
  id: string;
  question: string;
  status: "NOT_IN_RESUME" | "IN_RESUME" | "PENDING";
  summary: string;
}

interface EvaluationSection {
  id: string;
  title: string;
  questions: EvaluationQuestion[];
}

interface CandidateEvaluationPageProps {
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  evaluationSections?: EvaluationSection[];
  roleQuestions?: RoleQuestion[];
  applicationData?: {
    overallRating: number;
    aiSummary: string;
    reviewerComment: string;
    impactCommunication: number;
    skillRecency: number;
    yearsRelevantExp: number;
    totalExp: number;
    status: string;
  };
  documents?: Array<{
    userDocumentId: string;
    filename: string;
    mimeType: string | null;
    createdAt: Date;
  }>;
}

// Small Tailwind-only primitives
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </div>
);
const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`p-6 border-b border-gray-100 ${className}`}>{children}</div>
);
const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <h3 className={`text-xl font-bold ${className}`}>{children}</h3>;
const Badge = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

// Icons (inline SVG, no external libs)
const IconChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    {...props}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const IconChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    {...props}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function CandidateEvaluationPage({
  candidateName,
  roleTitle,
  evaluationSections = [],
  roleQuestions = [],
  applicationData,
  documents = [],
}: CandidateEvaluationPageProps) {
  const [activeTab, setActiveTab] = useState<
    "evaluation" | "questions" | "resume"
  >("evaluation");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(["learning-agility", "leadership"])
  );
  const [comments, setComments] = useState("");
  const [aiStatus, setAiStatus] = useState<"KIV" | "YES" | "NO">("KIV");
  const [reviewerStatus, setReviewerStatus] = useState("Pending");
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      type: "user" | "bot";
      message: string;
      timestamp: Date;
    }>
  >([]);
  const [chatInput, setChatInput] = useState("");

  const toggleQuestion = (questionId: string) => {
    const next = new Set(expandedQuestions);
    next.has(questionId) ? next.delete(questionId) : next.add(questionId);
    setExpandedQuestions(next);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      message: chatInput,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    const original = chatInput;
    setChatInput("");
    setTimeout(() => {
      const botResponse = generateBotResponse(original);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot" as const,
        message: botResponse,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    if (input.includes("experience") || input.includes("background")) {
      return `${candidateName} has 8 years of relevant defence experience with progression from junior officer to senior leadership roles. He has demonstrated expertise in tactical operations, joint operations planning, and intelligence analysis. His experience includes successful inter-service coordination in Exercise Wallaby 2023.`;
    } else if (input.includes("skills") || input.includes("technical")) {
      return `Based on the resume analysis, ${candidateName} demonstrates strong technical skills in tactical operations, command and control systems, and joint operations planning. He has certifications in Advanced Tactical Operations and Joint Operations Planning. The skills match is approximately 85% with most core competencies covered.`;
    } else if (input.includes("leadership") || input.includes("team")) {
      return `${candidateName} has demonstrated leadership capabilities through his progression to senior roles and experience in joint operations. However, the resume doesn't specify the exact number of team members he has led. His leadership experience appears to be in tactical planning and inter-service coordination.`;
    } else if (input.includes("education") || input.includes("qualification")) {
      return `${candidateName} has a Master of Defence Studies from NUS and a Bachelor of Engineering from NTU. He also holds certifications in Advanced Tactical Operations, Joint Operations Planning, and Intelligence Analysis Specialist. His educational background is well-suited for defence sector roles.`;
    } else if (input.includes("strength") || input.includes("strong")) {
      return `Key strengths include: 1) Strong technical competency in defence operations, 2) 8 years of relevant experience with career progression, 3) Joint operations expertise, 4) Professional certifications, 5) Clear communication skills (no typos in resume). Areas for further exploration include specific team leadership metrics and hands-on tactical systems experience.`;
    } else if (
      input.includes("weakness") ||
      input.includes("concern") ||
      input.includes("gap")
    ) {
      return `Areas that need clarification: 1) Specific number of team members led, 2) Hands-on experience with modern tactical systems, 3) Crisis management and emergency response experience, 4) Cyber defence systems knowledge, 5) Quantifiable achievements and metrics. These gaps could be addressed during the interview process.`;
    } else if (input.includes("recommend") || input.includes("decision")) {
      return `Based on the resume analysis, I recommend proceeding with an interview. ${candidateName} shows strong alignment with the role requirements (85% skills match) and has relevant defence experience. The interview should focus on clarifying leadership metrics, tactical systems experience, and specific achievements to make a final decision.`;
    } else {
      return `I can help you analyze ${candidateName}'s application for the ${roleTitle} position. You can ask me about his experience, skills, education, strengths, weaknesses, or any specific concerns you have. I've analyzed his resume and can provide insights based on the available information.`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NOT_IN_RESUME":
        return <Badge className="bg-red-100 text-red-800">NOT IN RESUME</Badge>;
      case "IN_RESUME":
        return <Badge className="bg-green-100 text-green-800">IN RESUME</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">-</Badge>;
    }
  };

  const getAIStatusBadge = (status: string) => {
    switch (status) {
      case "KIV":
        return <Badge className="bg-orange-500 text-white">KIV</Badge>;
      case "YES":
        return <Badge className="bg-green-500 text-white">YES</Badge>;
      case "NO":
        return <Badge className="bg-red-500 text-white">NO</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">-</Badge>;
    }
  };

  const renderEvaluationContent = () => {
    if (activeTab === "evaluation") {
      const allQuestions = evaluationSections.flatMap((section) =>
        section.questions.map((question) => ({
          ...question,
          sectionTitle: section.title,
        }))
      );
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Candidate Evaluation
          </h2>
          {allQuestions.map((question) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-lg bg-white"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleQuestion(question.id)}
                aria-expanded={expandedQuestions.has(question.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {getStatusBadge(question.status)}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">
                    {question.question}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4 text-gray-500">
                  {expandedQuestions.has(question.id) ? (
                    <IconChevronDown />
                  ) : (
                    <IconChevronRight />
                  )}
                </div>
              </button>
              {expandedQuestions.has(question.id) && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="pt-4">
                    <p className="text-sm text-gray-600">{question.summary}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else if (activeTab === "questions") {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Role-Related Questions
          </h2>
          {roleQuestions.map((question) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-lg bg-white"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleQuestion(question.id)}
                aria-expanded={expandedQuestions.has(question.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {getStatusBadge(question.status)}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">
                    {question.question}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4 text-gray-500">
                  {expandedQuestions.has(question.id) ? (
                    <IconChevronDown />
                  ) : (
                    <IconChevronRight />
                  )}
                </div>
              </button>
              {expandedQuestions.has(question.id) && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="pt-4">
                    <p className="text-sm text-gray-600">{question.summary}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      const firstDocument = documents[0];

      if (!firstDocument) {
        return (
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">No Documents Found</p>
                <p className="text-sm">
                  No documents available for this candidate
                </p>
              </div>
            </CardContent>
          </Card>
        );
      }

      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resume Preview</CardTitle>
            <p className="text-sm text-gray-600">{firstDocument.filename}</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-[800px]">
              <iframe
                src={`/api/v1/documents/${firstDocument.userDocumentId}`}
                className="w-full h-full border-0"
                title="Resume Preview"
              />
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="pt-4 mb-56">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {candidateName}
                  </h1>
                </div>
                <p className="text-gray-600">Applying for {roleTitle}</p>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">
                      IMPACT COMMUNICATION
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {applicationData?.impactCommunication}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">SKILL RECENCY</p>
                    <p className="text-2xl font-bold text-green-600">
                      {applicationData?.skillRecency}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: "evaluation", label: "Candidate Evaluation" },
                  { id: "questions", label: "Role-Related Questions" },
                  { id: "resume", label: "Resume" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {renderEvaluationContent()}
          </div>

          {/* Right Column - AI Summary and Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Gen AI Status: {getAIStatusBadge(aiStatus)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium text-gray-900">
                      AI Summary
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {applicationData?.aiSummary}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium text-gray-900">
                      Provide your evaluation for this application
                    </h4>
                    <textarea
                      placeholder="Your comments here"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="min-h-[100px] w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
                      Save comments
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="flex-1 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
                      Next
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-1">
                        <select
                          value={reviewerStatus}
                          onChange={(e) => setReviewerStatus(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="KIV">KIV</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
