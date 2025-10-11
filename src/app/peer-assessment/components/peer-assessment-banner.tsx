interface PeerAssessmentBannerProps {
  variant?: "pending" | "active";
  pendingCount?: number;
}

export default function PeerAssessmentBanner({
  pendingCount = 0,
}: PeerAssessmentBannerProps) {
  return (
    <div className="mb-0 bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="p-1 bg-orange-100 rounded-full w-10 h-10 flex items-center justify-center">
          <i className="pi pi-users text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-orange-900 m-0">
            Pending Peer Assessments
          </h3>
          <p className="text-sm text-orange-700 m-0">
            {pendingCount} personnel are waiting for your assessment. Select a
            colleague below to provide your review.
          </p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          {pendingCount} Pending
        </div>
      </div>
    </div>
  );
}
