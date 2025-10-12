import CommunityClient from "./community-client";

// SUTD CSD Courses Data (using same courses as other student pages)
const sutdCsdCourses = [
  // Year 1 Courses
  {
    courseCode: "10.001",
    courseName: "Mathematics I",
    description: "Calculus, linear algebra, and mathematical foundations for computer science",
    credits: 4,
    level: 1000,
    prerequisites: [],
    term: "Fall",
    year: 2024,
    category: "Core",
    department: "Computer Science and Design"
  },
  {
    courseCode: "10.002",
    courseName: "Physics I",
    description: "Mechanics, thermodynamics, and waves",
    credits: 4,
    level: 1000,
    prerequisites: [],
    term: "Fall",
    year: 2024,
    category: "Core",
    department: "Engineering Systems and Design"
  },
  {
    courseCode: "50.001",
    courseName: "Information Systems & Programming",
    description: "Introduction to programming concepts and information systems",
    credits: 4,
    level: 1000,
    prerequisites: [],
    term: "Fall",
    year: 2024,
    category: "Core",
    department: "Computer Science and Design"
  },
  {
    courseCode: "30.001",
    courseName: "Introduction to Probability and Statistics",
    description: "Probability theory, statistical inference, and data analysis",
    credits: 4,
    level: 1000,
    prerequisites: [],
    term: "Spring",
    year: 2025,
    category: "Core",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.002",
    courseName: "Computation Structures",
    description: "Digital systems, computer architecture, and assembly programming",
    credits: 4,
    level: 1000,
    prerequisites: ["50.001"],
    term: "Spring",
    year: 2025,
    category: "Core",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.003",
    courseName: "Elements of Software Construction",
    description: "Software engineering principles, design patterns, and testing",
    credits: 4,
    level: 2000,
    prerequisites: ["50.001"],
    term: "Fall",
    year: 2025,
    category: "Core",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.004",
    courseName: "Introduction to Algorithms",
    description: "Algorithm design, analysis, and data structures",
    credits: 4,
    level: 2000,
    prerequisites: ["50.001", "30.001"],
    term: "Fall",
    year: 2025,
    category: "Core",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.005",
    courseName: "Computer System Engineering",
    description: "Operating systems, distributed systems, and networking",
    credits: 4,
    level: 2000,
    prerequisites: ["50.002"],
    term: "Spring",
    year: 2026,
    category: "Core",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.007",
    courseName: "Machine Learning",
    description: "Supervised and unsupervised learning algorithms",
    credits: 4,
    level: 3000,
    prerequisites: ["50.004", "30.001"],
    term: "Fall",
    year: 2026,
    category: "Specialization",
    department: "Computer Science and Design"
  }
];

// Sample user course history
const sampleUserCourseHistory = [
  {
    courseCode: "10.001",
    term: "Fall",
    year: 2024,
    status: "COMPLETED" as const,
    grade: "A"
  },
  {
    courseCode: "10.002",
    term: "Fall",
    year: 2024,
    status: "COMPLETED" as const,
    grade: "B+"
  },
  {
    courseCode: "50.001",
    term: "Fall",
    year: 2024,
    status: "COMPLETED" as const,
    grade: "A-"
  },
  {
    courseCode: "30.001",
    term: "Spring",
    year: 2025,
    status: "IN_PROGRESS" as const,
    grade: null
  },
  {
    courseCode: "50.002",
    term: "Spring",
    year: 2025,
    status: "IN_PROGRESS" as const,
    grade: null
  }
];

// Professors data
const professorsData = [
  {
    id: "prof1",
    name: "Dr. Sarah Chen",
    department: "Computer Science and Design"
  },
  {
    id: "prof2", 
    name: "Prof. Michael Wong",
    department: "Computer Science and Design"
  },
  {
    id: "prof3",
    name: "Dr. Lisa Zhang",
    department: "Engineering Systems and Design"
  },
  {
    id: "prof4",
    name: "Prof. David Kim",
    department: "Computer Science and Design"
  },
  {
    id: "prof5",
    name: "Dr. Jennifer Liu",
    department: "Computer Science and Design"
  }
];

// Course term summaries with AI analysis
const courseTermSummaries = [
  {
    courseCode: "10.001",
    term: "Fall",
    year: 2024,
    professorName: "Dr. Sarah Chen",
    reviewCount: 8,
    avgCourseRating: 4.2,
    avgProfessorRating: 4.5,
    aiSummary: "Students consistently praise Dr. Chen's clear explanations of complex mathematical concepts. The course is well-structured with gradually increasing difficulty. Most students find the problem sets challenging but fair, with excellent preparation for advanced CS courses. The midterm and final exams are difficult but aligned with class material. Dr. Chen is noted for being very approachable during office hours and providing detailed feedback on assignments."
  },
  {
    courseCode: "10.001",
    term: "Spring",
    year: 2024,
    professorName: "Prof. Michael Wong",
    reviewCount: 5,
    avgCourseRating: 3.8,
    avgProfessorRating: 3.9,
    aiSummary: "Prof. Wong's teaching style is more traditional and focuses heavily on theoretical aspects. Students appreciate the rigorous mathematical foundation but some find the pace quite fast. The grading is strict but fair. Office hours are helpful, though Prof. Wong can be somewhat intimidating initially. The course prepares students well for advanced mathematics courses."
  },
  {
    courseCode: "50.001",
    term: "Fall",
    year: 2024,
    professorName: "Dr. Lisa Zhang",
    reviewCount: 12,
    avgCourseRating: 4.6,
    avgProfessorRating: 4.7,
    aiSummary: "Dr. Zhang is highly regarded for making programming accessible to beginners. Her teaching methodology includes hands-on coding sessions and real-world projects that students find engaging. The labs are well-designed with gradual skill building. Students particularly appreciate her patience with beginners and clear coding demonstrations. The final project allows for creativity while reinforcing core concepts. Excellent preparation for advanced programming courses."
  },
  {
    courseCode: "10.002",
    term: "Fall",
    year: 2024,
    professorName: "Prof. David Kim", 
    reviewCount: 6,
    avgCourseRating: 3.5,
    avgProfessorRating: 3.4,
    aiSummary: "Prof. Kim's physics course is known for its rigor and mathematical intensity. Students find the theoretical content challenging, with mixed opinions on the teaching style. The laboratory sessions are well-organized but demanding. Some students struggle with the fast-paced lectures, while others appreciate the thorough coverage of fundamental physics principles. The course requires significant time investment but provides a solid foundation in physics."
  },
  {
    courseCode: "50.002",
    term: "Spring",
    year: 2025,
    professorName: "Dr. Jennifer Liu",
    reviewCount: 4,
    avgCourseRating: 4.0,
    avgProfessorRating: 4.2,
    aiSummary: "Dr. Liu effectively bridges the gap between hardware and software concepts. Students appreciate her practical approach to computer architecture and assembly programming. The lab exercises are particularly valuable for understanding low-level programming concepts. Some find the debugging assignments challenging but educational. Dr. Liu is known for her clear explanations and willingness to help students during office hours."
  }
];

// Detailed course reviews
const mockCourseReviews = [
  // 10.001 Fall 2024 Reviews
  {
    id: "1",
    courseCode: "10.001",
    term: "Fall",
    year: 2024,
    professorId: "prof1",
    professorName: "Dr. Sarah Chen",
    userId: "user1",
    userName: "Alex Chen",
    courseRating: 4,
    courseDifficulty: 3,
    courseWorkload: 4,
    courseUsefulness: 5,
    professorRating: 5,
    professorClarity: 5,
    professorHelpfulness: 5,
    professorEngagement: 4,
    comment: "Dr. Chen is an excellent instructor who makes complex mathematical concepts accessible. The course is well-structured with clear learning objectives. Problem sets are challenging but help reinforce the material. Her office hours are incredibly helpful, and she takes time to ensure everyone understands the concepts. The midterm was fair, though the final was quite challenging. I'd highly recommend taking this course with Dr. Chen if possible.",
    timestamp: "2024-12-15T10:30:00Z",
    upvotes: 12,
    hasUpvoted: false,
    isAnonymous: false
  },
  {
    id: "2",
    courseCode: "10.001",
    term: "Fall", 
    year: 2024,
    professorId: "prof1",
    professorName: "Dr. Sarah Chen",
    userId: "user2",
    userName: "Anonymous",
    courseRating: 5,
    courseDifficulty: 4,
    courseWorkload: 4,
    courseUsefulness: 5,
    professorRating: 4,
    professorClarity: 4,
    professorHelpfulness: 5,
    professorEngagement: 4,
    comment: "This course provides an excellent foundation in mathematics for computer science. Dr. Chen's teaching style is very clear and methodical. The weekly problem sets are time-consuming but essential for understanding. The course moves at a good pace, though some topics like linear algebra can be dense. Make sure to attend tutorials - they're extremely helpful for exam preparation. Overall, a challenging but rewarding course.",
    timestamp: "2024-12-12T14:20:00Z",
    upvotes: 8,
    hasUpvoted: true,
    isAnonymous: true
  },
  {
    id: "3",
    courseCode: "50.001",
    term: "Fall",
    year: 2024,
    professorId: "prof3",
    professorName: "Dr. Lisa Zhang",
    userId: "user3",
    userName: "Sarah Kim",
    courseRating: 5,
    courseDifficulty: 2,
    courseWorkload: 3,
    courseUsefulness: 5,
    professorRating: 5,
    professorClarity: 5,
    professorHelpfulness: 5,
    professorEngagement: 5,
    comment: "Dr. Zhang is hands down the best programming instructor I've had. She makes coding fun and accessible, even for complete beginners. The labs are well-designed and build upon each other logically. Her live coding demonstrations are particularly helpful for understanding debugging techniques. The final project was challenging but allowed for creativity. She's always available for help and genuinely cares about student success. Can't recommend this course enough!",
    timestamp: "2024-12-10T16:45:00Z",
    upvotes: 15,
    hasUpvoted: false,
    isAnonymous: false
  },
  {
    id: "4",
    courseCode: "10.002",
    term: "Fall",
    year: 2024,
    professorId: "prof4",
    professorName: "Prof. David Kim",
    userId: "user4",
    userName: "Anonymous",
    courseRating: 3,
    courseDifficulty: 4,
    courseWorkload: 4,
    courseUsefulness: 3,
    professorRating: 3,
    professorClarity: 3,
    professorHelpfulness: 3,
    professorEngagement: 3,
    comment: "This course is quite challenging and requires a strong mathematical background. Prof. Kim's lectures can be dense and sometimes hard to follow. The pace is very fast, and it's easy to fall behind if you miss classes. The laboratory work is interesting but time-consuming. I'd recommend getting a good physics textbook to supplement the lectures. The course content is important for understanding fundamental physics principles, but the delivery could be improved.",
    timestamp: "2024-12-08T09:15:00Z",
    upvotes: 5,
    hasUpvoted: false,
    isAnonymous: true
  },
  {
    id: "5",
    courseCode: "50.002",
    term: "Spring",
    year: 2025,
    professorId: "prof5",
    professorName: "Dr. Jennifer Liu",
    userId: "user5",
    userName: "Mike Johnson",
    courseRating: 4,
    courseDifficulty: 3,
    courseWorkload: 3,
    courseUsefulness: 4,
    professorRating: 4,
    professorClarity: 4,
    professorHelpfulness: 4,
    professorEngagement: 4,
    comment: "Dr. Liu does a great job explaining computer architecture concepts. The transition from high-level programming to assembly language can be challenging, but her step-by-step approach helps a lot. The lab assignments are well-designed and really help you understand how computers work at the hardware level. Some debugging can be frustrating, but it's great learning experience. The course gives you a solid understanding of computer systems that's valuable for advanced CS courses.",
    timestamp: "2024-12-05T11:30:00Z",
    upvotes: 7,
    hasUpvoted: true,
    isAnonymous: false
  }
];

export default function StudentCommunity() {
  return (
    <CommunityClient 
      courses={sutdCsdCourses}
      userCourses={sampleUserCourseHistory}
      courseReviews={mockCourseReviews}
      courseTermSummaries={courseTermSummaries}
      professors={professorsData}
    />
  );
}
