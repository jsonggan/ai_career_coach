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
      <PeerReviewBanner pendingCount={pendingCount} />

      {/* Header Section */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Peer Review
        </h1>
        <p className="text-gray-600 m-0">
          Review and get reviewed by your fellow students to improve your academic work and receive valuable feedback
        </p>
      </div>

      {/* Peer Selector (if enabled) */}
      {showPeerSelector && <PeerSelector className="mb-8" students={students} />}

      {/* Content */}
      {children}
    </div>
  );
}
