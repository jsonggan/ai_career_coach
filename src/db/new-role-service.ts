import { prisma } from './prisma'

export interface RoleData {
  id: string;
  title: string;
  candidates: number;
  active: boolean;
  year: number;
  department?: string;
  description?: string;
  skills?: string[];
  yearOfExperience?: string;
}

export interface RoleApplicationData {
  id: string;
  name: string;
  impactCommunication: number;
  skillRecency: number;
  yearsRelevantExp: number;
  totalExp: number;
  reviewer: string;
  status: string;
  overallRating?: number;
  aiSummary?: string;
  reviewerComment?: string;
}

export interface EvaluationQuestion {
  id: string;
  question: string;
  status: "NOT_IN_RESUME" | "IN_RESUME" | "PENDING";
  answer?: string;
  summary?: string;
}

export interface RoleQuestion {
  id: string;
  question: string;
  status: "NOT_IN_RESUME" | "IN_RESUME" | "PENDING";
  summary: string;
}

export interface EvaluationSection {
  id: string;
  title: string;
  questions: EvaluationQuestion[];
}

export interface CandidateEvaluationData {
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  evaluationSections: EvaluationSection[];
  roleQuestions: RoleQuestion[];
  applicationData: {
    overallRating: number;
    aiSummary: string;
    reviewerComment: string;
    impactCommunication: number;
    skillRecency: number;
    yearsRelevantExp: number;
    totalExp: number;
    status: string;
  };
  documents?: Array<{
    userDocumentId: string;
    filename: string;
    mimeType: string | null;
    createdAt: Date;
  }>;
}

export const roleService = {
  async getAllRoles() {
    try {
      const roles = await prisma.newRole.findMany({
        include: {
          _count: {
            select: {
              userNewRoles: true
            }
          }
        },
        orderBy: {
          roleName: 'asc'
        }
      })

      return roles.map(role => ({
        id: role.newRoleId.toString(),
        title: role.roleName,
        candidates: role._count.userNewRoles,
        active: true, // You can add an active field to the schema later if needed
        year: new Date(role.createdAt).getFullYear(),
        department: role.department || undefined,
        description: role.descriptionAi,
        skills: role.skill,
        yearOfExperience: role.yearOfExperience
      }))
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw new Error('Failed to fetch roles')
    }
  },

  async getRoleById(roleId: string) {
    try {
      const role = await prisma.newRole.findUnique({
        where: {
          newRoleId: parseInt(roleId)
        },
        include: {
          _count: {
            select: {
              userNewRoles: true
            }
          }
        }
      })

      if (!role) {
        return null
      }

      return {
        id: role.newRoleId.toString(),
        title: role.roleName,
        candidates: role._count.userNewRoles,
        active: true,
        year: new Date(role.createdAt).getFullYear(),
        department: role.department || undefined,
        description: role.descriptionAi,
        skills: role.skill,
        yearOfExperience: role.yearOfExperience
      }
    } catch (error) {
      console.error('Error fetching role by ID:', error)
      throw new Error('Failed to fetch role')
    }
  },

  async getRolesByYear(year: number) {
    try {
      const startOfYear = new Date(year, 0, 1)
      const endOfYear = new Date(year + 1, 0, 1)

      const roles = await prisma.newRole.findMany({
        where: {
          createdAt: {
            gte: startOfYear,
            lt: endOfYear
          }
        },
        include: {
          _count: {
            select: {
              userNewRoles: true
            }
          }
        },
        orderBy: {
          roleName: 'asc'
        }
      })

      return roles.map(role => ({
        id: role.newRoleId.toString(),
        title: role.roleName,
        candidates: role._count.userNewRoles,
        active: true,
        year: new Date(role.createdAt).getFullYear(),
        department: role.department || undefined,
        description: role.descriptionAi,
        skills: role.skill,
        yearOfExperience: role.yearOfExperience
      }))
    } catch (error) {
      console.error('Error fetching roles by year:', error)
      throw new Error('Failed to fetch roles')
    }
  },

  async getRoleStats() {
    try {
      const stats = await prisma.newRole.aggregate({
        _count: {
          newRoleId: true
        }
      })

      const userNewRoleStats = await prisma.userNewRole.aggregate({
        _count: {
          userNewRoleId: true
        }
      })

      return {
        totalRoles: stats._count.newRoleId,
        totalCandidates: userNewRoleStats._count.userNewRoleId
      }
    } catch (error) {
      console.error('Error fetching role stats:', error)
      throw new Error('Failed to fetch role stats')
    }
  },

  async getRoleApplications(roleId: string) {
    try {
      const applications = await prisma.userNewRole.findMany({
        where: {
          newRoleId: parseInt(roleId)
        },
        include: {
          user: {
            select: {
              name: true,
              rank: true,
              userId: true
            }
          }
        },
        orderBy: {
          overallRating: 'desc'
        }
      })

      // Get reviewer information for applications that have reviewerCommentId
      const applicationsWithReviewers = await Promise.all(
        applications.map(async (app) => {
          let reviewerName = "-";

          if (app.reviewerCommentId) {
            try {
              const reviewer = await prisma.user.findUnique({
                where: {
                  userId: app.reviewerCommentId
                },
                select: {
                  name: true,
                  rank: true
                }
              });

              if (reviewer) {
                reviewerName = reviewer.rank ? `${reviewer.rank} ${reviewer.name}` : reviewer.name;
              }
            } catch (error) {
              console.warn('Failed to fetch reviewer for application:', app.userNewRoleId, error);
            }
          }

          return {
            id: app.userNewRoleId.toString(),
            name: app.user.rank ? `${app.user.rank} ${app.user.name}` : app.user.name,
            impactCommunication: app.impactCommunication / 100, // Convert to decimal
            skillRecency: app.skillRecency / 100, // Convert to decimal  
            yearsRelevantExp: app.yearsOfRelevantExperience,
            totalExp: app.totalExperience,
            reviewer: reviewerName,
            status: app.status,
            overallRating: app.overallRating,
            aiSummary: app.aiSummary,
            reviewerComment: app.reviewerComment
          };
        })
      );

      return applicationsWithReviewers;
    } catch (error) {
      console.error('Error fetching role applications:', error)
      throw new Error('Failed to fetch role applications')
    }
  },

  // async getRoleApplication(roleId: string, applicationId: string) {
  //   try {
  //     const application = await prisma.userNewRole.findFirst({
  //       where: {
  //         newRoleId: parseInt(roleId),
  //         userNewRoleId: parseInt(applicationId)
  //       },
  //       include: {
  //         user: {
  //           select: {
  //             name: true,
  //             rank: true,
  //             userId: true,
  //             jobRole: true
  //           }
  //         },
  //         newRole: {
  //           select: {
  //             roleName: true,
  //             descriptionAi: true,
  //             skill: true,
  //             yearOfExperience: true
  //           }
  //         },
  //         reviewerCommentDoc: {
  //           select: {
  //             filename: true,
  //             extractedContent: true
  //           }
  //         }
  //       }
  //     })

  //     if (!application) {
  //       return null
  //     }

  //     // Get reviewer information if reviewerCommentId exists
  //     let reviewerName = "-";
  //     if (application.reviewerCommentId) {
  //       try {
  //         const reviewer = await prisma.user.findUnique({
  //           where: {
  //             userId: application.reviewerCommentId
  //           },
  //           select: {
  //             name: true,
  //             rank: true
  //           }
  //         });

  //         if (reviewer) {
  //           reviewerName = reviewer.rank ? `${reviewer.rank} ${reviewer.name}` : reviewer.name;
  //         }
  //       } catch (error) {
  //         console.warn('Failed to fetch reviewer for application:', application.userNewRoleId, error);
  //       }
  //     }

  //     return {
  //       id: application.userNewRoleId.toString(),
  //       name: application.user.rank ? `${application.user.rank} ${application.user.name}` : application.user.name,
  //       impactCommunication: application.impactCommunication / 100,
  //       skillRecency: application.skillRecency / 100,
  //       yearsRelevantExp: application.yearsOfRelevantExperience,
  //       totalExp: application.totalExperience,
  //       reviewer: reviewerName,
  //       status: application.status,
  //       overallRating: application.overallRating,
  //       aiSummary: application.aiSummary,
  //       reviewerComment: application.reviewerComment,
  //       user: {
  //         userId: application.user.userId,
  //         name: application.user.name,
  //         rank: application.user.rank,
  //         jobRole: application.user.jobRole
  //       },
  //       role: {
  //         roleName: application.newRole.roleName,
  //         description: application.newRole.descriptionAi,
  //         skills: application.newRole.skill,
  //         yearOfExperience: application.newRole.yearOfExperience
  //       },
  //       document: application.reviewerCommentDoc ? {
  //         filename: application.reviewerCommentDoc.filename,
  //         content: application.reviewerCommentDoc.extractedContent
  //       } : null
  //     }
  //   } catch (error) {
  //     console.error('Error fetching role application:', error)
  //     throw new Error('Failed to fetch role application')
  //   }
  // },

  async getUserDocuments(userId: string) {
    try {
      const documents = await prisma.userDocument.findMany({
        where: {
          userId: userId
        },
        select: {
          userDocumentId: true,
          filename: true,
          mimeType: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return documents;
    } catch (error) {
      console.error('Error fetching user documents:', error);
      throw new Error('Failed to fetch user documents');
    }
  },

  async getCandidateEvaluationData(roleId: string, userNewRoleId: string): Promise<CandidateEvaluationData | null> {
    try {
      // First, get the user_new_role record with basic info
      const userNewRole = await prisma.userNewRole.findFirst({
        where: {
          userNewRoleId: parseInt(userNewRoleId),
          newRoleId: parseInt(roleId)
        },
        include: {
          user: {
            select: {
              name: true,
              rank: true,
              userId: true
            }
          },
          newRole: {
            select: {
              roleName: true
            }
          }
        }
      });

      if (!userNewRole) {
        return null;
      }

      // Get all candidate evaluation questions for this role with answers
      const candidateEvaluations = await prisma.candidateEvaluation.findMany({
        where: {
          newRoleId: parseInt(roleId)
        },
        include: {
          answers: {
            where: {
              userNewRoleId: parseInt(userNewRoleId)
            }
          }
        },
        orderBy: {
          candidateEvaluationId: 'asc'
        }
      });

      // Get all role-related questions for this role with answers
      const roleRelatedQuestions = await prisma.roleRelatedQuestion.findMany({
        where: {
          newRoleId: parseInt(roleId)
        },
        include: {
          answers: {
            where: {
              userNewRoleId: parseInt(userNewRoleId)
            }
          }
        },
        orderBy: {
          roleRelatedQuestionId: 'asc'
        }
      });

      // Transform candidate evaluations into evaluation sections
      // For now, putting all candidate evaluations in one section
      // You can enhance this later to group by categories if needed
      const evaluationSections: EvaluationSection[] = [
        {
          id: "candidate-evaluations",
          title: "Candidate Evaluations",
          questions: candidateEvaluations.map(evaluation => ({
            id: evaluation.candidateEvaluationId.toString(),
            question: evaluation.candidateEvaluation,
            status: evaluation.answers.length > 0
              ? (evaluation.answers[0].isInResume ? "IN_RESUME" : "NOT_IN_RESUME")
              : "PENDING",
            answer: evaluation.answers.length > 0 ? evaluation.answers[0].candidateEvaluationAnswer : undefined,
            summary: evaluation.answers.length > 0 ? evaluation.answers[0].candidateEvaluationAnswer : "No evaluation provided yet."
          }))
        }
      ];

      // Transform role-related questions
      const roleQuestions: RoleQuestion[] = roleRelatedQuestions.map(question => ({
        id: question.roleRelatedQuestionId.toString(),
        question: question.roleRelatedQuestion,
        status: question.answers.length > 0
          ? (question.answers[0].isInResume ? "IN_RESUME" : "NOT_IN_RESUME")
          : "PENDING",
        summary: question.answers.length > 0 ? question.answers[0].roleRelatedQuestionAnswer : "No assessment available yet."
      }));

      // Get user documents
      const documents = await this.getUserDocuments(userNewRole.user.userId);

      return {
        candidateId: userNewRoleId,
        candidateName: userNewRole.user.rank
          ? `${userNewRole.user.rank} ${userNewRole.user.name}`
          : userNewRole.user.name,
        roleTitle: userNewRole.newRole.roleName,
        evaluationSections,
        roleQuestions,
        applicationData: {
          overallRating: userNewRole.overallRating,
          aiSummary: userNewRole.aiSummary,
          reviewerComment: userNewRole.reviewerComment,
          impactCommunication: userNewRole.impactCommunication / 100,
          skillRecency: userNewRole.skillRecency / 100,
          yearsRelevantExp: userNewRole.yearsOfRelevantExperience,
          totalExp: userNewRole.totalExperience,
          status: userNewRole.status
        },
        documents
      };

    } catch (error) {
      console.error('Error fetching candidate evaluation data:', error)
      throw new Error('Failed to fetch candidate evaluation data')
    }
  }
}
