import CommunityClient from "./community-client";
import { getAllCourses, getUserCourses } from "@/db/courses";
import { getCourseReviews, getCourseTermSummaries, getProfessors } from "@/db/community";

export default async function StudentCommunity() {
  try {
    const [allCourses, userCourses, courseReviews, courseTermSummaries, professors] = await Promise.all([
      getAllCourses(),
      getUserCourses(1), // Using user ID 1 for now
      getCourseReviews(),
      getCourseTermSummaries(),
      getProfessors()
    ]);

    // Filter to only show courses with codes 50.004 and 50.007 (Introduction to Algorithms and Machine Learning)
    const filteredCourses = allCourses.filter(course => 
      course.courseCode === '50.004' || course.courseCode === '50.007'
    );

    // Use all reviews (now limited to 1 review per user per course = 8 total)
    const filteredReviews = courseReviews;

    // Recompute term summaries counts based on filtered reviews
    const termKey = (t: {courseCode: string; term: string; year: number; professorName: string}) => `${t.courseCode}-${t.term}-${t.year}-${t.professorName}`;
    const filteredCounts = filteredReviews.reduce((acc, r) => {
      const key = termKey({ courseCode: r.courseCode, term: r.term, year: r.year, professorName: r.professorName });
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const adjustedTermSummaries = courseTermSummaries
      .filter(ts => ts.courseCode === '50.004' || ts.courseCode === '50.007')
      .map(ts => {
        const key = termKey(ts);
        const reviewCount = filteredCounts[key] ?? 0;
        return { ...ts, reviewCount };
      })
      .filter(ts => ts.reviewCount > 0);

    return (
      <CommunityClient 
        courses={filteredCourses}
        userCourses={userCourses}
        courseReviews={filteredReviews}
        courseTermSummaries={adjustedTermSummaries}
        professors={professors}
      />
    );
  } catch (error) {
    console.error('Error loading community data:', error);
    
    // Fallback to empty data if database fetch fails
  return (
    <CommunityClient 
        courses={[]}
        userCourses={[]}
        courseReviews={[]}
        courseTermSummaries={[]}
        professors={[]}
      />
    );
  }
}
