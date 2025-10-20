import AcademyTrackClient from "./academy-track-client";
import { getAllCourses, getUserCourses, getMockData, Course, UserCourse } from "@/db/courses";
import { getAcademyTrackData } from "@/db/academy";

export default async function AcademyTrack() {
  try {
    const [allCourses, userCourses, mockCourses, academyData] = await Promise.all([
      getAllCourses(),
      getUserCourses(1), // Using user ID 1 for now
      getMockData(),
      getAcademyTrackData(1)
    ]);
    

    return (
      <AcademyTrackClient 
        coursesData={allCourses}
        userCourseHistory={userCourses}
        mockCoursesData={mockCourses}
        academyData={academyData}
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
      />
    );
  }
}
