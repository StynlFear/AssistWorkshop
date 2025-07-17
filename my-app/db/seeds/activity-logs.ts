import { PrismaClient, ActivityType } from '@prisma/client'

export async function seedActivityLogs(prisma: PrismaClient) {
  console.log('Seeding activity logs...')

  // Get related entities to reference in logs
  const users = await prisma.user.findMany()
  const agents = await prisma.agent.findMany()
  const operations = await prisma.operation.findMany()
  const reports = await prisma.intelligenceReport.findMany()
  const systems = await prisma.systemComponent.findMany()

  // Helper to get IDs safely
  const getId = (item: any) => item?.id ?? undefined

  // Create sample activity logs with recent timestamps
  const activityLogs = [
    {
      type: ActivityType.MISSION_START,
      message: 'Operation Black Echo initiated',
      details: { 
        location: 'Warsaw',
        status: 'Active',
        agentCount: 2
      },
      timestamp: new Date('2025-07-12T06:15:00Z'),
      userId: getId(users.find(u => u.username === 'demo_user')),
      operationId: getId(operations.find(o => o.operationId === 'OP-OMEGA-001'))
    },
    {
      type: ActivityType.AGENT_DEPLOYED,
      message: 'Agent VENGEFUL SPIRIT deployed to field location',
      details: {
        destination: 'Warsaw',
        transportMethod: 'Commercial Air',
        equipmentStatus: 'Complete'
      },
      timestamp: new Date('2025-07-12T09:30:00Z'),
      agentId: getId(agents.find(a => a.codename === 'VENGEFUL SPIRIT')),
      operationId: getId(operations.find(o => o.operationId === 'OP-OMEGA-001'))
    },
    {
      type: ActivityType.MISSION_COMPLETE,
      message: 'Operation Silent Viper successfully completed',
      details: {
        outcome: 'Success',
        casualties: 0,
        objectivesCompleted: 4,
        extractionMethod: 'Aerial'
      },
      timestamp: new Date('2025-07-09T22:45:00Z'),
      userId: getId(users.find(u => u.username === 'operator_01')),
      operationId: getId(operations.find(o => o.operationId === 'OP-DELTA-002'))
    },
    {
      type: ActivityType.AGENT_COMPROMISED,
      message: 'Agent STORM BREAKER status changed to COMPROMISED',
      details: {
        lastKnownLocation: 'Yemen',
        lastCommunication: '2025-07-15T15:10:00Z',
        suspectedCause: 'Counter-intelligence operation'
      },
      timestamp: new Date('2025-07-15T15:10:00Z'),
      agentId: getId(agents.find(a => a.codename === 'STORM BREAKER')),
      operationId: getId(operations.find(o => o.operationId === 'OP-SIGMA-005'))
    },
    {
      type: ActivityType.SYSTEM_ALERT,
      message: 'Security Gateway showing unusual traffic patterns',
      details: {
        alertLevel: 'Warning',
        trafficSource: 'Multiple IPs',
        patternType: 'Potential DDoS',
        mitigationStatus: 'Automatic countermeasures deployed'
      },
      timestamp: new Date('2025-07-17T07:22:00Z'),
      systemId: getId(systems.find(s => s.name === 'Security Gateway'))
    },
    {
      type: ActivityType.LOGIN,
      message: 'User demo_user logged in',
      details: {
        ipAddress: '198.51.100.234',
        deviceType: 'Workstation',
        location: 'HQ'
      },
      timestamp: new Date('2025-07-17T08:05:00Z'),
      userId: getId(users.find(u => u.username === 'demo_user'))
    },
    {
      type: ActivityType.MISSION_FAILED,
      message: 'Operation Midnight Scepter compromised and aborted',
      details: {
        reason: 'Agent cover blown',
        extractionStatus: 'Complete',
        evidenceSecured: 'Partial'
      },
      timestamp: new Date('2025-07-06T18:30:00Z'),
      operationId: getId(operations.find(o => o.operationId === 'OP-SIGMA-005'))
    },
    {
      type: ActivityType.COMMUNICATION_LOST,
      message: 'Lost contact with Agent SHADOW WOLF',
      details: {
        lastKnownLocation: 'Moscow',
        lastCommunication: '2025-07-16T08:22:00Z',
        contingencyProtocol: 'Delta-3 initiated'
      },
      timestamp: new Date('2025-07-16T12:45:00Z'),
      agentId: getId(agents.find(a => a.codename === 'SHADOW WOLF'))
    }
  ]

  const createdLogs = []

  for (const log of activityLogs) {
    const createdLog = await prisma.activityLog.create({
      data: log
    })
    createdLogs.push(createdLog)
  }

  console.log(`✅ Seeded ${createdLogs.length} activity logs successfully`)
  return createdLogs
}
