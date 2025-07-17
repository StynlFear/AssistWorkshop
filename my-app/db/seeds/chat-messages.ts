import { PrismaClient } from '@prisma/client'

export async function seedChatMessages(prisma: PrismaClient) {
  console.log('Seeding chat messages...')

  // Get users and agents to reference in chat messages
  const users = await prisma.user.findMany()
  const agents = await prisma.agent.findMany()

  // Helper to get IDs safely
  const getId = (item: any) => item?.id ?? undefined

  // Create sample chat messages
  const chatMessages = [
    {
      channelId: 'SECURE-001',
      senderId: getId(users.find(u => u.username === 'demo_user')),
      handle: 'COMMAND',
      message: 'Mission parameters updated. Check secure storage for new briefing.',
      isEncrypted: true,
      keyLocked: true,
      timestamp: new Date('2025-07-17T09:15:00Z')
    },
    {
      channelId: 'SECURE-001',
      agentId: getId(agents.find(a => a.codename === 'VENGEFUL SPIRIT')),
      handle: 'V-SPIRIT',
      message: 'Acknowledged. Target location confirmed. Proceeding to checkpoint Alpha.',
      isEncrypted: true,
      keyLocked: true,
      timestamp: new Date('2025-07-17T09:18:00Z')
    },
    {
      channelId: 'SECURE-001',
      senderId: getId(users.find(u => u.username === 'analyst_01')),
      handle: 'INTEL',
      message: 'Satellite imagery shows increased activity at northern entrance. Suggest alternative approach.',
      isEncrypted: true,
      keyLocked: true,
      timestamp: new Date('2025-07-17T09:22:00Z')
    },
    {
      channelId: 'SECURE-001',
      agentId: getId(agents.find(a => a.codename === 'VENGEFUL SPIRIT')),
      handle: 'V-SPIRIT',
      message: 'Redirecting to eastern perimeter. ETA 15 minutes.',
      isEncrypted: true,
      keyLocked: true,
      timestamp: new Date('2025-07-17T09:25:00Z')
    },
    {
      channelId: 'SECURE-002',
      senderId: getId(users.find(u => u.username === 'operator_01')),
      handle: 'OPS-CONTROL',
      message: 'Extraction team on standby at coordinates sent to your secure device.',
      isEncrypted: true,
      keyLocked: true,
      timestamp: new Date('2025-07-17T10:05:00Z')
    },
    {
      channelId: 'SECURE-002',
      agentId: getId(agents.find(a => a.codename === 'SHADOW WOLF')),
      handle: 'S-WOLF',
      message: 'Under surveillance. Delayed by approximately 30 minutes. Will signal when clear.',
      isEncrypted: true,
      keyLocked: true,
      timestamp: new Date('2025-07-17T10:08:00Z')
    },
    {
      channelId: 'ALERT-001',
      message: 'SYSTEM OVERRIDE: Emergency protocol Delta-7 initiated. All field communications suspended for security scan.',
      isEncrypted: false,
      keyLocked: false,
      handle: 'SYSTEM',
      timestamp: new Date('2025-07-17T12:00:00Z')
    },
    {
      channelId: 'ALERT-001',
      message: 'SYSTEM OVERRIDE: Security scan complete. Communications restored. New encryption keys distributed.',
      isEncrypted: false,
      keyLocked: false,
      handle: 'SYSTEM',
      timestamp: new Date('2025-07-17T12:15:00Z')
    }
  ]

  const createdMessages = []

  for (const message of chatMessages) {
    const createdMessage = await prisma.chatMessage.create({
      data: message
    })
    createdMessages.push(createdMessage)
  }

  console.log(`✅ Seeded ${createdMessages.length} chat messages successfully`)
  return createdMessages
}
