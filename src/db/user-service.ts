import { prisma } from './prisma'

export interface UserData {
  userId: string;
  name: string;
  jobRole: string;
  systemRole: string;
  rank: string | null;
}

export const userService = {
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          userId: true,
          name: true,
          jobRole: true,
          systemRole: true,
          rank: true,
        },
        orderBy: {
          name: 'asc'
        }
      })
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }
  },

  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          userId: userId
        },
        select: {
          userId: true,
          name: true,
          jobRole: true,
          systemRole: true,
          rank: true,
        }
      })
      return user
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      throw new Error('Failed to fetch user')
    }
  },

  async getEmployeesUnderManager(managerUserId: string) {
    try {
      const employees = await prisma.user.findMany({
        where: {
          managerUserId: managerUserId
        },
        select: {
          userId: true,
          name: true,
          jobRole: true,
          systemRole: true,
          rank: true,
        },
        orderBy: {
          name: 'asc'
        }
      })
      return employees
    } catch (error) {
      console.error('Error fetching employees under manager:', error)
      throw new Error('Failed to fetch employees')
    }
  },

  async getPeers(userId: string) {
    try {
      // First get the user's system role
      const currentUser = await prisma.user.findUnique({
        where: {
          userId: userId
        },
        select: {
          systemRole: true,
        }
      })

      if (!currentUser) {
        throw new Error('User not found')
      }

      // Then get all users with the same system role, excluding the current user
      const peers = await prisma.user.findMany({
        where: {
          systemRole: currentUser.systemRole,
          userId: {
            not: userId
          }
        },
        select: {
          userId: true,
          name: true,
          jobRole: true,
          systemRole: true,
          rank: true,
        },
        orderBy: {
          name: 'asc'
        }
      })
      return peers
    } catch (error) {
      console.error('Error fetching peers:', error)
      throw new Error('Failed to fetch peers')
    }
  },
}
