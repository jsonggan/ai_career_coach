import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

interface AWSCertification {
  id: number
  title: string
  level: string
  description: string
  cost_usd: number
  preparation_time_hours: number
  study_hours_per_week: string
  prerequisites: string
  target_audience: string
  status?: string
  note?: string
}

interface AWSCertificationData {
  metadata: any
  certifications: {
    foundational: AWSCertification[]
    associate: AWSCertification[]
    professional: AWSCertification[]
    specialty: AWSCertification[]
  }
  certification_paths: any
  cost_summary: any
  sources: string[]
}

export async function seedCertificates(prisma: PrismaClient) {
  console.log('🌱 Starting certificates seeding...')
  
  try {
    // Load AWS certifications data from JSON file
    const dataPath = path.join(__dirname, '../data/aws_certifications_20251013.json')
    const certificationsData: AWSCertificationData = JSON.parse(readFileSync(dataPath, 'utf-8'))
    
    // Flatten all certification levels into a single array
    const allCertifications: AWSCertification[] = [
      ...certificationsData.certifications.foundational,
      ...certificationsData.certifications.associate,
      ...certificationsData.certifications.professional,
      ...certificationsData.certifications.specialty
    ]
    
    console.log(`📜 Found ${allCertifications.length} AWS certifications to seed`)
    
    // Clear existing certificates data (only non-user-added ones)
    console.log('🧹 Clearing existing AWS certificates data...')
    await prisma.certificates.deleteMany({
      where: {
        cert_provider: 'AWS',
        is_added_by_user: false
      }
    })
    
    // Insert certificates data
    console.log('📝 Inserting certificates data...')
    
    for (const cert of allCertifications) {
      await prisma.certificates.create({
        data: {
          cert_id: cert.id,
          cert_name: cert.title,
          cert_provider: 'AWS',
          cert_level: cert.level,
          cert_category: getCertificateCategory(cert.level),
          is_added_by_user: false,
        }
      })
    }
    
    console.log(`✅ Successfully seeded ${allCertifications.length} AWS certificates`)
    
  } catch (error) {
    console.error('❌ Error during certificates seeding:', error)
    throw error
  }
}

function getCertificateCategory(level: string): string {
  switch (level.toLowerCase()) {
    case 'foundational':
      return 'Foundation'
    case 'associate':
      return 'Associate'
    case 'professional':
      return 'Professional'
    case 'specialty':
      return 'Specialty'
    default:
      return 'Other'
  }
}
