import { prisma } from './prisma';

// Types for portfolio items
export interface UserCertificate {
  user_cert_id: number;
  user_id: number;
  cert_id: number;
  date_obtained: Date;
  certificate?: {
    cert_name: string;
    cert_provider: string;
    cert_level: string;
    cert_category: string;
  };
}

export interface UserExternalCourse {
  user_external_course_id: number;
  user_id: number;
  external_course_id: number;
  external_course_completion_date: Date;
  external_courses?: {
    external_course_name: string;
    external_provider: string;
    external_course_desc: string;
    external_ai_tagged_skill: string;
  };
}

export interface UserProject {
  project_id: number;
  project_title: string;
  project_desc: string;
  difficulty_level: string;
  estimated_time: string;
  // Additional fields for user-added projects
  project_type?: string;
  technologies?: string;
  skills?: string;
  project_date?: Date;
  project_link?: string;
}

// Certificate operations
export async function getUserCertificates(userId: number = 1): Promise<UserCertificate[]> {
  try {
    const userCertificates = await prisma.user_certificates.findMany({
      where: { user_id: userId },
      include: {
        certificate: true
      },
      orderBy: { date_obtained: 'desc' }
    });

    return userCertificates.map(uc => ({
      user_cert_id: uc.user_cert_id,
      user_id: uc.user_id,
      cert_id: uc.cert_id,
      date_obtained: uc.date_obtained,
      certificate: uc.certificate ? {
        cert_name: uc.certificate.cert_name,
        cert_provider: uc.certificate.cert_provider,
        cert_level: uc.certificate.cert_level,
        cert_category: uc.certificate.cert_category
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    throw new Error('Failed to fetch user certificates');
  }
}

export async function addUserCertificate(data: {
  userId: number;
  certName: string;
  certProvider: string;
  dateObtained: string;
  expiryDate?: string;
}): Promise<UserCertificate> {
  try {
    // First, create or find the certificate
    let certificate = await prisma.certificates.findFirst({
      where: {
        cert_name: data.certName,
        cert_provider: data.certProvider
      }
    });

    if (!certificate) {
      // Create new certificate
      const maxId = await prisma.certificates.aggregate({
        _max: { cert_id: true }
      });
      const newCertId = (maxId._max.cert_id || 0) + 1;

      certificate = await prisma.certificates.create({
        data: {
          cert_id: newCertId,
          cert_name: data.certName,
          cert_provider: data.certProvider,
          cert_level: 'Professional', // Default level
          cert_category: 'Technology', // Default category
          is_added_by_user: true
        }
      });
    }

    // Get max user_cert_id
    const maxUserCertId = await prisma.user_certificates.aggregate({
      _max: { user_cert_id: true }
    });
    const newUserCertId = (maxUserCertId._max.user_cert_id || 0) + 1;

    // Create user certificate record
    const userCertificate = await prisma.user_certificates.create({
      data: {
        user_cert_id: newUserCertId,
        user_id: data.userId,
        cert_id: certificate.cert_id,
        date_obtained: new Date(data.dateObtained)
      },
      include: {
        certificate: true
      }
    });

    return {
      user_cert_id: userCertificate.user_cert_id,
      user_id: userCertificate.user_id,
      cert_id: userCertificate.cert_id,
      date_obtained: userCertificate.date_obtained,
      certificate: userCertificate.certificate ? {
        cert_name: userCertificate.certificate.cert_name,
        cert_provider: userCertificate.certificate.cert_provider,
        cert_level: userCertificate.certificate.cert_level,
        cert_category: userCertificate.certificate.cert_category
      } : undefined
    };
  } catch (error) {
    console.error('Error adding user certificate:', error);
    throw new Error('Failed to add user certificate');
  }
}

export async function deleteUserCertificate(userId: number, userCertId: number): Promise<void> {
  try {
    await prisma.user_certificates.delete({
      where: {
        user_cert_id: userCertId,
        user_id: userId
      }
    });
  } catch (error) {
    console.error('Error deleting user certificate:', error);
    throw new Error('Failed to delete user certificate');
  }
}

// External course operations
export async function getUserExternalCourses(userId: number = 1): Promise<UserExternalCourse[]> {
  try {
    const userExternalCourses = await prisma.user_external_courses.findMany({
      where: { user_id: userId },
      include: {
        external_courses: true
      },
      orderBy: { external_course_completion_date: 'desc' }
    });

    return userExternalCourses.map(uec => ({
      user_external_course_id: uec.user_external_course_id,
      user_id: uec.user_id,
      external_course_id: uec.external_course_id,
      external_course_completion_date: uec.external_course_completion_date,
      external_courses: uec.external_courses ? {
        external_course_name: uec.external_courses.external_course_name,
        external_provider: uec.external_courses.external_provider,
        external_course_desc: uec.external_courses.external_course_desc,
        external_ai_tagged_skill: uec.external_courses.external_ai_tagged_skill
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching user external courses:', error);
    throw new Error('Failed to fetch user external courses');
  }
}

export async function addUserExternalCourse(data: {
  userId: number;
  courseName: string;
  platform: string;
  description: string;
  skills: string;
  completionDate: string;
  duration?: string;
}): Promise<UserExternalCourse> {
  try {
    // First, create or find the external course
    let externalCourse = await prisma.external_courses.findFirst({
      where: {
        external_course_name: data.courseName,
        external_provider: data.platform
      }
    });

    if (!externalCourse) {
      // Create new external course
      const maxId = await prisma.external_courses.aggregate({
        _max: { external_course_id: true }
      });
      const newExternalCourseId = (maxId._max.external_course_id || 0) + 1;

      externalCourse = await prisma.external_courses.create({
        data: {
          external_course_id: newExternalCourseId,
          external_course_name: data.courseName,
          external_provider: data.platform,
          external_course_desc: data.description,
          external_ai_tagged_skill: data.skills,
          is_added_by_user: true
        }
      });
    }

    // Get max user_external_course_id
    const maxUserExtCourseId = await prisma.user_external_courses.aggregate({
      _max: { user_external_course_id: true }
    });
    const newUserExtCourseId = (maxUserExtCourseId._max.user_external_course_id || 0) + 1;

    // Create user external course record
    const userExternalCourse = await prisma.user_external_courses.create({
      data: {
        user_external_course_id: newUserExtCourseId,
        user_id: data.userId,
        external_course_id: externalCourse.external_course_id,
        external_course_completion_date: new Date(data.completionDate)
      },
      include: {
        external_courses: true
      }
    });

    return {
      user_external_course_id: userExternalCourse.user_external_course_id,
      user_id: userExternalCourse.user_id,
      external_course_id: userExternalCourse.external_course_id,
      external_course_completion_date: userExternalCourse.external_course_completion_date,
      external_courses: userExternalCourse.external_courses ? {
        external_course_name: userExternalCourse.external_courses.external_course_name,
        external_provider: userExternalCourse.external_courses.external_provider,
        external_course_desc: userExternalCourse.external_courses.external_course_desc,
        external_ai_tagged_skill: userExternalCourse.external_courses.external_ai_tagged_skill
      } : undefined
    };
  } catch (error) {
    console.error('Error adding user external course:', error);
    throw new Error('Failed to add user external course');
  }
}

export async function deleteUserExternalCourse(userId: number, userExtCourseId: number): Promise<void> {
  try {
    await prisma.user_external_courses.delete({
      where: {
        user_external_course_id: userExtCourseId,
        user_id: userId
      }
    });
  } catch (error) {
    console.error('Error deleting user external course:', error);
    throw new Error('Failed to delete user external course');
  }
}

// Project operations (Note: Projects table doesn't have user-specific fields, so we'll need to work with the existing structure)
export async function getUserProjects(userId: number = 1): Promise<UserProject[]> {
  try {
    // Get projects associated with the user through the many-to-many relationship
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      include: {
        projects: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.projects.map(project => ({
      project_id: project.project_id,
      project_title: project.project_title,
      project_desc: project.project_desc,
      difficulty_level: project.difficulty_level,
      estimated_time: project.estimated_time
    }));
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw new Error('Failed to fetch user projects');
  }
}

export async function addUserProject(data: {
  userId: number;
  projectName: string;
  projectType: string;
  description: string;
  technologies: string;
  skills: string;
  date: string;
  link?: string;
}): Promise<UserProject> {
  try {
    // Get max project_id
    const maxProjectId = await prisma.projects.aggregate({
      _max: { project_id: true }
    });
    const newProjectId = (maxProjectId._max.project_id || 0) + 1;

    // Create new project
    const project = await prisma.projects.create({
      data: {
        project_id: newProjectId,
        project_title: data.projectName,
        project_desc: data.description,
        difficulty_level: 'Intermediate', // Default difficulty
        estimated_time: '4-6 weeks' // Default time estimate
      }
    });

    // Connect project to user (Note: This creates the many-to-many relationship)
    await prisma.users.update({
      where: { user_id: data.userId },
      data: {
        projects: {
          connect: { project_id: project.project_id }
        }
      }
    });

    return {
      project_id: project.project_id,
      project_title: project.project_title,
      project_desc: project.project_desc,
      difficulty_level: project.difficulty_level,
      estimated_time: project.estimated_time,
      project_type: data.projectType,
      technologies: data.technologies,
      skills: data.skills,
      project_date: new Date(data.date),
      project_link: data.link
    };
  } catch (error) {
    console.error('Error adding user project:', error);
    throw new Error('Failed to add user project');
  }
}

export async function deleteUserProject(userId: number, projectId: number): Promise<void> {
  try {
    // Disconnect project from user
    await prisma.users.update({
      where: { user_id: userId },
      data: {
        projects: {
          disconnect: { project_id: projectId }
        }
      }
    });

    // Optionally, delete the project if it's not connected to any other users
    // For now, we'll just disconnect it
  } catch (error) {
    console.error('Error deleting user project:', error);
    throw new Error('Failed to delete user project');
  }
}
