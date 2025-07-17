import { PrismaClient, ClassificationLevel, IntelligenceType, RiskLevel } from '@prisma/client'

export async function seedIntelligenceReports(prisma: PrismaClient) {
  console.log('Seeding intelligence reports...')

  // Get operations to link reports to
  const operations = await prisma.operation.findMany()

  // Create sample intelligence reports
  const reports = [
    {
      reportId: 'INT-2025-001',
      title: 'Infiltration of Financial Networks in Eastern Europe',
      description: 'Analysis of suspected state-sponsored financial infrastructure attacks',
      content: 'Intelligence suggests coordinated attempts to compromise banking systems across Eastern Europe, likely originating from state-sponsored actors. Evidence of sophisticated malware deployment and social engineering targeting bank employees has been documented.',
      classification: ClassificationLevel.TOP_SECRET,
      type: IntelligenceType.SIGINT,
      location: 'Multiple locations, Eastern Europe',
      tags: 'cyber,financial,infrastructure',
      threatLevel: RiskLevel.HIGH,
      publishedAt: new Date('2025-07-10T14:30:00Z')
    },
    {
      reportId: 'INT-2025-002',
      title: 'Rising Tensions in South China Sea',
      description: 'Diplomatic assessment of naval movements and political statements',
      content: 'Monitoring indicates increased naval activity in the South China Sea region, accompanied by escalating rhetoric from multiple governments. Satellite imagery confirms deployment of additional vessels to disputed areas.',
      classification: ClassificationLevel.SECRET,
      type: IntelligenceType.DIPLOMATIC,
      location: 'South China Sea',
      tags: 'maritime,diplomatic,territorial',
      threatLevel: RiskLevel.MEDIUM,
      publishedAt: new Date('2025-07-12T09:15:00Z')
    },
    {
      reportId: 'INT-2025-003',
      title: 'Weapons Smuggling Network Identified',
      description: 'Details on newly identified weapons trafficking route through Yemen',
      content: 'Human intelligence has confirmed the existence of a sophisticated weapons smuggling operation moving through Yemen, with connections to multiple militant groups. Sources have identified key transit points and several mid-level operators.',
      classification: ClassificationLevel.TOP_SECRET,
      type: IntelligenceType.HUMINT,
      location: 'Yemen, Saudi Arabia',
      tags: 'weapons,trafficking,terrorism',
      threatLevel: RiskLevel.CRITICAL,
      publishedAt: new Date('2025-07-05T16:45:00Z')
    },
    {
      reportId: 'INT-2025-004',
      title: 'Analysis of Disinformation Campaign',
      description: 'Assessment of coordinated social media manipulation',
      content: 'Open source intelligence has identified a coordinated disinformation operation targeting upcoming elections in Western Europe. Campaign utilizes automated accounts, doctored media, and strategic amplification of divisive content.',
      classification: ClassificationLevel.CONFIDENTIAL,
      type: IntelligenceType.OSINT,
      location: 'Multiple European countries',
      tags: 'disinformation,political,social-media',
      threatLevel: RiskLevel.MEDIUM,
      publishedAt: new Date('2025-07-15T11:20:00Z')
    },
    {
      reportId: 'INT-2025-005',
      title: 'Foreign Intelligence Agency Activities in Singapore',
      description: 'Surveillance report on suspected foreign operatives',
      content: 'Monitoring has confirmed increased activity by foreign intelligence services targeting government and technology sector assets in Singapore. Multiple operatives have been identified conducting surveillance and attempted network penetration.',
      classification: ClassificationLevel.TOP_SECRET,
      type: IntelligenceType.SIGINT,
      location: 'Singapore',
      tags: 'counter-intelligence,cyber,espionage',
      threatLevel: RiskLevel.HIGH,
      publishedAt: new Date('2025-07-01T08:30:00Z')
    },
    {
      reportId: 'INT-2025-006',
      title: 'Diplomatic Summit Security Assessment',
      description: 'Threat analysis for upcoming Geneva diplomatic meetings',
      content: 'Assessment of security vulnerabilities and threat landscape for upcoming high-level diplomatic summit in Geneva. Report includes analysis of historical threat actors, potential disruption scenarios, and recommended countermeasures.',
      classification: ClassificationLevel.SECRET,
      type: IntelligenceType.DIPLOMATIC,
      location: 'Geneva, Switzerland',
      tags: 'diplomatic,security,vip-protection',
      threatLevel: RiskLevel.LOW,
      publishedAt: new Date('2025-07-16T13:10:00Z')
    }
  ]

  const createdReports = []

  // Helper function to associate report with operation
  const getOperationIdForReport = (reportId: string) => {
    switch (reportId) {
      case 'INT-2025-001':
        return operations.find(o => o.operationId === 'OP-OMEGA-001')?.id;
      case 'INT-2025-003':
        return operations.find(o => o.operationId === 'OP-SIGMA-005')?.id;
      case 'INT-2025-005':
        return operations.find(o => o.operationId === 'OP-GAMMA-004')?.id;
      case 'INT-2025-006':
        return operations.find(o => o.operationId === 'OP-BETA-006')?.id;
      default:
        return null;
    }
  };

  for (const report of reports) {
    const operationId = getOperationIdForReport(report.reportId);
    
    try {
      let createdReport;
      
      if (operationId) {
        createdReport = await prisma.intelligenceReport.upsert({
          where: { reportId: report.reportId },
          update: {
            ...report,
            operation: {
              connect: {
                id: operationId
              }
            }
          },
          create: {
            ...report,
            operation: {
              connect: {
                id: operationId
              }
            }
          }
        });
      } else {
        createdReport = await prisma.intelligenceReport.upsert({
          where: { reportId: report.reportId },
          update: report,
          create: report
        });
      }
      
      createdReports.push(createdReport);
    } catch (error: any) {
      console.error(`Error creating report ${report.reportId}: ${error.message}`);
    }
  }

  console.log(`✅ Seeded ${createdReports.length} intelligence reports successfully`)
  return createdReports
}
