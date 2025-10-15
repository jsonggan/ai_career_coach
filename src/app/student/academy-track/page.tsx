import AcademyTrackClient from "./academy-track-client";
import { getAllCourses, getUserCourses, getMockData, Course, UserCourse } from "@/db/courses";

export default async function AcademyTrack() {
  try {
    const [allCourses, userCourses, mockCourses] = await Promise.all([
      getAllCourses(),
      getUserCourses(1), // Using user ID 1 for now
      getMockData()
    ]);
    

    return (
      <AcademyTrackClient 
        coursesData={allCourses}
        userCourseHistory={userCourses}
        mockCoursesData={mockCourses}
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
      />
    );
  }
}
