import PeerFeedbackForm from "../form";
import { userService, UserData } from "@/db/user-service";
import { notFound } from "next/navigation";
import { PeerAssessmentLayout } from "../components";

interface PeerFeedbackPageProps {
  params: {
    id: string;
  };
}

export default async function PeerFeedbackPage({ params }: PeerFeedbackPageProps) {
  const defaultUserId: string = "93b45baa-8655-479b-9aa5-3b3bf6db1f0e"; // for demo purpose only

  const peers: UserData[] = await userService.getPeers(defaultUserId);
  const peer = peers.find((p) => p.userId === params.id);

  if (!peer) {
    notFound();
  }

  return (
    <PeerAssessmentLayout peers={peers}>
      <PeerFeedbackForm
        defaultValues={{
          personnelName: peer.rank ? `${peer.rank} ${peer.name}` : peer.name,
          defenceRole: peer.jobRole,
          assessmentCycle: "Mid-Year 2025",
        }}
      />
    </PeerAssessmentLayout>
  );
}
