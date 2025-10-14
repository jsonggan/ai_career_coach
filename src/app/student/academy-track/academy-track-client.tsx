"use client";

import { useState, useEffect } from "react";

// Define types for the course data
interface Course {
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  level: number;
  prerequisites: string[];
  term: string;
  year: number;
  category: string;
  department: string;
}

interface UserCourse {
  courseCode: string;
  term: string;
  year: number;
  status: string;
  grade: string | null;
}

interface AcademyTrackClientProps {
  coursesData: Course[];
  userCourseHistory: UserCourse[];
}

// Specialisation tracks based on SUTD CSD program
const specialisationTracks = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    description: "Focus on intelligent systems that can operate autonomously, learn from experience, and solve complex problems.",
    icon: "🤖"
  },
  {
    id: "security",
    name: "Security",
    description: "Develop state-of-the-art knowledge of computer security, network security and cybersecurity technologies.",
    icon: "🔒"
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    description: "Revolves around data capture, analysis and exploitation to extract insights and make informed decisions.",
    icon: "📊"
  },
  {
    id: "software-engineering",
    name: "Software Engineering",
    description: "Design, develop, test, evaluate and maintain software systems with engineering principles.",
    icon: "💻"
  },
  {
    id: "iot-systems",
    name: "IoT and Intelligent Systems",
    description: "Build large-scale networked and distributed systems for automotive, web services and e-commerce solutions.",
    icon: "🌐"
  },
  {
    id: "fintech",
    name: "Financial Technology",
    description: "Understand core challenges in finance and advanced computing technologies for next-gen financial services.",
    icon: "💰"
  },
  {
    id: "visual-analytics",
    name: "Visual Analytics and Computing",
    description: "Develop systems to handle visual data, mainly images, videos and shapes using computer analysis.",
    icon: "🎨"
  },
  {
    id: "custom",
    name: "Custom Specialisation",
    description: "Create an interdisciplinary curriculum around a coherent technical theme of your interest.",
    icon: "⚙️"
  }
];

// Career paths based on CSD graduate positions
const careerPaths = [
  {
    id: "software-engineer",
    name: "Software Engineer/Developer",
    description: "Design and develop software applications and systems",
    icon: "👨‍💻"
  },
  {
    id: "data-scientist",
    name: "Data Analyst/Scientist",
    description: "Analyze data to extract insights and support decision-making",
    icon: "📈"
  },
  {
    id: "product-manager",
    name: "Product Manager",
    description: "Lead product development and strategy",
    icon: "📋"
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity Specialist",
    description: "Protect systems and networks from security threats",
    icon: "🛡️"
  },
  {
    id: "frontend-engineer",
    name: "Front-end Designer/Engineer",
    description: "Create user interfaces and user experiences",
    icon: "🎨"
  },
  {
    id: "fullstack-engineer",
    name: "Full Stack Engineer",
    description: "Work on both frontend and backend development",
    icon: "🔧"
  },
  {
    id: "game-designer",
    name: "Game Designer",
    description: "Design and develop interactive games",
    icon: "🎮"
  },
  {
    id: "research-engineer",
    name: "Research Officer/Engineer",
    description: "Conduct research and development in technology",
    icon: "🔬"
  },
  {
    id: "system-consultant",
    name: "System Consultant",
    description: "Provide technical consulting and system design",
    icon: "💼"
  },
  {
    id: "entrepreneur",
    name: "Entrepreneur/Startup Founder",
    description: "Launch and lead technology startups",
    icon: "🚀"
  }
];

export default function AcademyTrackClient({ coursesData, userCourseHistory }: AcademyTrackClientProps) {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [customCareer, setCustomCareer] = useState<string>("");
  const [studentComments, setStudentComments] = useState<string>("");
  const [showAIHelp, setShowAIHelp] = useState<string>("");
  
  // Course-related state
  const [previousCourses, setPreviousCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [currentTerm] = useState("Spring");
  const [currentYear] = useState(2025);

  // Load course data on component mount
  useEffect(() => {
    // Load previous courses (using sample data for now)
    const prevCourses = userCourseHistory.map(userCourse => {
      const courseDetails = coursesData.find(c => c.courseCode === userCourse.courseCode);
      return {
        ...courseDetails,
        ...userCourse
      };
    });
    setPreviousCourses(prevCourses);

    // Load available courses for current term
    const available = coursesData.filter(course => 
      course.term === currentTerm && 
      course.year === currentYear &&
      !userCourseHistory.some(uc => uc.courseCode === course.courseCode)
    );
    setAvailableCourses(available);
  }, [currentTerm, currentYear, coursesData, userCourseHistory]);

  const handleTrackSelection = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else if (selectedTracks.length < 2) {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const handleCareerSelection = (careerId: string) => {
    if (selectedCareers.includes(careerId)) {
      setSelectedCareers(selectedCareers.filter(id => id !== careerId));
    } else {
      setSelectedCareers([...selectedCareers, careerId]);
    }
  };

  const handleCourseSelection = (courseCode: string) => {
    if (selectedCourses.includes(courseCode)) {
      setSelectedCourses(selectedCourses.filter(code => code !== courseCode));
    } else {
      setSelectedCourses([...selectedCourses, courseCode]);
    }
  };

  const canEnrollInCourse = (course: any) => {
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return true;
    }
    
    const completedCourseCodes = previousCourses
      .filter(c => c.status === 'COMPLETED')
      .map(c => c.courseCode);
    
    return course.prerequisites.every((prereq: string) => 
      completedCourseCodes.includes(prereq)
    );
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "text-gray-500";
    if (grade.startsWith('A')) return "text-green-600";
    if (grade.startsWith('B')) return "text-blue-600";
    if (grade.startsWith('C')) return "text-yellow-600";
    return "text-red-600";
  };

  const getCourseStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return "bg-green-100 text-green-800";
      case 'IN_PROGRESS': return "bg-blue-100 text-blue-800";
      case 'ENROLLED': return "bg-purple-100 text-purple-800";
      case 'DROPPED': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log({
      major: "Computer Science and Design",
      specialisationTracks: selectedTracks,
      careerPaths: selectedCareers,
      customCareer: customCareer,
      comments: studentComments,
      selectedCourses: selectedCourses,
      currentTerm: currentTerm,
      currentYear: currentYear
    });
    alert("Your academic plan has been saved!");
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Courses, Major & Career</h1>
          <p className="text-lg text-gray-600">
            Plan your academic journey and career path with the Computer Science and Design program.
          </p>
        </div>

        {/* Major Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Major</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎓</div>
              <div>
                <h3 className="font-semibold text-blue-900">Computer Science and Design (CSD)</h3>
                <p className="text-blue-700 text-sm">
                  A computing systems curriculum underscored by intelligence, integrating traditional Computer Science and Information Systems with design thinking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialisation Tracks */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Specialisation Tracks (Choose up to 2)</h2>
            <button
              onClick={() => setShowAIHelp(showAIHelp === "tracks" ? "" : "tracks")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAIHelp === "tracks" ? "Hide AI Help" : "Get AI Help"}
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            Select up to 2 specialisation tracks to focus your studies. These will be reflected on your transcript.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialisationTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => handleTrackSelection(track.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTracks.includes(track.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${selectedTracks.length >= 2 && !selectedTracks.includes(track.id) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{track.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{track.name}</h3>
                    <p className="text-sm text-gray-600">{track.description}</p>
                  </div>
                  {selectedTracks.includes(track.id) && (
                    <div className="text-blue-500">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showAIHelp === "tracks" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-lg">🤖</div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">AI Assistant:</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Each specialisation track prepares you for different career paths:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• <strong>AI + Data Analytics:</strong> Perfect for data science and AI research roles</li>
                    <li>• <strong>Security + Software Engineering:</strong> Ideal for cybersecurity and secure software development</li>
                    <li>• <strong>FinTech + Data Analytics:</strong> Great for financial technology and fintech startups</li>
                    <li>• <strong>IoT + Visual Analytics:</strong> Excellent for smart systems and computer vision roles</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Career Path Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Career Paths (Choose multiple)</h2>
            <button
              onClick={() => setShowAIHelp(showAIHelp === "career" ? "" : "career")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAIHelp === "career" ? "Hide AI Help" : "Get AI Help"}
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            Choose your target career paths to help us customize your skill development and study plan. You can select multiple options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {careerPaths.map((career) => (
              <div
                key={career.id}
                onClick={() => handleCareerSelection(career.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCareers.includes(career.id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{career.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{career.name}</h3>
                    <p className="text-sm text-gray-600">{career.description}</p>
                  </div>
                  {selectedCareers.includes(career.id) && (
                    <div className="text-green-500">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Career Path */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Other Career Path</h3>
            <p className="text-gray-600 mb-3">
              Don&apos;t see your desired career path? Enter a custom option below.
            </p>
            <input
              type="text"
              value={customCareer}
              onChange={(e) => setCustomCareer(e.target.value)}
              placeholder="Enter your custom career path..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {showAIHelp === "career" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-lg">🤖</div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">AI Assistant:</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Based on SUTD CSD graduate data, here are the most common career paths:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• <strong>Software Engineer:</strong> Most popular path, works in tech companies, startups, and enterprises</li>
                    <li>• <strong>Product Manager:</strong> Combines technical knowledge with business strategy</li>
                    <li>• <strong>Data Scientist:</strong> High demand in finance, healthcare, and tech companies</li>
                    <li>• <strong>Entrepreneur:</strong> Many CSD graduates start successful tech companies</li>
                  </ul>
                  <p className="text-gray-700 text-sm mt-2">
                    <strong>Tip:</strong> You can select multiple career paths if you&apos;re interested in exploring different directions. This helps us create a more comprehensive skill development plan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Course History and Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Progress & Course Selection</h2>
          
          {/* Previous Courses */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📚 Previous Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previousCourses.map((course, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.courseCode}</h4>
                      <p className="text-sm text-gray-600">{course.courseName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCourseStatusColor(course.status)}`}>
                        {course.status.replace('_', ' ')}
                      </span>
                      {course.grade && (
                        <p className={`text-sm font-semibold mt-1 ${getGradeColor(course.grade)}`}>
                          Grade: {course.grade}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{course.term} {course.year}</span>
                    <span>{course.credits} credits</span>
                  </div>
                </div>
              ))}
            </div>
            
            {previousCourses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No previous courses recorded.</p>
              </div>
            )}
          </div>

          {/* Current Term Course Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                🎓 Course Selection for {currentTerm} {currentYear}
              </h3>
              <div className="text-sm text-gray-600">
                Selected: {selectedCourses.length} courses
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Select the courses you want to enroll in for the current term. Prerequisites are automatically checked.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {availableCourses.map((course) => {
                const canEnroll = canEnrollInCourse(course);
                const isSelected = selectedCourses.includes(course.courseCode);
                
                return (
                  <div
                    key={course.courseCode}
                    onClick={() => canEnroll && handleCourseSelection(course.courseCode)}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : canEnroll
                        ? "border-gray-200 hover:border-gray-300 cursor-pointer"
                        : "border-gray-100 bg-gray-50"
                    } ${!canEnroll ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{course.courseCode}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.category === 'Core' ? 'bg-red-100 text-red-800' :
                            course.category === 'Specialization' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {course.category}
                          </span>
                          <span className="text-xs text-gray-500">{course.credits} credits</span>
                        </div>
                        <h5 className="font-medium text-gray-800 mb-1">{course.courseName}</h5>
                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                        
                        {course.prerequisites && course.prerequisites.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Prerequisites: </span>
                            {course.prerequisites.join(', ')}
                            {!canEnroll && (
                              <span className="text-red-500 ml-2">⚠️ Missing prerequisites</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isSelected && canEnroll && (
                          <div className="text-blue-500">✓</div>
                        )}
                        {!canEnroll && (
                          <div className="text-red-500">🔒</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {availableCourses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No courses available for {currentTerm} {currentYear}.</p>
              </div>
            )}

            {selectedCourses.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Selected Courses Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {selectedCourses.map(courseCode => {
                    const course = availableCourses.find(c => c.courseCode === courseCode);
                    return course ? (
                      <div key={courseCode} className="flex justify-between text-blue-800">
                        <span>{course.courseCode} - {course.courseName}</span>
                        <span>{course.credits} credits</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="flex justify-between font-medium text-blue-900">
                    <span>Total Credits:</span>
                    <span>
                      {selectedCourses.reduce((total, courseCode) => {
                        const course = availableCourses.find(c => c.courseCode === courseCode);
                        return total + (course ? course.credits : 0);
                      }, 0)} credits
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Student Comments */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Comments</h2>
          <p className="text-gray-600 mb-4">
            Share your thoughts, interests, or specific goals. This helps us customize your skill competency tracking and study plan.
          </p>
          
          <textarea
            value={studentComments}
            onChange={(e) => setStudentComments(e.target.value)}
            placeholder="Tell us about your interests, career goals, or any specific areas you'd like to focus on..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Save Academic Plan
          </button>
        </div>
      </div>
    </div>
  );
}
