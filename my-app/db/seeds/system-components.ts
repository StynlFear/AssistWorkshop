import { PrismaClient, SystemStatus } from '@prisma/client'

export async function seedSystemComponents(prisma: PrismaClient) {
  console.log('Seeding system components...')

  // Create sample system components
  const systemComponents = [
    {
      name: 'Command Server Alpha',
      role: 'Primary Server',
      status: SystemStatus.ONLINE,
      location: 'HQ, Secure Zone 1',
      health: 96,
      cpuUsage: 42,
      memoryUsage: 38,
      storageUsage: 51,
      uptime: 84,  // days
      lastCheck: new Date('2025-07-17T13:30:00Z')
    },
    {
      name: 'Database Cluster Beta',
      role: 'Database',
      status: SystemStatus.ONLINE,
      location: 'HQ, Secure Zone 1',
      health: 98,
      cpuUsage: 35,
      memoryUsage: 63,
      storageUsage: 48,
      uptime: 112,  // days
      lastCheck: new Date('2025-07-17T13:30:00Z')
    },
    {
      name: 'Security Gateway',
      role: 'Firewall',
      status: SystemStatus.WARNING,
      location: 'Perimeter Network',
      health: 75,
      cpuUsage: 87,
      memoryUsage: 72,
      storageUsage: 35,
      uptime: 27,  // days
      lastCheck: new Date('2025-07-17T13:30:00Z')
    },
    {
      name: 'Communication Hub',
      role: 'Network',
      status: SystemStatus.ONLINE,
      location: 'HQ, Secure Zone 2',
      health: 94,
      cpuUsage: 46,
      memoryUsage: 42,
      storageUsage: 37,
      uptime: 62,  // days
      lastCheck: new Date('2025-07-17T13:30:00Z')
    },
    {
      name: 'Backup Storage Array',
      role: 'Storage',
      status: SystemStatus.MAINTENANCE,
      location: 'Backup Site B',
      health: 80,
      cpuUsage: 12,
      memoryUsage: 15,
      storageUsage: 82,
      uptime: 43,  // days
      lastCheck: new Date('2025-07-17T13:30:00Z')
    },
    {
      name: 'Analytics Engine',
      role: 'Processing',
      status: SystemStatus.ONLINE,
      location: 'HQ, Secure Zone 3',
      health: 92,
      cpuUsage: 78,
      memoryUsage: 68,
      storageUsage: 45,
      uptime: 31,  // days
      lastCheck: new Date('2025-07-17T13:30:00Z')
    }
  ]

  const createdComponents = []

  for (const component of systemComponents) {
    const createdComponent = await prisma.systemComponent.upsert({
      where: { name: component.name },
      update: component,
      create: component
    })
    createdComponents.push(createdComponent)
  }

  console.log(`✅ Seeded ${createdComponents.length} system components successfully`)
  return createdComponents
}
