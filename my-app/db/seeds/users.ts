import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding users...')
  
  // Create default users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tacticalops.com' },
    update: {},
    create: {
      email: 'admin@tacticalops.com',
      username: 'demo_user',
      password: await hash('admin123', 12),
      role: 'ADMIN',
      avatar: '/placeholder-user.jpg'
    }
  })

  const analystUser = await prisma.user.upsert({
    where: { email: 'analyst@tacticalops.com' },
    update: {},
    create: {
      email: 'analyst@tacticalops.com',
      username: 'analyst_01',
      password: await hash('analyst123', 12),
      role: 'ANALYST',
      avatar: '/placeholder-user.jpg'
    }
  })

  const operatorUser = await prisma.user.upsert({
    where: { email: 'operator@tacticalops.com' },
    update: {},
    create: {
      email: 'operator@tacticalops.com',
      username: 'operator_01',
      password: await hash('operator123', 12),
      role: 'OPERATOR',
      avatar: '/placeholder-user.jpg',
      lastLogin: new Date('2025-07-16T14:35:00Z')
    }
  })

  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@tacticalops.com' },
    update: {},
    create: {
      email: 'viewer@tacticalops.com',
      username: 'viewer_01',
      password: await hash('viewer123', 12),
      role: 'VIEWER',
      avatar: '/placeholder-user.jpg',
      lastLogin: new Date('2025-07-15T10:15:00Z')
    }
  })

  console.log('✅ Users seeded successfully')
  
  return {
    adminUser,
    analystUser,
    operatorUser,
    viewerUser
  }
}
