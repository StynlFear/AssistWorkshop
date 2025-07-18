import { DashboardStats, ActivityLogWithAgent } from '@/lib/types'

// API utility functions
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('/api/dashboard/stats')
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats')
  }
  const data = await response.json()
  return data.stats
}

export async function fetchActivityLogs(limit: number = 20): Promise<ActivityLogWithAgent[]> {
  const response = await fetch(`/api/activity-logs?limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to fetch activity logs')
  }
  const data = await response.json()
  return data.activityLogs
}

export async function fetchAgents(search?: string, status?: string) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (status) params.append('status', status)
  
  const response = await fetch(`/api/agents?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch agents')
  }
  const data = await response.json()
  return data.agents
}

export async function fetchOperations(status?: string, priority?: string) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (priority) params.append('priority', priority)
  
  const response = await fetch(`/api/operations?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch operations')
  }
  const data = await response.json()
  return data.operations
}

export async function fetchIntelligenceReports(
  search?: string, 
  classification?: string, 
  threatLevel?: string
) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (classification) params.append('classification', classification)
  if (threatLevel) params.append('threatLevel', threatLevel)
  
  const response = await fetch(`/api/intelligence?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch intelligence reports')
  }
  const data = await response.json()
  return data.reports
}

export async function fetchSystems(status?: string, type?: string) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (type) params.append('type', type)
  
  const response = await fetch(`/api/systems?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch systems')
  }
  const data = await response.json()
  return data.systems
}

export async function createAgent(agentData: {
  agentId: string
  name: string
  status: string
  location: string
  riskLevel: string
}) {
  const response = await fetch('/api/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create agent')
  }
  
  const data = await response.json()
  return data.agent
}
