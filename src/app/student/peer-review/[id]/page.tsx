import { PeerReviewLayout } from "../components";
import PeerReviewForm from "../form";

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

// Mock student data - in real app this would come from API based on ID
const getStudentById = (id: string) => {
  const students = [
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
  
  return students.find(student => student.studentId === id) || students[0];
};

interface PeerReviewPageProps {
  params: {
    id: string;
  };
}

export default async function PeerReviewPage({ params }: PeerReviewPageProps) {
  const student = getStudentById(params.id);
  
  return (
    <PeerReviewLayout 
      bannerVariant="active" 
      pendingCount={3} 
      showPeerSelector={true}
      students={mockStudents}
    >
      <PeerReviewForm 
        defaultValues={{
          studentName: student.name,
          major: student.major,
          year: student.year,
        }}
      />
    </PeerReviewLayout>
  );
}
