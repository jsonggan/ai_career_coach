import { PeerAssessmentLayout, EmptyState } from "./components";
import { userService, UserData } from "@/db/user-service";

export default async function PeerFeedbackPage() {
  const defaultUserId: string = "93b45baa-8655-479b-9aa5-3b3bf6db1f0e"; // for demo purpose only

  const peers: UserData[] = await userService.getPeers(defaultUserId);

  return (
    <PeerAssessmentLayout bannerVariant="pending" pendingCount={3} peers={peers}>
      <EmptyState />
    </PeerAssessmentLayout>
  );
}
