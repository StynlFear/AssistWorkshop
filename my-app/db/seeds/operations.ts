import { PrismaClient, OperationStatus, RiskLevel } from '@prisma/client'

export async function seedOperations(prisma: PrismaClient) {
  console.log('Seeding operations...')

  // Create sample operations
  const operations = [
    {
      operationId: 'OP-OMEGA-001',
      name: 'Operation Black Echo',
      description: 'Track high-value target in Eastern Europe',
      status: OperationStatus.ACTIVE,
      riskLevel: RiskLevel.HIGH,
      location: 'Warsaw',
      startDate: new Date('2025-07-12T00:00:00Z'),
      plannedEndDate: new Date('2025-07-22T00:00:00Z'),
      briefing: 'Intel suggests high-value target has established a base of operations in Warsaw. Track and gather intelligence on their activities without direct engagement.',
      objectives: 'Establish surveillance,Gather intelligence,Report network connections'
    },
    {
      operationId: 'OP-DELTA-002',
      name: 'Operation Silent Viper',
      description: 'Asset extraction from hostile territory',
      status: OperationStatus.COMPLETED,
      riskLevel: RiskLevel.CRITICAL,
      location: 'Damascus',
      startDate: new Date('2025-07-05T00:00:00Z'),
      endDate: new Date('2025-07-09T00:00:00Z'),
      plannedEndDate: new Date('2025-07-10T00:00:00Z'),
      briefing: 'Critical asset has been compromised and requires immediate extraction. Extreme caution advised due to heavy surveillance in the area.',
      objectives: 'Establish safe extraction route,Secure asset,Transport to safehouse,Arrange exfiltration'
    },
    {
      operationId: 'OP-ALPHA-003',
      name: 'Operation Frozen Shield',
      description: 'Secure compromised intelligence server',
      status: OperationStatus.PLANNING,
      riskLevel: RiskLevel.MEDIUM,
      location: 'Stockholm',
      startDate: new Date('2025-07-20T00:00:00Z'),
      plannedEndDate: new Date('2025-07-23T00:00:00Z'),
      briefing: 'Intelligence server containing sensitive information has been compromised. Secure the server and identify the breach point without alerting adversaries.',
      objectives: 'Secure compromised server,Identify breach vector,Collect evidence,Apply countermeasures'
    },
    {
      operationId: 'OP-GAMMA-004',
      name: 'Operation Rising Phoenix',
      description: 'Counter-intelligence against foreign agency',
      status: OperationStatus.ACTIVE,
      riskLevel: RiskLevel.HIGH,
      location: 'Singapore',
      startDate: new Date('2025-06-28T00:00:00Z'),
      plannedEndDate: new Date('2025-07-28T00:00:00Z'),
      briefing: 'Foreign intelligence agency has increased activities targeting our infrastructure. Establish counter-intelligence operation to identify agents and methods.',
      objectives: 'Identify foreign operatives,Document methodology,Secure vulnerable assets,Prepare disinformation campaign'
    },
    {
      operationId: 'OP-SIGMA-005',
      name: 'Operation Midnight Scepter',
      description: 'Infiltrate suspected weapons research facility',
      status: OperationStatus.COMPROMISED,
      riskLevel: RiskLevel.CRITICAL,
      location: 'Yemen',
      startDate: new Date('2025-07-03T00:00:00Z'),
      endDate: new Date('2025-07-06T00:00:00Z'),
      plannedEndDate: new Date('2025-07-15T00:00:00Z'),
      briefing: 'Intelligence suggests illegal weapons research facility operating in remote location. Infiltrate and gather evidence of activities. Operation compromised on day 3.',
      objectives: 'Infiltrate facility,Document activities,Gather physical evidence,Identify key personnel'
    },
    {
      operationId: 'OP-BETA-006',
      name: 'Operation Crystal Serpent',
      description: 'Diplomatic security enhancement',
      status: OperationStatus.PLANNING,
      riskLevel: RiskLevel.LOW,
      location: 'Geneva',
      startDate: new Date('2025-07-25T00:00:00Z'),
      plannedEndDate: new Date('2025-08-10T00:00:00Z'),
      briefing: 'Upcoming diplomatic summit requires enhanced security protocols. Establish secure communications and counter-surveillance measures.',
      objectives: 'Secure venue perimeter,Establish communications protocol,Counter-surveillance deployment,VIP protection detail'
    }
  ]

  const createdOperations = []

  for (const operation of operations) {
    const createdOperation = await prisma.operation.upsert({
      where: { operationId: operation.operationId },
      update: operation,
      create: operation
    })
    createdOperations.push(createdOperation)
  }

  console.log(`✅ Seeded ${createdOperations.length} operations successfully`)
  return createdOperations
}
