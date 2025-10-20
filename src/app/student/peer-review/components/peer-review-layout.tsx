import { ReactNode } from "react";
import PeerReviewBanner from "./peer-review-banner";
import PeerSelector from "./peer-selector";

// Mock student data interface
interface StudentData {
  studentId: string;
  name: string;
  major: string;
  year: string;
  avatar?: string;
}

interface PeerReviewLayoutProps {
  children: ReactNode;
  bannerVariant?: "pending" | "active";
  pendingCount?: number;
  showPeerSelector?: boolean;
  students?: StudentData[];
}

export default function PeerReviewLayout({
  children,
  pendingCount = 3,
  showPeerSelector = true,
  students = [],
}: PeerReviewLayoutProps) {
  pendingCount = students.length;
  return (
    <div
      className="flex flex-col w-full px-16 py-8"
      style={{ maxWidth: "1200px" }}
    >
      {/* Peer Review Banner */}
      {/* <PeerReviewBanner pendingCount={pendingCount} /> */}

      {/* Header Section */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Peer Review
        </h1>
        <p className="text-gray-600 m-0 mb-4">
          Review and get reviewed by your fellow students to improve your academic work and receive valuable feedback. All feedback you provide is anonymous and will be used to generate a skill competency profile for your peers, highlighting their strengths and areas of expertise.
        </p>
        
        {/* AI Integration Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-lg">🤖</div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">AI-Enhanced Peer Review</h3>
              <p className="text-blue-700 text-sm">
                Our AI system analyzes peer review feedback to provide personalized insights and recommendations. 
                The feedback you give and receive helps our AI understand your <strong>strengths and growth areas</strong>, 
                automatically updating your <strong>Skill Competency</strong> profile and suggesting targeted 
                <strong> Study Plans</strong> and <strong>Career Paths</strong> based on peer assessment patterns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Peer Selector (if enabled) */}
      <PeerSelector className="mb-8" students={students} />

      {/* Content */}
      {children}
    </div>
  );
}
