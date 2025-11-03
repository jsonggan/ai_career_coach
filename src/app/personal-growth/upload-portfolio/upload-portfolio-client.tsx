"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { UserCertificate, UserExternalCourse, UserProject } from '@/db/portfolio';
import CertificateSection from './components/certificate-section';
import CourseSection from './components/course-section';
import ProjectSection from './components/project-section';

interface UploadPortfolioClientProps {
  initialCertificates?: UserCertificate[];
  initialCourses?: UserExternalCourse[];
  initialProjects?: UserProject[];
}

export default function UploadPortfolioClient({ 
  initialCertificates = [], 
  initialCourses = [], 
  initialProjects = [] 
}: UploadPortfolioClientProps) {
  const [certificates, setCertificates] = useState<UserCertificate[]>(initialCertificates);
  const [courses, setCourses] = useState<UserExternalCourse[]>(initialCourses);
  const [projects, setProjects] = useState<UserProject[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(false);
  
  const userId = 1; // Hardcoded as per requirement

  // Certificate handlers
  const handleAddCertificate = async (data: {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/upload-portfolio/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certName: data.name,
          certProvider: data.issuer,
          dateObtained: data.issueDate,
          expiryDate: data.expiryDate,
          userId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add certificate');
      }

      // Convert date string to Date object for consistency
      const certificateWithDate = {
        ...result.data,
        date_obtained: new Date(result.data.date_obtained)
      };
      setCertificates(prev => [certificateWithDate, ...prev]);
      toast.success('Certificate added successfully!');
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCertificate = async (userCertId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/upload-portfolio/certificate', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userCertId,
          userId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete certificate');
      }

      setCertificates(prev => prev.filter(cert => cert.user_cert_id !== userCertId));
      toast.success('Certificate deleted successfully!');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete certificate');
    } finally {
      setIsLoading(false);
    }
  };

  // Course handlers
  const handleAddCourse = async (data: {
    name: string;
    platform: string;
    duration?: string;
    description: string;
    skills: string;
    completionDate: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/upload-portfolio/external-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: data.name,
          platform: data.platform,
          description: data.description,
          skills: data.skills,
          completionDate: data.completionDate,
          duration: data.duration,
          userId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add course');
      }

      // Convert date string to Date object for consistency
      const courseWithDate = {
        ...result.data,
        external_course_completion_date: new Date(result.data.external_course_completion_date)
      };
      setCourses(prev => [courseWithDate, ...prev]);
      toast.success('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (userExtCourseId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/upload-portfolio/external-courses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userExtCourseId,
          userId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete course');
      }

      setCourses(prev => prev.filter(course => course.user_external_course_id !== userExtCourseId));
      toast.success('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete course');
    } finally {
      setIsLoading(false);
    }
  };

  // Project handlers
  const handleAddProject = async (data: {
    name: string;
    type: string;
    description: string;
    technologies: string;
    skills: string;
    date: string;
    link?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/upload-portfolio/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: data.name,
          projectType: data.type,
          description: data.description,
          technologies: data.technologies,
          skills: data.skills,
          date: data.date,
          link: data.link || '',
          userId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add project');
      }

      // Convert date string to Date object for consistency
      const projectWithDate = {
        ...result.data,
        project_date: result.data.project_date ? new Date(result.data.project_date) : undefined
      };
      setProjects(prev => [projectWithDate, ...prev]);
      toast.success('Project added successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/upload-portfolio/project', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          userId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete project');
      }

      setProjects(prev => prev.filter(project => project.project_id !== projectId));
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Portfolio</h1>
          <p className="text-lg text-gray-600 mb-4">
            Upload your certificates, courses, and projects to showcase your academic achievements and skills.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-lg">🤖</div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">AI Integration Notice</h3>
                <p className="text-blue-700 text-sm">
                  All the information you add here will be analyzed by our AI system to automatically update your 
                  <strong> Skill Competency</strong> tracking and customize your <strong>Study Plan</strong>. 
                  The AI will identify skills, suggest learning paths, and recommend relevant courses based on your portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>

        <CertificateSection
          certificates={certificates}
          onAddCertificate={handleAddCertificate}
          onDeleteCertificate={handleDeleteCertificate}
          isLoading={isLoading}
        />

        <CourseSection
          courses={courses}
          onAddCourse={handleAddCourse}
          onDeleteCourse={handleDeleteCourse}
          isLoading={isLoading}
        />

        <ProjectSection
          projects={projects}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}