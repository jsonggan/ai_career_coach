'use client';

import { useState } from 'react';

// Types
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
  status: 'COMPLETED' | 'IN_PROGRESS';
  grade: string | null;
}

interface Professor {
  id: string;
  name: string;
  department: string;
}

interface CourseReview {
  id: string;
  courseCode: string;
  term: string;
  year: number;
  professorId: string;
  professorName: string;
  userId: string;
  userName: string;
  // Course ratings
  courseRating: number;
  courseDifficulty: number;
  courseWorkload: number;
  courseUsefulness: number;
  // Professor ratings
  professorRating: number;
  professorClarity: number;
  professorHelpfulness: number;
  professorEngagement: number;
  comment: string;
  timestamp: string;
  upvotes: number;
  hasUpvoted: boolean;
  isAnonymous: boolean;
}

interface CourseTermSummary {
  courseCode: string;
  term: string;
  year: number;
  professorName: string;
  reviewCount: number;
  avgCourseRating: number;
  avgProfessorRating: number;
  aiSummary: string;
}

interface CommunityClientProps {
  courses: Course[];
  userCourses: UserCourse[];
  courseReviews: CourseReview[];
  courseTermSummaries: CourseTermSummary[];
  professors: Professor[];
}

export default function CommunityClient({ 
  courses, 
  userCourses, 
  courseReviews: initialCourseReviews,
  courseTermSummaries,
  professors 
}: CommunityClientProps) {
  const [courseReviews, setCourseReviews] = useState(initialCourseReviews);
  const [currentView, setCurrentView] = useState<'all-courses' | 'course-terms' | 'detailed-reviews'>('all-courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<CourseTermSummary | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    courseCode: '',
    term: '',
    year: 2025,
    professorId: '',
    courseRating: 5,
    courseDifficulty: 3,
    courseWorkload: 3,
    courseUsefulness: 4,
    professorRating: 5,
    professorClarity: 4,
    professorHelpfulness: 4,
    professorEngagement: 4,
    comment: '',
    isAnonymous: false
  });

  // Get completed courses for reviews
  const completedCourses = userCourses
    .filter(uc => uc.status === 'COMPLETED')
    .map(uc => courses.find(c => c.courseCode === uc.courseCode))
    .filter(Boolean) as Course[];

  // Get all courses with review data
  const allCoursesWithReviews = courses.map(course => {
    const reviews = courseReviews.filter(r => r.courseCode === course.courseCode);
    const avgCourseRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.courseRating, 0) / reviews.length 
      : 0;
    const avgProfessorRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.professorRating, 0) / reviews.length
      : 0;
    
    return {
      ...course,
      reviewCount: reviews.length,
      avgCourseRating,
      avgProfessorRating
    };
  }).sort((a, b) => a.courseCode.localeCompare(b.courseCode));

  // Get term summaries for selected course
  const selectedCourseTerms = selectedCourse 
    ? courseTermSummaries.filter(ts => ts.courseCode === selectedCourse.courseCode)
        .sort((a, b) => b.year - a.year || (b.term === 'Fall' ? 1 : -1))
    : [];

  // Get detailed reviews for selected term
  const selectedTermReviews = selectedTerm
    ? courseReviews.filter(r => 
        r.courseCode === selectedTerm.courseCode && 
        r.term === selectedTerm.term && 
        r.year === selectedTerm.year
      ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.courseCode || !reviewForm.professorId) return;

    const professor = professors.find(p => p.id === reviewForm.professorId);
    if (!professor) return;

    const newReview: CourseReview = {
      id: Date.now().toString(),
      courseCode: reviewForm.courseCode,
      term: reviewForm.term,
      year: reviewForm.year,
      professorId: reviewForm.professorId,
      professorName: professor.name,
      userId: 'current-user',
      userName: reviewForm.isAnonymous ? 'Anonymous' : 'You',
      courseRating: reviewForm.courseRating,
      courseDifficulty: reviewForm.courseDifficulty,
      courseWorkload: reviewForm.courseWorkload,
      courseUsefulness: reviewForm.courseUsefulness,
      professorRating: reviewForm.professorRating,
      professorClarity: reviewForm.professorClarity,
      professorHelpfulness: reviewForm.professorHelpfulness,
      professorEngagement: reviewForm.professorEngagement,
      comment: reviewForm.comment,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      hasUpvoted: false,
      isAnonymous: reviewForm.isAnonymous
    };

    setCourseReviews([newReview, ...courseReviews]);
    setReviewForm({
      courseCode: '',
      term: '',
      year: 2025,
      professorId: '',
      courseRating: 5,
      courseDifficulty: 3,
      courseWorkload: 3,
      courseUsefulness: 4,
      professorRating: 5,
      professorClarity: 4,
      professorHelpfulness: 4,
      professorEngagement: 4,
      comment: '',
      isAnonymous: false
    });
    setShowReviewForm(false);
  };

  // Handle upvotes
  const handleUpvoteReview = (reviewId: string) => {
    setCourseReviews(courseReviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            upvotes: review.hasUpvoted ? review.upvotes - 1 : review.upvotes + 1,
            hasUpvoted: !review.hasUpvoted 
          }
        : review
    ));
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyLabel = (level: number) => {
    const labels = ['Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'];
    return labels[level - 1] || 'Moderate';
  };

  const getWorkloadLabel = (level: number) => {
    const labels = ['Very Light', 'Light', 'Moderate', 'Heavy', 'Very Heavy'];
    return labels[level - 1] || 'Moderate';
  };

  const getUsefulnessLabel = (level: number) => {
    const labels = ['Not Useful', 'Slightly Useful', 'Moderately Useful', 'Very Useful', 'Extremely Useful'];
    return labels[level - 1] || 'Moderately Useful';
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Reviews</h1>
            <p className="text-lg text-gray-600">
              Share detailed reviews of courses and professors to help fellow students make informed decisions.
            </p>
          </div>
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Write Review
          </button>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => setCurrentView('all-courses')}
            className={`hover:text-blue-600 transition-colors ${currentView === 'all-courses' ? 'text-blue-600 font-medium' : ''}`}
          >
            All Courses
          </button>
          {selectedCourse && (
            <>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => setCurrentView('course-terms')}
                className={`hover:text-blue-600 transition-colors ${currentView === 'course-terms' ? 'text-blue-600 font-medium' : ''}`}
              >
                {selectedCourse.courseCode} - {selectedCourse.courseName}
              </button>
            </>
          )}
          {selectedTerm && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-blue-600 font-medium">
                {selectedTerm.term} {selectedTerm.year} - {selectedTerm.professorName}
              </span>
            </>
          )}
        </nav>

        {/* All Courses View */}
        {currentView === 'all-courses' && (
          <div className="space-y-4">
            {allCoursesWithReviews.map((course) => (
              <div 
                key={course.courseCode}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedCourse(course);
                  setCurrentView('course-terms');
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.courseCode} - {course.courseName}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {course.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>{course.credits} credits</span>
                      <span>{course.department}</span>
                      <span>{course.reviewCount} review{course.reviewCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {course.reviewCount > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Course:</span>
                          {renderStars(Math.round(course.avgCourseRating))}
                          <span className="text-sm text-gray-900 font-medium">
                            {course.avgCourseRating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Professor:</span>
                          {renderStars(Math.round(course.avgProfessorRating))}
                          <span className="text-sm text-gray-900 font-medium">
                            {course.avgProfessorRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No reviews yet</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Terms View */}
        {currentView === 'course-terms' && selectedCourse && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                {selectedCourse.courseCode} - {selectedCourse.courseName}
              </h2>
              <p className="text-blue-700">{selectedCourse.description}</p>
            </div>

            {selectedCourseTerms.length > 0 ? (
              selectedCourseTerms.map((termSummary) => (
                <div 
                  key={`${termSummary.term}-${termSummary.year}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedTerm(termSummary);
                    setCurrentView('detailed-reviews');
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {termSummary.term} {termSummary.year}
                      </h3>
                      <p className="text-gray-600">Professor: {termSummary.professorName}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {termSummary.reviewCount} review{termSummary.reviewCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Course:</span>
                        {renderStars(Math.round(termSummary.avgCourseRating))}
                        <span className="text-sm text-gray-900 font-medium">
                          {termSummary.avgCourseRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Professor:</span>
                        {renderStars(Math.round(termSummary.avgProfessorRating))}
                        <span className="text-sm text-gray-900 font-medium">
                          {termSummary.avgProfessorRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">AI Summary</h4>
                    <p className="text-sm text-gray-700">{termSummary.aiSummary}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No reviews available for this course yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Detailed Reviews View */}
        {currentView === 'detailed-reviews' && selectedTerm && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-1">
                {selectedTerm.courseCode} - {selectedTerm.term} {selectedTerm.year}
              </h2>
              <p className="text-blue-700">Professor: {selectedTerm.professorName}</p>
              <p className="text-sm text-blue-600 mt-2">
                {selectedTerm.reviewCount} detailed review{selectedTerm.reviewCount !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summary</h3>
                  <p className="text-gray-700">{selectedTerm.aiSummary}</p>
                </div>
              </div>
            </div>

            {selectedTermReviews.length > 0 ? (
              selectedTermReviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {review.isAnonymous ? 'Anonymous Student' : review.userName}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{formatDate(review.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpvoteReview(review.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                        review.hasUpvoted 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{review.upvotes}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {/* Course Ratings */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Course Evaluation</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Overall Rating:</span>
                          <div className="flex items-center space-x-2">
                            {renderStars(review.courseRating)}
                            <span className="text-sm font-medium">{review.courseRating}/5</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Difficulty:</span>
                          <span className="text-sm font-medium">{review.courseDifficulty}/5 - {getDifficultyLabel(review.courseDifficulty)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Workload:</span>
                          <span className="text-sm font-medium">{review.courseWorkload}/5 - {getWorkloadLabel(review.courseWorkload)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Usefulness:</span>
                          <span className="text-sm font-medium">{review.courseUsefulness}/5 - {getUsefulnessLabel(review.courseUsefulness)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Professor Ratings */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Professor Evaluation</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Overall Rating:</span>
                          <div className="flex items-center space-x-2">
                            {renderStars(review.professorRating)}
                            <span className="text-sm font-medium">{review.professorRating}/5</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Clarity:</span>
                          <span className="text-sm font-medium">{review.professorClarity}/5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Helpfulness:</span>
                          <span className="text-sm font-medium">{review.professorHelpfulness}/5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Engagement:</span>
                          <span className="text-sm font-medium">{review.professorEngagement}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Review</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                </svg>
                <p>No detailed reviews available for this term yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-6">Write a Detailed Course Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Course
                    </label>
                    <select
                      value={reviewForm.courseCode}
                      onChange={(e) => setReviewForm({...reviewForm, courseCode: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Choose a completed course...</option>
                      {completedCourses.map((course) => (
                        <option key={course.courseCode} value={course.courseCode}>
                          {course.courseCode} - {course.courseName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Professor Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Professor
                    </label>
                    <select
                      value={reviewForm.professorId}
                      onChange={(e) => setReviewForm({...reviewForm, professorId: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Choose professor...</option>
                      {professors.map((professor) => (
                        <option key={professor.id} value={professor.id}>
                          {professor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Term and Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Term
                    </label>
                    <select
                      value={reviewForm.term}
                      onChange={(e) => setReviewForm({...reviewForm, term: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select term...</option>
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      value={reviewForm.year}
                      onChange={(e) => setReviewForm({...reviewForm, year: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {[2024, 2025, 2026, 2027, 2028].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Course Ratings */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Course Evaluation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overall Course Rating
                      </label>
                      <select
                        value={reviewForm.courseRating}
                        onChange={(e) => setReviewForm({...reviewForm, courseRating: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty Level (1-5)
                      </label>
                      <select
                        value={reviewForm.courseDifficulty}
                        onChange={(e) => setReviewForm({...reviewForm, courseDifficulty: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} - {getDifficultyLabel(num)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Workload (1-5)
                      </label>
                      <select
                        value={reviewForm.courseWorkload}
                        onChange={(e) => setReviewForm({...reviewForm, courseWorkload: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} - {getWorkloadLabel(num)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usefulness (1-5)
                      </label>
                      <select
                        value={reviewForm.courseUsefulness}
                        onChange={(e) => setReviewForm({...reviewForm, courseUsefulness: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} - {getUsefulnessLabel(num)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professor Ratings */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Professor Evaluation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overall Professor Rating
                      </label>
                      <select
                        value={reviewForm.professorRating}
                        onChange={(e) => setReviewForm({...reviewForm, professorRating: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clarity (1-5)
                      </label>
                      <select
                        value={reviewForm.professorClarity}
                        onChange={(e) => setReviewForm({...reviewForm, professorClarity: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Helpfulness (1-5)
                      </label>
                      <select
                        value={reviewForm.professorHelpfulness}
                        onChange={(e) => setReviewForm({...reviewForm, professorHelpfulness: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Engagement (1-5)
                      </label>
                      <select
                        value={reviewForm.professorEngagement}
                        onChange={(e) => setReviewForm({...reviewForm, professorEngagement: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Review
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Share your detailed experience with this course and professor. Include information about course content, assignments, exams, teaching style, and any advice for future students..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                    required
                  />
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={reviewForm.isAnonymous}
                    onChange={(e) => setReviewForm({...reviewForm, isAnonymous: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
                    Submit this review anonymously
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
        