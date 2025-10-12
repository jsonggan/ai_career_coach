import { PeerReviewLayout, EmptyState } from "./components";

// Mock student data - in real app this would come from API
const mockStudents = [
  {
    studentId: "1",
    name: "Alice Chen",
    major: "Computer Science and Design",
    year: "Year 3",
  },
  {
    studentId: "2", 
    name: "Bob Kumar",
    major: "Computer Science and Design",
    year: "Year 2",
  },
  {
    studentId: "3",
    name: "Carol Tan",
    major: "Computer Science and Design", 
    year: "Year 4",
  },
  {
    studentId: "4",
    name: "David Lee",
    major: "Computer Science and Design",
    year: "Year 3",
  },
];

export default async function StudentPeerReview() {
  return (
    <PeerReviewLayout bannerVariant="pending" pendingCount={4} students={mockStudents}>
      <EmptyState />
    </PeerReviewLayout>
  );
}
