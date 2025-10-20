"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { Specialization, CareerPath, UserSpecialization, UserCareerPath } from "@/db/academy";

interface Course {
  course_id: number;
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
  aiTaggedSkill?: string;
  link?: string;
}

interface UserCourse {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  term: string;
  year: number;
  status: string;
  grade: string | null;
  credits: number;
  level: number;
  category: string;
  department: string;
  enrollmentDate: string;
  completionStatus: string;
}

interface AcademyTrackClientProps {
  coursesData: Course[];
  userCourseHistory: UserCourse[];
  mockCoursesData: Course[];
  academyData: {
    specializations: Specialization[];
    userSpecializations: UserSpecialization[];
    careerPaths: CareerPath[];
    userCareerPaths: UserCareerPath[];
  };
  defaultSelectedCourses?: string[];
}

export default function AcademyTrackClient({ coursesData, userCourseHistory, mockCoursesData, academyData, defaultSelectedCourses = [] }: AcademyTrackClientProps) {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [showAIHelp, setShowAIHelp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Course-related state
  const [previousCourses, setPreviousCourses] = useState<UserCourse[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(defaultSelectedCourses);
  const [currentTerm] = useState("Spring");
  const [currentYear] = useState(2025);
  
  // Database data state
  const [allCourses, setAllCourses] = useState<Course[]>(coursesData);
  const [userCourses, setUserCourses] = useState<UserCourse[]>(userCourseHistory);
  
  // Pagination and search state for all courses
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10);

  // Initialize selected tracks and careers from user's existing data
  useEffect(() => {
    // Initialize selected specializations
    const userSpecIds = academyData.userSpecializations.map(us => us.spec_id.toString());
    setSelectedTracks(userSpecIds);

    // Initialize selected career paths
    const userCareerIds = academyData.userCareerPaths.map(ucp => ucp.career_id.toString());
    setSelectedCareers(userCareerIds);
  }, [academyData]);

  // Initialize selected courses from default prop
  useEffect(() => {
    setSelectedCourses(defaultSelectedCourses);
  }, [defaultSelectedCourses]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  // Expandable course history state
  const [showAllPreviousCourses, setShowAllPreviousCourses] = useState(false);

  // Initialize data from props
  useEffect(() => {
    setAllCourses(coursesData);
    setUserCourses(userCourseHistory);
    setPreviousCourses(userCourseHistory);
    
    const completedOrInProgressCodes = userCourseHistory
      .filter(uc => uc.completionStatus !== 'NOT_STARTED')
      .map(uc => uc.courseCode);
    const mockAvailable = mockCoursesData.filter(course => 
      !completedOrInProgressCodes.includes(course.courseCode)
    );
    setAvailableCourses(mockAvailable);
  }, [coursesData, userCourseHistory, mockCoursesData]);

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
      case 'NOT_STARTED': return "bg-orange-100 text-orange-800";
      case 'DROPPED': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter and paginate all courses
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = !searchTerm || 
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level.toString() === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Get displayed previous courses (expandable)
  const displayedPreviousCourses = showAllPreviousCourses 
    ? previousCourses 
    : previousCourses.slice(0, 4);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Convert string arrays to number arrays for API
      const selectedSpecializations = selectedTracks.map(id => parseInt(id));
      const selectedCareerPaths = selectedCareers.map(id => parseInt(id));
      
      // Validation checks
      if (selectedSpecializations.length === 0) {
        toast.error('Please select at least one specialization track');
        return;
      }
      
      if (selectedCareerPaths.length === 0) {
        toast.error('Please select at least one career path');
        return;
      }
      
      const response = await fetch('/api/v1/academy-track', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // Hardcoded as per app pattern
          selectedSpecializations,
          selectedCareerPaths,
          selectedCourses
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save academy track');
      }

      toast.success('Your academic plan has been saved successfully!');
      
    } catch (error) {
      console.error('Error saving academy track:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save academy track');
    } finally {
      setIsLoading(false);
    }
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
            {academyData.specializations.map((track) => (
              <div
                key={track.spec_id}
                onClick={() => handleTrackSelection(track.spec_id.toString())}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTracks.includes(track.spec_id.toString())
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${selectedTracks.length >= 2 && !selectedTracks.includes(track.spec_id.toString()) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{track.icon || "🎓"}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{track.spec_name}</h3>
                    <p className="text-sm text-gray-600">{track.spec_desc}</p>
                  </div>
                  {selectedTracks.includes(track.spec_id.toString()) && (
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
            {academyData.careerPaths.map((career) => (
              <div
                key={career.career_id}
                onClick={() => handleCareerSelection(career.career_id.toString())}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCareers.includes(career.career_id.toString())
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{career.icon || "💼"}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{career.career_title}</h3>
                    <p className="text-sm text-gray-600">{career.career_desc}</p>
                  </div>
                  {selectedCareers.includes(career.career_id.toString()) && (
                    <div className="text-green-500">✓</div>
                  )}
                </div>
              </div>
            ))}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">📚 Previous Courses</h3>
              {previousCourses.length > 4 && (
                <button
                  onClick={() => setShowAllPreviousCourses(!showAllPreviousCourses)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showAllPreviousCourses ? 'Show Less' : `Show All (${previousCourses.length})`}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedPreviousCourses.map((course, index) => (
                <div key={course.id || index} className="border border-gray-200 rounded-lg p-4">
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
                  {/* <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{course.term} {course.year}</span>
                    <span>{course.credits} credits</span>
                  </div> */}
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
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Selected: {selectedCourses.length} courses
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Showing all available courses. Select the courses you want to enroll in for Spring 2025. Prerequisites are automatically checked.
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
                        {course.link && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(course.link, '_blank', 'noopener,noreferrer');
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="View course details"
                          >
                            🔗
                          </button>
                        )}
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
                <p>
                  No courses available for ${currentTerm} ${currentYear}.
                </p>
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

          {/* View All Courses Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">📖 All Available Courses</h3>
              <button
                onClick={() => setShowAllCourses(!showAllCourses)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showAllCourses ? 'Hide All Courses' : `View All Courses (${allCourses.length})`}
              </button>
            </div>

            {showAllCourses && (
              <div className="space-y-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search courses by code, name, or description..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="Core">Core</option>
                    <option value="Specialization">Specialization</option>
                    <option value="Elective">Elective</option>
                  </select>
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="1000">Level 1000</option>
                    <option value="2000">Level 2000</option>
                    <option value="3000">Level 3000</option>
                    <option value="4000">Level 4000</option>
                  </select>
                </div>

                {/* Courses Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentCourses.map((course) => {
                          const isTaken = userCourses.some(uc => uc.courseCode === course.courseCode);
                          return (
                            <tr key={course.course_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.courseCode}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{course.courseName}</div>
                                  <div className="text-gray-500 text-xs mt-1">{course.description}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  course.category === 'Core' ? 'bg-red-100 text-red-800' :
                                  course.category === 'Specialization' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {course.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{course.level}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{course.credits}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {isTaken ? (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Taken
                                  </span>
                                ) : (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Available
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {course.link ? (
                                  <button
                                    onClick={() => window.open(course.link, '_blank', 'noopener,noreferrer')}
                                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                                    title="View course details"
                                  >
                                    View Details
                                  </button>
                                ) : (
                                  <span className="text-gray-400 text-sm">No link</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredCourses.length)} of {filteredCourses.length} courses
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        let pageNumber: number;
                        if (totalPages <= 5) {
                          pageNumber = index + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + index;
                        } else {
                          pageNumber = currentPage - 2 + index;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`px-3 py-1 text-sm border rounded-md ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Academic Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
