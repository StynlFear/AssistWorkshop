import { PrismaClient } from '@prisma/client'

/**
 * Helper function to assign an agent to an operation with a specific role
 */
export async function assignAgentToOperation(
  prisma: PrismaClient,
  agentIdOrCodename: string,
  operationIdOrCode: string,
  role: string
): Promise<boolean> {
  try {
    // Find the agent (by either ID or codename)
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { id: agentIdOrCodename },
          { agentId: agentIdOrCodename },
          { codename: agentIdOrCodename }
        ]
      }
    })

    if (!agent) {
      console.error(`Agent not found: ${agentIdOrCodename}`)
      return false
    }

    // Find the operation (by either ID or operationId)
    const operation = await prisma.operation.findFirst({
      where: {
        OR: [
          { id: operationIdOrCode },
          { operationId: operationIdOrCode }
        ]
      }
    })

    if (!operation) {
      console.error(`Operation not found: ${operationIdOrCode}`)
      return false
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.operationAgent.findFirst({
      where: {
        agentId: agent.id,
        operationId: operation.id
      }
    })

    if (existingAssignment) {
      // Update existing assignment
      await prisma.operationAgent.update({
        where: { id: existingAssignment.id },
        data: { role }
      })
      return true
    }

    // Create new assignment
    await prisma.operationAgent.create({
      data: {
        agentId: agent.id,
        operationId: operation.id,
        role
      }
    })

    return true
  } catch (error: any) {
    console.error(`Error assigning agent to operation: ${error.message}`)
    return false
  }
}

/**
 * Helper function to get all agents assigned to an operation
 */
export async function getOperationAgents(
  prisma: PrismaClient,
  operationIdOrCode: string
) {
  try {
    // Find the operation (by either ID or operationId)
    const operation = await prisma.operation.findFirst({
      where: {
        OR: [
          { id: operationIdOrCode },
          { operationId: operationIdOrCode }
        ]
      }
    })

    if (!operation) {
      console.error(`Operation not found: ${operationIdOrCode}`)
      return []
    }

    // Get all agents assigned to this operation with their roles
    return await prisma.operationAgent.findMany({
      where: {
        operationId: operation.id
      },
      include: {
        agent: true
      }
    })
  } catch (error: any) {
    console.error(`Error getting operation agents: ${error.message}`)
    return []
  }
}
