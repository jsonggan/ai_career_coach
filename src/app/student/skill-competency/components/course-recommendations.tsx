"use client";

import { useState } from "react";

interface Course {
  id: string;
  title: string;
  provider: string;
  type: "sutd" | "online" | "certificate" | "project";
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  rating: number;
  students: number;
  skills: string[];
  description: string;
  communityRating: number;
  communityComments: number;
  price: string;
  isRecommended: boolean;
}

interface CommunityComment {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export default function CourseRecommendations() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Mock data - in real app, this would come from API
  const courses: Course[] = [
    {
      id: "1",
      title: "Machine Learning Fundamentals",
      provider: "SUTD",
      type: "sutd",
      duration: "12 weeks",
      difficulty: "intermediate",
      rating: 4.8,
      students: 245,
      skills: ["Machine Learning", "Python", "Statistics"],
      description: "Comprehensive introduction to machine learning algorithms and applications.",
      communityRating: 4.6,
      communityComments: 23,
      price: "Free",
      isRecommended: true
    },
    {
      id: "2",
      title: "AWS Cloud Practitioner",
      provider: "Amazon Web Services",
      type: "certificate",
      duration: "8 weeks",
      difficulty: "beginner",
      rating: 4.7,
      students: 1200,
      skills: ["Cloud Computing", "AWS", "DevOps"],
      description: "Official AWS certification course covering cloud fundamentals.",
      communityRating: 4.5,
      communityComments: 156,
      price: "$99",
      isRecommended: true
    },
    {
      id: "3",
      title: "React Advanced Patterns",
      provider: "Coursera",
      type: "online",
      duration: "6 weeks",
      difficulty: "advanced",
      rating: 4.6,
      students: 890,
      skills: ["React", "JavaScript", "Frontend Development"],
      description: "Deep dive into advanced React patterns and performance optimization.",
      communityRating: 4.4,
      communityComments: 67,
      price: "$49/month",
      isRecommended: false
    },
    {
      id: "4",
      title: "Build a Full-Stack E-commerce App",
      provider: "SUTD",
      type: "project",
      duration: "10 weeks",
      difficulty: "intermediate",
      rating: 4.9,
      students: 45,
      skills: ["Full-Stack Development", "Database Design", "API Development"],
      description: "Hands-on project building a complete e-commerce application.",
      communityRating: 4.8,
      communityComments: 12,
      price: "Free",
      isRecommended: true
    },
    {
      id: "5",
      title: "Data Science with Python",
      provider: "edX",
      type: "online",
      duration: "16 weeks",
      difficulty: "intermediate",
      rating: 4.5,
      students: 2100,
      skills: ["Data Science", "Python", "Data Analysis", "Statistics"],
      description: "Complete data science curriculum with real-world projects.",
      communityRating: 4.3,
      communityComments: 234,
      price: "$199",
      isRecommended: false
    }
  ];

  const communityComments: CommunityComment[] = [
    {
      id: "1",
      author: "Sarah Chen",
      rating: 5,
      comment: "Excellent course! The instructor explains complex concepts clearly. The hands-on projects really helped me understand ML algorithms.",
      date: "2024-01-10",
      helpful: 12
    },
    {
      id: "2",
      author: "Michael Tan",
      rating: 4,
      comment: "Good content but could use more practical examples. The assignments were challenging but fair.",
      date: "2024-01-08",
      helpful: 8
    },
    {
      id: "3",
      author: "Lisa Wong",
      rating: 5,
      comment: "Perfect for beginners! The community support is amazing and the instructor is very responsive.",
      date: "2024-01-05",
      helpful: 15
    }
  ];

  const filters = [
    { id: "all", label: "All Courses", icon: "📚" },
    { id: "sutd", label: "SUTD", icon: "🏫" },
    { id: "online", label: "Online", icon: "💻" },
    { id: "certificate", label: "Certificates", icon: "🏆" },
    { id: "project", label: "Projects", icon: "🚀" }
  ];

  const filteredCourses = selectedFilter === "all" 
    ? courses 
    : courses.filter(course => course.type === selectedFilter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sutd": return "bg-blue-100 text-blue-800";
      case "online": return "bg-green-100 text-green-800";
      case "certificate": return "bg-purple-100 text-purple-800";
      case "project": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Recommended Courses</h2>
        <p className="text-gray-600">
          AI-powered course recommendations based on your skill gaps, interests, and community feedback.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  {course.isRecommended && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{course.provider}</p>
                <p className="text-sm text-gray-700 mb-3">{course.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(course.type)}`}>
                {course.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </span>
              <span>{course.duration}</span>
              <span className="font-medium text-green-600">{course.price}</span>
            </div>

            <div className="flex items-center space-x-4 mb-3 text-sm">
              <div className="flex items-center space-x-1">
                {renderStars(course.rating)}
                <span className="text-gray-600">({course.rating})</span>
              </div>
              <span className="text-gray-600">{course.students} students</span>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {course.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span>👥</span>
                  <span>{course.communityComments} reviews</span>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(course.communityRating)}
                  <span>({course.communityRating})</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Details
              </button>
            </div>

            {/* Course Details Modal/Expansion */}
            {selectedCourse === course.id && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Community Reviews</h4>
                <div className="space-y-3">
                  {communityComments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(comment.rating)}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{comment.comment}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>👍 {comment.helpful} helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                  View all {course.communityComments} reviews →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Recommendation Summary */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Personalized Recommendations</h4>
            <p className="text-gray-700 text-sm">
              Based on your current skills in JavaScript and React, and your interest in Machine Learning, 
              I recommend starting with the "Machine Learning Fundamentals" course at SUTD, followed by 
              the AWS Cloud Practitioner certification. These will give you a strong foundation for 
              modern software development roles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
