import AcademyTrackClient from "./academy-track-client";
import { getAllCourses, getUserCourses, getMockData, getUserEnrolledCourses, Course, UserCourse } from "@/db/courses";
import { getAcademyTrackData } from "@/db/academy";

export default async function AcademyTrack() {
  try {
    const [allCourses, userCourses, mockCourses, academyData, enrolledCourses] = await Promise.all([
      getAllCourses(),
      getUserCourses(1), // Using user ID 1 for now
      getMockData(),
      getAcademyTrackData(1),
      getUserEnrolledCourses(1, 'Spring', 2025)
    ]);
    

    return (
      <AcademyTrackClient 
        coursesData={allCourses}
        userCourseHistory={userCourses}
        mockCoursesData={mockCourses}
        academyData={academyData}
        defaultSelectedCourses={enrolledCourses}
      />
    );
  } catch (error) {
    console.error('Error loading academy track data:', error);
    
    // Fallback to empty data if database fetch fails
    return (
      <AcademyTrackClient 
        coursesData={[]}
        userCourseHistory={[]}
        mockCoursesData={[]}
        academyData={{
          specializations: [],
          userSpecializations: [],
          careerPaths: [],
          userCareerPaths: []
        }}
        defaultSelectedCourses={[]}
      />
    );
  }
}
