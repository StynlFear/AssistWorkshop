import { z } from 'zod'
import { 
  Role, 
  AgentStatus, 
  RiskLevel, 
  OperationStatus, 
  SystemStatus,
  ClassificationLevel,
  IntelligenceType,
  ActivityType
} from '@prisma/client'

// Base schemas for common fields
const idSchema = z.object({
  id: z.string()
})

const timestampFields = z.object({
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// User schema
export const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'ANALYST', 'OPERATOR', 'VIEWER']).default('VIEWER'),
  avatar: z.string().optional(),
  isActive: z.boolean().default(true),
  lastLogin: z.date().optional()
})

export const updateUserSchema = createUserSchema.partial()

// Agent schema
export const createAgentSchema = z.object({
  agentId: z.string(),
  codename: z.string(),
  realName: z.string().optional(),
  status: z.nativeEnum(AgentStatus).default('STANDBY'),
  location: z.string().optional(),
  riskLevel: z.nativeEnum(RiskLevel).default('LOW'),
  missionCount: z.number().default(0),
  skills: z.string(),
  clearanceLevel: z.number().default(1),
  isActive: z.boolean().default(true)
})

export const updateAgentSchema = createAgentSchema.partial()

// Operation schema
export const createOperationSchema = z.object({
  operationId: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.nativeEnum(OperationStatus).default('PLANNING'),
  riskLevel: z.nativeEnum(RiskLevel).default('LOW'),
  location: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  plannedEndDate: z.date().optional(),
  isActive: z.boolean().default(true),
  briefing: z.string().optional(),
  objectives: z.string()
})

export const updateOperationSchema = createOperationSchema.partial()

// Operation Agent schema
export const createOperationAgentSchema = z.object({
  operationId: z.string(),
  agentId: z.string(),
  role: z.string().optional()
})

export const updateOperationAgentSchema = createOperationAgentSchema.partial()

// Intelligence Report schema
export const createIntelligenceReportSchema = z.object({
  reportId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  content: z.string(),
  classification: z.nativeEnum(ClassificationLevel).default('CONFIDENTIAL'),
  type: z.nativeEnum(IntelligenceType).default('HUMINT'),
  location: z.string().optional(),
  tags: z.string(),
  sourceId: z.string().optional(),
  operationId: z.string().optional(),
  threatLevel: z.nativeEnum(RiskLevel).default('LOW'),
  isActive: z.boolean().default(true)
})

export const updateIntelligenceReportSchema = createIntelligenceReportSchema.partial()

// System Component schema
export const createSystemComponentSchema = z.object({
  name: z.string(),
  role: z.string(),
  status: z.nativeEnum(SystemStatus).default('ONLINE'),
  location: z.string().optional(),
  health: z.number().default(100),
  cpuUsage: z.number().default(0),
  memoryUsage: z.number().default(0),
  storageUsage: z.number().default(0),
  uptime: z.number().default(0),
  isActive: z.boolean().default(true)
})

export const updateSystemComponentSchema = createSystemComponentSchema.partial()

// Activity Log schema
export const createActivityLogSchema = z.object({
  type: z.nativeEnum(ActivityType),
  message: z.string(),
  details: z.any().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  operationId: z.string().optional(),
  reportId: z.string().optional(),
  systemId: z.string().optional()
})

export const updateActivityLogSchema = createActivityLogSchema.partial()

// Chat Message schema
export const createChatMessageSchema = z.object({
  channelId: z.string(),
  senderId: z.string().optional(),
  agentId: z.string().optional(),
  handle: z.string(),
  message: z.string(),
  isEncrypted: z.boolean().default(true),
  keyLocked: z.boolean().default(true),
  isActive: z.boolean().default(true)
})

export const updateChatMessageSchema = createChatMessageSchema.partial()

// System Stats schema
export const createSystemStatsSchema = z.object({
  totalAgents: z.number().default(0),
  activeAgents: z.number().default(0),
  compromisedAgents: z.number().default(0),
  trainingAgents: z.number().default(0),
  totalOperations: z.number().default(0),
  activeOperations: z.number().default(0),
  completedOperations: z.number().default(0),
  systemsOnline: z.number().default(0),
  totalSystems: z.number().default(0),
  warnings: z.number().default(0),
  avgUptime: z.number().default(0),
  successRate: z.number().default(0)
})

export const updateSystemStatsSchema = createSystemStatsSchema.partial()
