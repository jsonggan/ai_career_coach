import { PrismaClient } from '@prisma/client'

export async function seedUserCertificates(prisma: PrismaClient) {
  console.log('🏆 Starting user certificates seeding...')

  try {
    const userId = 1

    // Clear existing user certificates for user ID 1
    console.log('🧹 Clearing existing user certificates for user ID 1...')
    await prisma.user_certificates.deleteMany({
      where: { user_id: userId }
    })

    // Clear user-added certificates
    await prisma.certificates.deleteMany({
      where: { is_added_by_user: true }
    })

    console.log('📜 Creating user certificates...')

    // Get the next available cert_id
    const maxCertId = await prisma.certificates.aggregate({
      _max: { cert_id: true }
    })
    let nextCertId = (maxCertId._max.cert_id || 0) + 1

    // Get the next available user_cert_id
    const maxUserCertId = await prisma.user_certificates.aggregate({
      _max: { user_cert_id: true }
    })
    let nextUserCertId = (maxUserCertId._max.user_cert_id || 0) + 1

    // Certificate data - AWS focused for full stack developer
    const certificatesData = [
      {
        cert_name: 'AWS Certified Cloud Practitioner',
        cert_provider: 'Amazon Web Services',
        cert_level: 'Foundational',
        cert_category: 'Cloud Computing',
        date_obtained: new Date('2024-02-10')
      },
      {
        cert_name: 'AWS Certified Developer - Associate',
        cert_provider: 'Amazon Web Services',
        cert_level: 'Associate',
        cert_category: 'Cloud Development',
        date_obtained: new Date('2024-08-15')
      }
    ]

    for (const certData of certificatesData) {
      // Create certificate
      const certificate = await prisma.certificates.create({
        data: {
          cert_id: nextCertId,
          cert_name: certData.cert_name,
          cert_provider: certData.cert_provider,
          cert_level: certData.cert_level,
          cert_category: certData.cert_category,
          is_added_by_user: true
        }
      })

      // Create user certificate link
      await prisma.user_certificates.create({
        data: {
          user_cert_id: nextUserCertId,
          user_id: userId,
          cert_id: certificate.cert_id,
          date_obtained: certData.date_obtained
        }
      })

      nextCertId++
      nextUserCertId++
    }

    console.log(`✅ Successfully seeded ${certificatesData.length} user certificates for user ID ${userId}`)

  } catch (error) {
    console.error('❌ Error during user certificates seeding:', error)
    throw error
  }
}
