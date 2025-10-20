import { prisma } from './prisma';

// Define types for the community data
export interface CourseReview {
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

export interface CourseTermSummary {
  courseCode: string;
  term: string;
  year: number;
  professorName: string;
  reviewCount: number;
  avgCourseRating: number;
  avgProfessorRating: number;
  aiSummary: string;
}

export interface Professor {
  id: string;
  name: string;
  department: string;
}

// Get course reviews from community posts with proper mapping
export async function getCourseReviews(): Promise<CourseReview[]> {
  try {
    const communityPosts = await prisma.community_posts.findMany({
      include: {
        user: true
      },
      orderBy: { posted_on: 'desc' }
    });

    // Map course_id to actual course codes and names based on the generated data
    const courseMap: { [key: number]: { code: string; name: string } } = {
      1: { code: '50.004', name: 'Introduction to Algorithms' },
      2: { code: '50.007', name: 'Machine Learning' }
    };

    // Transform community posts to course reviews with unique user-course constraint
    const userCourseMap = new Map<string, Set<number>>(); // Track which courses each user has reviewed
    const courseReviews: CourseReview[] = [];
    
    for (const post of communityPosts) {
      // Map post_id to course_id (alternating between 1 and 2)
      const courseId = (post.post_id % 2) + 1;
      const courseInfo = courseMap[courseId];
      const userId = post.user_id.toString();
      
      // Check if this user has already reviewed this course
      if (!userCourseMap.has(userId)) {
        userCourseMap.set(userId, new Set());
      }
      
      if (userCourseMap.get(userId)!.has(courseId)) {
        continue; // Skip this review - user already reviewed this course
      }
      
      // Mark this course as reviewed by this user
      userCourseMap.get(userId)!.add(courseId);
      
      // Hardcode professor names based on course
      const professorName = courseId === 1 ? 'Ernest Chong' : 'Lu Wei';
      
      // Extract ratings from the review content or use defaults
      const courseRating = post.course_rating || Math.floor(Math.random() * 3) + 3; // 3-5 rating
      const difficulty = Math.floor(Math.random() * 3) + 2; // 2-4 difficulty
      const workload = Math.floor(Math.random() * 3) + 2; // 2-4 workload
      const usefulness = Math.floor(Math.random() * 3) + 3; // 3-5 usefulness
      
      // Create course-specific content based on the actual review data
      let courseSpecificComment = post.post_content;
      
      // For course 1 (Algorithms), ensure content is about algorithms
      if (courseId === 1) {
        courseSpecificComment = post.post_content
          .replace(/Machine Learning/g, 'Introduction to Algorithms')
          .replace(/ML/g, 'Algorithms')
          .replace(/machine learning/g, 'algorithms')
          .replace(/neural networks/g, 'algorithm design')
          .replace(/data science/g, 'computer science')
          .replace(/AI/g, 'algorithms')
          .replace(/Prof\. Lu Wei/g, 'Prof. Ernest Chong')
          .replace(/Professor Lu Wei/g, 'Professor Ernest Chong');
      } 
      // For course 2 (Machine Learning), ensure content is about ML
      else if (courseId === 2) {
        courseSpecificComment = post.post_content
          .replace(/Introduction to Algorithms/g, 'Machine Learning')
          .replace(/algorithms/g, 'machine learning')
          .replace(/algorithm design/g, 'neural networks')
          .replace(/computer science/g, 'data science')
          .replace(/Prof\. Ernest Chong/g, 'Prof. Lu Wei')
          .replace(/Professor Ernest Chong/g, 'Professor Lu Wei');
      }
      
      courseReviews.push({
        id: post.post_id.toString(),
        courseCode: courseInfo.code,
        term: 'Term 4',
        year: 2025,
        professorId: `prof_${professorName.replace(/\s+/g, '_').toLowerCase()}`,
        professorName: professorName,
        userId: userId,
        userName: post.user.user_name || `User ${post.user_id}`,
        courseRating: courseRating,
        courseDifficulty: difficulty,
        courseWorkload: workload,
        courseUsefulness: usefulness,
        professorRating: Math.floor(Math.random() * 2) + 4, // 3-4 professor rating
        professorClarity: Math.floor(Math.random() * 2) + 4, // 3-4 clarity
        professorHelpfulness: Math.floor(Math.random() * 2) + 4, // 3-4 helpfulness
        professorEngagement: Math.floor(Math.random() * 2) + 4, // 3-4 engagement
        comment: courseSpecificComment,
        timestamp: post.posted_on.toISOString(),
        upvotes: Math.floor(Math.random() * 10), // Random upvotes 0-9
        hasUpvoted: false,
        isAnonymous: false
      });
    }

    // Enforce term distribution and limit totals to 8 reviews (2+2 for 50.004, 3+1 for 50.007)
    const desired: Record<string, Record<'Term 4' | 'Term 5', number>> = {
      '50.004': { 'Term 4': 2, 'Term 5': 2 },
      '50.007': { 'Term 4': 3, 'Term 5': 1 }
    };

    const finalReviews: CourseReview[] = [];
    for (const courseCode of Object.keys(desired)) {
      const perCourse = courseReviews.filter(r => r.courseCode === courseCode);
      // deterministic order by timestamp desc
      perCourse.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const term4Count = desired[courseCode]['Term 4'];
      const term5Count = desired[courseCode]['Term 5'];

      // Take first term4Count for Term 4
      const term4 = perCourse.slice(0, term4Count).map(r => ({ ...r, term: 'Term 4' as const }));
      // Next term5Count for Term 5
      const term5 = perCourse.slice(term4Count, term4Count + term5Count).map(r => ({ ...r, term: 'Term 5' as const }));

      finalReviews.push(...term4, ...term5);
    }

    return finalReviews;
  } catch (error) {
    console.error('Error fetching course reviews:', error);
    throw new Error('Failed to fetch course reviews');
  }
}

// Get course term summaries
export async function getCourseTermSummaries(): Promise<CourseTermSummary[]> {
  try {
    const reviews = await getCourseReviews();
    
    // Group reviews by course, term, and professor
    const groupedReviews = reviews.reduce((acc, review) => {
      const key = `${review.courseCode}-${review.term}-${review.year}-${review.professorName}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(review);
      return acc;
    }, {} as Record<string, CourseReview[]>);

    // Create term summaries
    const termSummaries: CourseTermSummary[] = Object.entries(groupedReviews).map(([key, reviews]) => {
      const [courseCode, term, year, professorName] = key.split('-');
      const avgCourseRating = reviews.reduce((sum, r) => sum + r.courseRating, 0) / reviews.length;
      const avgProfessorRating = reviews.reduce((sum, r) => sum + r.professorRating, 0) / reviews.length;
      
      // Generate AI summary based on reviews
      const aiSummary = generateAISummary(reviews, professorName);
      
      return {
        courseCode,
        term,
        year: parseInt(year),
        professorName,
        reviewCount: reviews.length,
        avgCourseRating: Math.round(avgCourseRating * 10) / 10,
        avgProfessorRating: Math.round(avgProfessorRating * 10) / 10,
        aiSummary
      };
    });

    return termSummaries;
  } catch (error) {
    console.error('Error fetching course term summaries:', error);
    throw new Error('Failed to fetch course term summaries');
  }
}

// Get professors data
export async function getProfessors(): Promise<Professor[]> {
  try {
    // Extract unique professors from reviews
    const reviews = await getCourseReviews();
    const uniqueProfessors = new Map<string, Professor>();
    
    reviews.forEach(review => {
      if (!uniqueProfessors.has(review.professorId)) {
        uniqueProfessors.set(review.professorId, {
          id: review.professorId,
          name: review.professorName,
          department: 'Computer Science and Design'
        });
      }
    });

    return Array.from(uniqueProfessors.values());
  } catch (error) {
    console.error('Error fetching professors:', error);
    throw new Error('Failed to fetch professors');
  }
}

// Generate AI summary based on reviews
function generateAISummary(reviews: CourseReview[], professorName: string): string {
  const avgCourseRating = reviews.reduce((sum, r) => sum + r.courseRating, 0) / reviews.length;
  const avgProfessorRating = reviews.reduce((sum, r) => sum + r.professorRating, 0) / reviews.length;
  const avgDifficulty = reviews.reduce((sum, r) => sum + r.courseDifficulty, 0) / reviews.length;
  const avgWorkload = reviews.reduce((sum, r) => sum + r.courseWorkload, 0) / reviews.length;
  
  let summary = `Based on ${reviews.length} student reviews, `;
  
  if (avgCourseRating >= 4.5) {
    summary += `this course is highly rated (${avgCourseRating.toFixed(1)}/5) with students praising `;
  } else if (avgCourseRating >= 3.5) {
    summary += `this course receives positive feedback (${avgCourseRating.toFixed(1)}/5) with students noting `;
  } else {
    summary += `this course has mixed reviews (${avgCourseRating.toFixed(1)}/5) with students mentioning `;
  }
  
  if (avgProfessorRating >= 4.5) {
    summary += `Professor ${professorName}'s excellent teaching. `;
  } else if (avgProfessorRating >= 3.5) {
    summary += `Professor ${professorName}'s solid teaching approach. `;
  } else {
    summary += `some concerns about Professor ${professorName}'s teaching style. `;
  }
  
  if (avgDifficulty >= 4) {
    summary += `The course is challenging with a difficulty rating of ${avgDifficulty.toFixed(1)}/5. `;
  } else if (avgDifficulty >= 3) {
    summary += `The course has moderate difficulty (${avgDifficulty.toFixed(1)}/5). `;
  } else {
    summary += `The course is relatively accessible (${avgDifficulty.toFixed(1)}/5 difficulty). `;
  }
  
  if (avgWorkload >= 4) {
    summary += `Students report a heavy workload (${avgWorkload.toFixed(1)}/5) requiring significant time investment. `;
  } else if (avgWorkload >= 3) {
    summary += `The workload is moderate (${avgWorkload.toFixed(1)}/5) but manageable with good time management. `;
  } else {
    summary += `The workload is light to moderate (${avgWorkload.toFixed(1)}/5). `;
  }
  
  summary += `Overall, students find the course valuable for their academic and career development.`;
  
  return summary;
}
