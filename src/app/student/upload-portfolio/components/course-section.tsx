import { useState } from 'react';
import { UserExternalCourse } from '@/db/portfolio';
import Modal from './modal';
import CourseForm from './course-form';
import AIHelpSection from './ai-help-section';

interface CourseSectionProps {
  courses: UserExternalCourse[];
  onAddCourse: (data: any) => Promise<void>;
  onDeleteCourse: (userExtCourseId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function CourseSection({ 
  courses, 
  onAddCourse, 
  onDeleteCourse, 
  isLoading = false 
}: CourseSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [showAIHelp, setShowAIHelp] = useState(false);

  const handleSubmit = async (data: any) => {
    await onAddCourse(data);
    setShowModal(false);
  };

  const handleDelete = async (userExtCourseId: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await onDeleteCourse(userExtCourseId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">External Courses</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAIHelp(!showAIHelp)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAIHelp ? "Hide AI Help" : "Get AI Help"}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            disabled={isLoading}
          >
            + Add Course
          </button>
        </div>
      </div>

      <AIHelpSection type="courses" isVisible={showAIHelp} />

      {courses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📚</div>
          <p>No courses added yet. Click "Add Course" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course.user_external_course_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{course.external_courses?.external_course_name}</h3>
                <button
                  onClick={() => handleDelete(course.user_external_course_id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">Platform: {course.external_courses?.external_provider}</p>
              <p className="text-sm text-gray-500 mb-2">Completed: {new Date(course.external_course_completion_date).toLocaleDateString()}</p>
              {course.external_courses?.external_course_desc && (
                <p className="text-sm text-gray-700 mb-2">{course.external_courses.external_course_desc}</p>
              )}
              {course.external_courses?.external_ai_tagged_skill && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {course.external_courses.external_ai_tagged_skill.split(',').map((skill, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Course">
        <CourseForm
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
