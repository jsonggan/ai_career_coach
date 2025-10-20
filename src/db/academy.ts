import { prisma } from './prisma';

// Types for specializations and career paths
export interface Specialization {
  spec_id: number;
  spec_name: string;
  spec_desc: string;
  icon?: string;
}

export interface CareerPath {
  career_id: number;
  career_title: string;
  career_desc: string;
  icon?: string;
}

export interface UserSpecialization {
  user_id: number;
  spec_id: number;
  added_date: Date;
  specialization?: Specialization;
}

export interface UserCareerPath {
  user_id: number;
  career_id: number;
  career_path?: CareerPath;
}

// Specialization operations
export async function getAllSpecializations(): Promise<Specialization[]> {
  try {
    const specializations = await prisma.specialization.findMany({
      orderBy: { spec_name: 'asc' }
    });

    return specializations.map(spec => ({
      spec_id: spec.spec_id,
      spec_name: spec.spec_name,
      spec_desc: spec.spec_desc,
      icon: spec.icon || undefined
    }));
  } catch (error) {
    console.error('Error fetching specializations:', error);
    throw new Error('Failed to fetch specializations');
  }
}

export async function getUserSpecializations(userId: number = 1): Promise<UserSpecialization[]> {
  try {
    const userSpecializations = await prisma.users_specialization.findMany({
      where: { user_id: userId },
      include: {
        specialization: true
      },
      orderBy: { added_date: 'desc' }
    });

    return userSpecializations.map(us => ({
      user_id: us.user_id,
      spec_id: us.spec_id,
      added_date: us.added_date,
      specialization: us.specialization ? {
        spec_id: us.specialization.spec_id,
        spec_name: us.specialization.spec_name,
        spec_desc: us.specialization.spec_desc,
        icon: us.specialization.icon || undefined
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching user specializations:', error);
    throw new Error('Failed to fetch user specializations');
  }
}

// Career path operations
export async function getAllCareerPaths(): Promise<CareerPath[]> {
  try {
    const careerPaths = await prisma.career_paths.findMany({
      orderBy: { career_title: 'asc' }
    });

    return careerPaths.map(career => ({
      career_id: career.career_id,
      career_title: career.career_title,
      career_desc: career.career_desc,
      icon: career.icon || undefined
    }));
  } catch (error) {
    console.error('Error fetching career paths:', error);
    throw new Error('Failed to fetch career paths');
  }
}

export async function getUserCareerPaths(userId: number = 1): Promise<UserCareerPath[]> {
  try {
    const userCareerPaths = await prisma.user_career_paths.findMany({
      where: { user_id: userId },
      include: {
        career_path: true
      }
    });

    return userCareerPaths.map(ucp => ({
      user_id: ucp.user_id,
      career_id: ucp.career_id,
      career_path: ucp.career_path ? {
        career_id: ucp.career_path.career_id,
        career_title: ucp.career_path.career_title,
        career_desc: ucp.career_path.career_desc,
        icon: ucp.career_path.icon || undefined
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching user career paths:', error);
    throw new Error('Failed to fetch user career paths');
  }
}

// Combined data fetching for academy track
export async function getAcademyTrackData(userId: number = 1) {
  try {
    const [specializations, userSpecializations, careerPaths, userCareerPaths] = await Promise.all([
      getAllSpecializations(),
      getUserSpecializations(userId),
      getAllCareerPaths(),
      getUserCareerPaths(userId)
    ]);

    return {
      specializations,
      userSpecializations,
      careerPaths,
      userCareerPaths
    };
  } catch (error) {
    console.error('Error fetching academy track data:', error);
    throw new Error('Failed to fetch academy track data');
  }
}
