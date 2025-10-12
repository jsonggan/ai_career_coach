import AcademyTrackClient from "./academy-track-client";

// SUTD CSD Courses Data
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

  // Year 2 Courses
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
    courseCode: "50.006",
    courseName: "User Interface Design",
    description: "Human-computer interaction, UI/UX design principles",
    credits: 4,
    level: 2000,
    prerequisites: ["50.001"],
    term: "Spring",
    year: 2026,
    category: "Core",
    department: "Computer Science and Design"
  },

  // Year 3 Specialization Courses
  // AI Track
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
  },
  {
    courseCode: "50.021",
    courseName: "Artificial Intelligence",
    description: "AI algorithms, knowledge representation, and reasoning",
    credits: 4,
    level: 3000,
    prerequisites: ["50.004"],
    term: "Spring",
    year: 2027,
    category: "Specialization",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.039",
    courseName: "Theory and Practice of Deep Learning",
    description: "Neural networks, deep learning architectures, and applications",
    credits: 4,
    level: 3000,
    prerequisites: ["50.007"],
    term: "Fall",
    year: 2027,
    category: "Specialization",
    department: "Computer Science and Design"
  },

  // Security Track
  {
    courseCode: "50.020",
    courseName: "Network Security",
    description: "Cryptography, network protocols, and security mechanisms",
    credits: 4,
    level: 3000,
    prerequisites: ["50.005"],
    term: "Fall",
    year: 2026,
    category: "Specialization",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.044",
    courseName: "System Security",
    description: "Operating system security, malware analysis, and defense",
    credits: 4,
    level: 3000,
    prerequisites: ["50.005"],
    term: "Spring",
    year: 2027,
    category: "Specialization",
    department: "Computer Science and Design"
  },

  // Data Analytics Track
  {
    courseCode: "50.038",
    courseName: "Computational Data Science",
    description: "Data mining, big data processing, and analytics",
    credits: 4,
    level: 3000,
    prerequisites: ["50.004", "30.001"],
    term: "Fall",
    year: 2026,
    category: "Specialization",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.043",
    courseName: "Database Systems",
    description: "Database design, SQL, NoSQL, and distributed databases",
    credits: 4,
    level: 3000,
    prerequisites: ["50.004"],
    term: "Spring",
    year: 2027,
    category: "Specialization",
    department: "Computer Science and Design"
  },

  // Software Engineering Track
  {
    courseCode: "50.019",
    courseName: "Software Engineering",
    description: "Advanced software development methodologies and project management",
    credits: 4,
    level: 3000,
    prerequisites: ["50.003"],
    term: "Fall",
    year: 2026,
    category: "Specialization",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.017",
    courseName: "Graphics and Visualisation",
    description: "Computer graphics, visualization techniques, and rendering",
    credits: 4,
    level: 3000,
    prerequisites: ["50.004"],
    term: "Spring",
    year: 2027,
    category: "Specialization",
    department: "Computer Science and Design"
  },

  // FinTech Track
  {
    courseCode: "50.037",
    courseName: "Blockchain Technology",
    description: "Distributed ledgers, cryptocurrencies, and smart contracts",
    credits: 4,
    level: 3000,
    prerequisites: ["50.005"],
    term: "Fall",
    year: 2026,
    category: "Specialization",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.042",
    courseName: "Financial Technology",
    description: "Financial systems, algorithmic trading, and risk management",
    credits: 4,
    level: 3000,
    prerequisites: ["30.001"],
    term: "Spring",
    year: 2027,
    category: "Specialization",
    department: "Computer Science and Design"
  },

  // Year 4 Advanced Courses
  {
    courseCode: "50.701",
    courseName: "Capstone Project",
    description: "Independent research and development project",
    credits: 8,
    level: 4000,
    prerequisites: ["50.003", "50.004"],
    term: "Fall",
    year: 2027,
    category: "Core",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.702",
    courseName: "Advanced Topics in Computer Science",
    description: "Current trends and emerging technologies in CS",
    credits: 4,
    level: 4000,
    prerequisites: ["50.004"],
    term: "Spring",
    year: 2028,
    category: "Elective",
    department: "Computer Science and Design"
  },

  // Electives
  {
    courseCode: "50.012",
    courseName: "Networks",
    description: "Network protocols, distributed systems, and performance",
    credits: 4,
    level: 3000,
    prerequisites: ["50.005"],
    term: "Fall",
    year: 2026,
    category: "Elective",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.016",
    courseName: "Mobile Application Development",
    description: "iOS and Android app development",
    credits: 4,
    level: 3000,
    prerequisites: ["50.003"],
    term: "Spring",
    year: 2027,
    category: "Elective",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.034",
    courseName: "Introduction to Game Development",
    description: "Game design, development frameworks, and interactive media",
    credits: 4,
    level: 3000,
    prerequisites: ["50.003"],
    term: "Fall",
    year: 2026,
    category: "Elective",
    department: "Computer Science and Design"
  },

  // Current Term (Spring 2025) Available Courses
  {
    courseCode: "50.008",
    courseName: "Compiler Design",
    description: "Language processing, parsing, and code generation",
    credits: 4,
    level: 3000,
    prerequisites: ["50.002", "50.004"],
    term: "Spring",
    year: 2025,
    category: "Elective",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.009",
    courseName: "Digital Signal Processing",
    description: "Signal analysis, filtering, and digital processing techniques",
    credits: 4,
    level: 3000,
    prerequisites: ["10.001"],
    term: "Spring",
    year: 2025,
    category: "Elective",
    department: "Computer Science and Design"
  },
  {
    courseCode: "50.018",
    courseName: "Computational Geometry",
    description: "Geometric algorithms and spatial data structures",
    credits: 4,
    level: 3000,
    prerequisites: ["50.004"],
    term: "Spring",
    year: 2025,
    category: "Elective",
    department: "Computer Science and Design"
  }
];

// Sample user course history for demonstration
const sampleUserCourseHistory = [
  // Fall 2024 - Completed
  {
    courseCode: "10.001",
    term: "Fall",
    year: 2024,
    status: "COMPLETED",
    grade: "A"
  },
  {
    courseCode: "10.002",
    term: "Fall",
    year: 2024,
    status: "COMPLETED",
    grade: "B+"
  },
  {
    courseCode: "50.001",
    term: "Fall",
    year: 2024,
    status: "COMPLETED",
    grade: "A-"
  },
  
  // Spring 2025 - Currently Enrolled
  {
    courseCode: "30.001",
    term: "Spring",
    year: 2025,
    status: "IN_PROGRESS",
    grade: null
  },
  {
    courseCode: "50.002",
    term: "Spring",
    year: 2025,
    status: "IN_PROGRESS",
    grade: null
  }
];

export default function AcademyTrack() {
  return (
    <AcademyTrackClient 
      coursesData={sutdCsdCourses}
      userCourseHistory={sampleUserCourseHistory}
    />
  );
}
