import { PrismaClient, AgentStatus, RiskLevel } from '@prisma/client'

export async function seedAgents(prisma: PrismaClient) {
  console.log('Seeding agents...')

  // Create sample agents
  const agents = [
    {
      agentId: 'G-078W',
      codename: 'VENGEFUL SPIRIT',
      realName: 'Sarah Mitchell',
      status: AgentStatus.ACTIVE,
      location: 'Berlin',
      riskLevel: RiskLevel.HIGH,
      missionCount: 15,
      lastSeen: new Date('2025-07-17T12:45:00Z'),
      skills: 'Infiltration,Combat,Languages',
      clearanceLevel: 4
    },
    {
      agentId: 'G-092K',
      codename: 'SHADOW WOLF',
      realName: 'Marcus Chen',
      status: AgentStatus.UNDERCOVER,
      location: 'Moscow',
      riskLevel: RiskLevel.CRITICAL,
      missionCount: 23,
      lastSeen: new Date('2025-07-16T08:22:00Z'),
      skills: 'Intelligence,Electronics,Surveillance',
      clearanceLevel: 5
    },
    {
      agentId: 'G-156T',
      codename: 'IRON MAIDEN',
      realName: 'Elena Volkov',
      status: AgentStatus.STANDBY,
      location: 'Base Alpha',
      riskLevel: RiskLevel.MEDIUM,
      missionCount: 8,
      lastSeen: new Date('2025-07-17T11:15:00Z'),
      skills: 'Demolitions,Driving,Tactics',
      clearanceLevel: 3
    },
    {
      agentId: 'G-234R',
      codename: 'GHOST RIDER',
      realName: 'David Park',
      status: AgentStatus.TRAINING,
      location: 'Training Facility',
      riskLevel: RiskLevel.LOW,
      missionCount: 2,
      lastSeen: new Date('2025-07-17T09:30:00Z'),
      skills: 'Stealth,Marksmanship',
      clearanceLevel: 2
    },
    {
      agentId: 'G-445M',
      codename: 'STORM BREAKER',
      realName: 'Lisa Anderson',
      status: AgentStatus.COMPROMISED,
      location: 'Unknown',
      riskLevel: RiskLevel.CRITICAL,
      missionCount: 18,
      lastSeen: new Date('2025-07-15T15:10:00Z'),
      skills: 'Cyber Warfare,Hacking,Communications',
      clearanceLevel: 4
    },
    {
      agentId: 'G-079X',
      codename: 'OBSIDIAN SENTINEL',
      realName: 'James Rodriguez',
      status: AgentStatus.STANDBY,
      location: 'Tokyo',
      riskLevel: RiskLevel.MEDIUM,
      missionCount: 32,
      lastSeen: new Date('2025-07-17T10:45:00Z'),
      skills: 'Surveillance,Disguise,Negotiation',
      clearanceLevel: 3
    },
    {
      agentId: 'G-080Y',
      codename: 'GHOSTLY FURY',
      realName: 'Amara Jones',
      status: AgentStatus.ACTIVE,
      location: 'Cairo',
      riskLevel: RiskLevel.HIGH,
      missionCount: 63,
      lastSeen: new Date('2025-07-17T13:05:00Z'),
      skills: 'Sabotage,Infiltration,Cryptography',
      clearanceLevel: 4
    },
    {
      agentId: 'G-081Z',
      codename: 'CURSED REVENANT',
      realName: 'Victor Novak',
      status: AgentStatus.TRAINING,
      location: 'Training Facility',
      riskLevel: RiskLevel.MEDIUM,
      missionCount: 5,
      lastSeen: new Date('2025-07-17T10:20:00Z'),
      skills: 'Demolitions,Tactics,Medical',
      clearanceLevel: 3
    }
  ]

  const createdAgents = []

  for (const agent of agents) {
    const createdAgent = await prisma.agent.upsert({
      where: { agentId: agent.agentId },
      update: agent,
      create: agent
    })
    createdAgents.push(createdAgent)
  }

  console.log(`✅ Seeded ${createdAgents.length} agents successfully`)
  return createdAgents
}
