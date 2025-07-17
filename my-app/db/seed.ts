import { PrismaClient } from '@prisma/client'
import { seedUsers } from './seeds/users'
import { seedAgents } from './seeds/agents'
import { seedOperations } from './seeds/operations'
import { seedIntelligenceReports } from './seeds/intelligence-reports'
import { seedSystemComponents } from './seeds/system-components'
import { seedActivityLogs } from './seeds/activity-logs'
import { seedChatMessages } from './seeds/chat-messages'
import { seedSystemStats } from './seeds/system-stats'
import { seedOperationAgents } from './seeds/operation-agents'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed users first (required for relationships)
    await seedUsers(prisma)
    
    // Seed agents (required for operations assignment)
    await seedAgents(prisma)
    
    // Seed operations
    await seedOperations(prisma)
    
    // Seed junction table for operations and agents
    await seedOperationAgents(prisma)
    
    // Seed intelligence reports
    await seedIntelligenceReports(prisma)
    
    // Seed system components
    await seedSystemComponents(prisma)
    
    // Seed activity logs
    await seedActivityLogs(prisma)
    
    // Seed chat messages
    await seedChatMessages(prisma)
    
    // Seed system stats
    await seedSystemStats(prisma)
    
    console.log('✅ Database seeding completed successfully')
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
