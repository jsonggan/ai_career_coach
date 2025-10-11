import { ReactNode } from "react";
import PeerAssessmentBanner from "./peer-assessment-banner";
import PeerSelector from "../peer-selector";
import { UserData } from "@/db/user-service";

interface PeerAssessmentLayoutProps {
  children: ReactNode;
  bannerVariant?: "pending" | "active";
  pendingCount?: number;
  showPeerSelector?: boolean;
  peers?: UserData[];
}

export default function PeerAssessmentLayout({
  children,
  pendingCount = 3,
  showPeerSelector = true,
  peers = [],
}: PeerAssessmentLayoutProps) {
  pendingCount = peers.length;
  return (
    <div
      className="flex flex-col w-full px-16 py-8"
      style={{ maxWidth: "1200px" }}
    >
      {/* Peer Assessment Banner */}
      <PeerAssessmentBanner pendingCount={pendingCount} />

      {/* Header Section */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Peer Assessment
        </h1>
        <p className="text-gray-600 m-0">
          Provide assessment for your colleague&apos;s performance review
        </p>
      </div>

      {/* Peer Selector (if enabled) */}
      {showPeerSelector && <PeerSelector className="mb-8" peers={peers} />}

      {/* Content */}
      {children}
    </div>
  );
}
