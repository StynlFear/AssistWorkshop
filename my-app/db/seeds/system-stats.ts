import { PrismaClient } from '@prisma/client'

export async function seedSystemStats(prisma: PrismaClient) {
  console.log('Seeding system statistics...')

  // Get counts from actual data for accuracy
  const totalAgents = await prisma.agent.count()
  const activeAgents = await prisma.agent.count({
    where: { status: 'ACTIVE' }
  })
  const compromisedAgents = await prisma.agent.count({
    where: { status: 'COMPROMISED' }
  })
  const trainingAgents = await prisma.agent.count({
    where: { status: 'TRAINING' }
  })
  
  const totalOperations = await prisma.operation.count()
  const activeOperations = await prisma.operation.count({
    where: { status: 'ACTIVE' }
  })
  const completedOperations = await prisma.operation.count({
    where: { status: 'COMPLETED' }
  })
  
  const totalSystems = await prisma.systemComponent.count()
  const systemsOnline = await prisma.systemComponent.count({
    where: { status: 'ONLINE' }
  })
  const warnings = await prisma.systemComponent.count({
    where: { status: 'WARNING' }
  })
  
  // Calculate the average uptime of all system components
  const systemComponents = await prisma.systemComponent.findMany({
    select: { uptime: true }
  })
  const avgUptime = systemComponents.length > 0
    ? systemComponents.reduce((sum, component) => sum + component.uptime, 0) / systemComponents.length
    : 0
  
  // Calculate a success rate based on completed vs. failed operations
  const successfulOps = await prisma.activityLog.count({
    where: { type: 'MISSION_COMPLETE' }
  })
  const failedOps = await prisma.activityLog.count({
    where: { type: 'MISSION_FAILED' }
  })
  const successRate = (successfulOps + failedOps) > 0
    ? (successfulOps / (successfulOps + failedOps)) * 100
    : 0

  // Create system stats record
  const systemStats = await prisma.systemStats.create({
    data: {
      totalAgents,
      activeAgents,
      compromisedAgents,
      trainingAgents,
      totalOperations,
      activeOperations,
      completedOperations,
      systemsOnline,
      totalSystems,
      warnings,
      avgUptime,
      successRate
    }
  })

  console.log(`✅ Seeded system statistics successfully`)
  return systemStats
}
