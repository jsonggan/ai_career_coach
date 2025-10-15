import { prisma } from './prisma';

// Define types for the course data
export interface Course {
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
}

export interface UserCourse {
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

// Helper function to determine level from course code
function getLevelFromCourseCode(courseCode: string): number {
  if (courseCode.startsWith('10.')) return 1000;
  if (courseCode.startsWith('30.')) return 1000;
  if (courseCode.startsWith('50.00')) return 2000;
  if (courseCode.startsWith('50.0')) return 3000;
  if (courseCode.startsWith('50.7')) return 4000;
  return 3000; // Default
}

// Helper function to determine category from AI tagged skill
function getCategoryFromSkill(skill: string): string {
  if (!skill) return 'Elective';
  
  const skillLower = skill.toLowerCase();
  if (skillLower.includes('core') || skillLower.includes('fundamental')) return 'Core';
  if (skillLower.includes('specialization') || skillLower.includes('specialised')) return 'Specialization';
  return 'Elective';
}

// Helper function to determine term from enrollment date
function getTermFromDate(date: Date): string {
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  if (month >= 1 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 8) return 'Summer';
  return 'Fall';
}

// Helper function to map completion status
function mapCompletionStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'passed':
      return 'COMPLETED';
    case 'in_progress':
    case 'enrolled':
      return 'IN_PROGRESS';
    case 'dropped':
    case 'withdrawn':
      return 'DROPPED';
    default:
      return 'IN_PROGRESS';
  }
}

// Get all courses from database
export async function getAllCourses(): Promise<Course[]> {
  try {
    const courses = await prisma.courses.findMany({
      orderBy: { course_code: 'asc' }
    });

    // Transform the data to match the expected format
    const transformedCourses: Course[] = courses.map(course => ({
      course_id: course.course_id,
      courseCode: course.course_code,
      courseName: course.course_name,
      description: course.course_desc,
      credits: 4, // Default credits
      level: getLevelFromCourseCode(course.course_code),
      prerequisites: [], // Would need separate table for prerequisites
      term: 'Fall', // Default term
      year: 2024, // Default year
      category: getCategoryFromSkill(course.ai_tagged_skill),
      department: 'Computer Science and Design',
      aiTaggedSkill: course.ai_tagged_skill
    }));

    return transformedCourses;
  } catch (error) {
    console.error('Error fetching all courses:', error);
    throw new Error('Failed to fetch courses');
  }
}

// Get user courses with course details
export async function getUserCourses(userId: number = 1): Promise<UserCourse[]> {
  try {
    const userCourses = await prisma.user_courses.findMany({
      where: { user_id: userId },
      include: {
        course: true
      },
      orderBy: { enrollment_date: 'desc' }
    });

    // Transform the data to match the expected format
    const transformedUserCourses: UserCourse[] = userCourses.map(userCourse => ({
      id: userCourse.id,
      courseCode: userCourse.course?.course_code || '',
      courseName: userCourse.course?.course_name || '',
      description: userCourse.course?.course_desc || '',
      enrollmentDate: userCourse.enrollment_date.toISOString(),
      completionStatus: userCourse.completion_status,
      term: getTermFromDate(userCourse.enrollment_date),
      year: userCourse.enrollment_date.getFullYear(),
      status: mapCompletionStatus(userCourse.completion_status),
      grade: null, // Grade not stored in current schema
      credits: 4, // Default credits
      level: getLevelFromCourseCode(userCourse.course?.course_code || ''),
      category: getCategoryFromSkill(userCourse.course?.ai_tagged_skill || ''),
      department: 'Computer Science and Design'
    }));

    return transformedUserCourses;
  } catch (error) {
    console.error('Error fetching user courses:', error);
    throw new Error('Failed to fetch user courses');
  }
}

// Get available courses (courses not taken by user)
export async function getAvailableCourses(userId: number = 1): Promise<Course[]> {
  try {
    const allCourses = await getAllCourses();
    const userCourses = await getUserCourses(userId);
    
    const takenCourseCodes = userCourses.map(uc => uc.courseCode);
    const availableCourses = allCourses.filter(course => 
      !takenCourseCodes.includes(course.courseCode)
    );

    return availableCourses;
  } catch (error) {
    console.error('Error fetching available courses:', error);
    throw new Error('Failed to fetch available courses');
  }
}

// Get mock data for spring 2025
export async function getMockData(): Promise<Course[]> {
  try {
    const mockCourseCodes = [
      '50.006',
      '50.007', 
      '50.017',
      '50.020',
      '50.033',
      '50.035',
      '50.037',
      '50.038',
      '50.039',
      '50.043',
      '50.044'
    ];

    const courses = await prisma.courses.findMany({
      where: {
        course_code: {
          in: mockCourseCodes
        }
      },
      orderBy: { course_code: 'asc' }
    });

    // Transform the data to match the expected format
    const transformedCourses: Course[] = courses.map(course => ({
      course_id: course.course_id,
      courseCode: course.course_code,
      courseName: course.course_name,
      description: course.course_desc,
      credits: 4, // Default credits
      level: getLevelFromCourseCode(course.course_code),
      prerequisites: [], // Would need separate table for prerequisites
      term: 'Fall', // Default term
      year: 2024, // Default year
      category: getCategoryFromSkill(course.ai_tagged_skill),
      department: 'Computer Science and Design',
      aiTaggedSkill: course.ai_tagged_skill
    }));

    return transformedCourses;
  } catch (error) {
    console.error('Error fetching mock courses:', error);
    throw new Error('Failed to fetch mock courses');
  }
}