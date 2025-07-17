import { PrismaClient } from '@prisma/client'

export async function seedOperationAgents(prisma: PrismaClient) {
  console.log('Seeding operation-agent assignments...')

  // Get all agents and operations to establish relationships
  const agents = await prisma.agent.findMany()
  const operations = await prisma.operation.findMany()

  // Define assignments
  const assignments = [
    {
      agentId: agents.find(a => a.agentId === 'G-078W')?.id ?? '',
      operationId: operations.find(o => o.operationId === 'OP-OMEGA-001')?.id ?? '',
      role: 'Field Leader'
    },
    {
      agentId: agents.find(a => a.agentId === 'G-080Y')?.id ?? '',
      operationId: operations.find(o => o.operationId === 'OP-OMEGA-001')?.id ?? '',
      role: 'Intelligence Officer'
    },
    {
      agentId: agents.find(a => a.agentId === 'G-092K')?.id ?? '',
      operationId: operations.find(o => o.operationId === 'OP-DELTA-002')?.id ?? '',
      role: 'Extraction Specialist'
    },
    {
      agentId: agents.find(a => a.agentId === 'G-156T')?.id ?? '',
      operationId: operations.find(o => o.operationId === 'OP-DELTA-002')?.id ?? '',
      role: 'Security Detail'
    },
    {
      agentId: agents.find(a => a.agentId === 'G-445M')?.id ?? '',
      operationId: operations.find(o => o.operationId === 'OP-SIGMA-005')?.id ?? '',
      role: 'Technical Specialist'
    },
    {
      agentId: agents.find(a => a.agentId === 'G-079X')?.id ?? '',
      operationId: operations.find(o => o.operationId === 'OP-GAMMA-004')?.id ?? '',
      role: 'Surveillance Expert'
    },
    {
      agentId: agents.find(a => a.agentId === 'G-080Y')?.id ?? '',
      operationId: operations.find(o => o.operationId === 'OP-GAMMA-004')?.id ?? '',
      role: 'Field Agent'
    }
  ]

  // Filter out any assignments with missing IDs (empty strings)
  const validAssignments = assignments.filter(a => a.agentId !== '' && a.operationId !== '')

  const createdAssignments = []

  for (const assignment of validAssignments) {
    try {
      const created = await prisma.operationAgent.create({
        data: assignment
      })
      createdAssignments.push(created)
    } catch (error: any) {
      console.warn(`Failed to create assignment: ${error.message}`)
    }
  }

  console.log(`✅ Seeded ${createdAssignments.length} operation-agent assignments successfully`)
  return createdAssignments
}
