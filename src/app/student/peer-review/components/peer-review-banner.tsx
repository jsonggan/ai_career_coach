interface PeerReviewBannerProps {
  variant?: "pending" | "active";
  pendingCount?: number;
}

export default function PeerReviewBanner({
  pendingCount = 0,
}: PeerReviewBannerProps) {
  return (
    <div className="mb-0 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="p-1 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
          <i className="pi pi-users text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 m-0">
            Pending Peer Reviews
          </h3>
          <p className="text-sm text-blue-700 m-0">
            {pendingCount} students are waiting for your review. Select a
            peer below to provide your feedback.
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {pendingCount} Pending
        </div>
      </div>
    </div>
  );
}
