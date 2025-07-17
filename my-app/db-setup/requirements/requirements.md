# Tactical OPS Database Schema

This document describes the database schema for the Tactical OPS application using Prisma ORM with PostgreSQL.

## Overview

The database is designed to support a tactical command center application with the following main functionalities:
- User authentication and role management
- Agent tracking and management
- Operations/missions planning and execution
- Intelligence reports and threat analysis
- System monitoring and infrastructure health
- Activity logging and audit trails
- Encrypted communications

## Database Models

### 1. User Management

#### User
- **Purpose**: Authentication and role-based access control
- **Key Fields**: 
  - `email`, `username` (unique identifiers)
  - `role` (ADMIN, ANALYST, OPERATOR, VIEWER)
  - `password` (hashed)
  - `avatar`, `lastLogin`
- **Relations**: One-to-many with ActivityLog and ChatMessage

### 2. Agent Management

#### Agent
- **Purpose**: Track field operatives and their status
- **Key Fields**:
  - `agentId` (unique identifier, e.g., "G-078W")
  - `codename` (unique, e.g., "VENGEFUL SPIRIT")
  - `status` (ACTIVE, STANDBY, COMPROMISED, TRAINING, UNDERCOVER)
  - `riskLevel` (LOW, MEDIUM, HIGH, CRITICAL)
  - `location`, `missionCount`, `lastSeen`
  - `skills` (array of specializations)
  - `clearanceLevel` (security clearance)
- **Relations**: Many-to-many with Operations through OperationAgent

#### OperationAgent (Junction Table)
- **Purpose**: Links agents to operations with role information
- **Key Fields**: `operationId`, `agentId`, `role`, `assignedAt`

### 3. Operations Management

#### Operation
- **Purpose**: Mission planning and execution tracking
- **Key Fields**:
  - `operationId` (unique, e.g., "OP-OMEGA-001")
  - `name`, `description`, `briefing`
  - `status` (PLANNING, ACTIVE, COMPLETED, COMPROMISED, SUSPENDED)
  - `riskLevel` (LOW, MEDIUM, HIGH, CRITICAL)
  - `location`, `startDate`, `endDate`, `plannedEndDate`
  - `objectives` (array of mission goals)
- **Relations**: Many-to-many with Agents, one-to-many with IntelligenceReports

### 4. Intelligence Management

#### IntelligenceReport
- **Purpose**: Store classified reports and threat analysis
- **Key Fields**:
  - `reportId` (unique, e.g., "INT-2025-001")
  - `title`, `description`, `content`
  - `classification` (CONFIDENTIAL, SECRET, TOP_SECRET)
  - `type` (HUMINT, SIGINT, DIPLOMATIC, OSINT)
  - `tags` (array of topic tags)
  - `threatLevel`, `location`
- **Relations**: Optional link to Operation

### 5. System Monitoring

#### SystemComponent
- **Purpose**: Infrastructure health and performance monitoring
- **Key Fields**:
  - `name` (unique, e.g., "Command Server Alpha")
  - `role` (e.g., "Primary Server")
  - `status` (ONLINE, OFFLINE, MAINTENANCE, WARNING)
  - `health` (percentage 0-100)
  - `cpuUsage`, `memoryUsage`, `storageUsage` (percentages)
  - `uptime` (days), `location`
- **Relations**: One-to-many with ActivityLog

### 6. Audit and Communication

#### ActivityLog
- **Purpose**: Track all system activities and events
- **Key Fields**:
  - `type` (MISSION_START, AGENT_DEPLOYED, SYSTEM_ALERT, etc.)
  - `message`, `details` (JSON for additional data)
  - `timestamp`
- **Relations**: Optional foreign keys to User, Agent, Operation, IntelligenceReport, SystemComponent

#### ChatMessage
- **Purpose**: Encrypted communications between users and agents
- **Key Fields**:
  - `channelId`, `handle`, `message`
  - `isEncrypted`, `keyLocked`
  - `senderId` (User), `agentId` (Agent)

### 7. Dashboard Metrics

#### SystemStats
- **Purpose**: Aggregate statistics for dashboard displays
- **Key Fields**:
  - Agent counts (total, active, compromised, training)
  - Operation counts (total, active, completed)
  - System metrics (online systems, warnings, uptime, success rate)

## Enumerations

The schema uses several enums to ensure data consistency:

- **Role**: ADMIN, ANALYST, OPERATOR, VIEWER
- **AgentStatus**: ACTIVE, STANDBY, COMPROMISED, TRAINING, UNDERCOVER
- **RiskLevel**: LOW, MEDIUM, HIGH, CRITICAL
- **OperationStatus**: PLANNING, ACTIVE, COMPLETED, COMPROMISED, SUSPENDED
- **SystemStatus**: ONLINE, OFFLINE, MAINTENANCE, WARNING
- **ClassificationLevel**: CONFIDENTIAL, SECRET, TOP_SECRET
- **IntelligenceType**: HUMINT, SIGINT, DIPLOMATIC, OSINT
- **ActivityType**: MISSION_START, MISSION_COMPLETE, AGENT_DEPLOYED, etc.

## Key Relationships

1. **Users** can create activity logs and send chat messages
2. **Agents** can be assigned to multiple operations and participate in communications
3. **Operations** can have multiple agents and related intelligence reports
4. **Intelligence Reports** can be linked to specific operations
5. **System Components** generate activity logs for monitoring
6. **Activity Logs** can reference any entity for comprehensive audit trails

## Security Considerations

- Passwords are hashed using bcrypt
- Classification levels enforce data access controls
- Audit trails track all critical operations
- Encrypted communications with key management
- Role-based access control throughout the system

## Usage Examples

### Query active agents in high-risk operations:
```typescript
const activeAgents = await db.agent.findMany({
  where: {
    status: 'ACTIVE',
    operations: {
      some: {
        operation: {
          status: 'ACTIVE',
          riskLevel: 'HIGH'
        }
      }
    }
  },
  include: {
    operations: {
      include: {
        operation: true
      }
    }
  }
})
```

### Get intelligence reports by classification:
```typescript
const topSecretReports = await db.intelligenceReport.findMany({
  where: {
    classification: 'TOP_SECRET'
  },
  orderBy: {
    publishedAt: 'desc'
  }
})
```

### Monitor system health:
```typescript
const systemStatus = await db.systemComponent.findMany({
  where: {
    status: {
      in: ['WARNING', 'OFFLINE']
    }
  }
})
```

This schema provides a comprehensive foundation for the Tactical OPS application while maintaining flexibility for future enhancements.
