import { getUserCertificates, getUserExternalCourses, getUserProjects } from "@/db/portfolio";
import UploadPortfolioClient from "./upload-portfolio-client";

export default async function StudentUploadPortfolio() {
  const userId = 1; // Hardcoded as per requirement

  try {
    // Fetch all portfolio data in parallel
    const [certificates, courses, projects] = await Promise.all([
      getUserCertificates(userId),
      getUserExternalCourses(userId),
      getUserProjects(userId)
    ]);

    return (
      <UploadPortfolioClient
        initialCertificates={certificates}
        initialCourses={courses}
        initialProjects={projects}
      />
    );
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    
    // Fallback: render client component with empty data
    return (
      <UploadPortfolioClient
        initialCertificates={[]}
        initialCourses={[]}
        initialProjects={[]}
      />
    );
  }
}