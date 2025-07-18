import useSWR from 'swr';
import { Agent } from '@prisma/client';

export interface UseAgentsReturn {
  agents: Agent[];
  isLoading: boolean;
  error: any;
  mutate: () => Promise<Agent[] | undefined>;
}

export function useAgents(): UseAgentsReturn {
  const { data, error, isLoading, mutate } = useSWR<Agent[]>('/api/agents');

  return {
    agents: data || [],
    isLoading,
    error,
    mutate,
  };
}

export async function createAgent(agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'lastSeen'>) {
  const response = await fetch('/api/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  });

  if (!response.ok) {
    throw new Error('Failed to create agent');
  }

  return response.json();
}

export async function updateAgent(id: string, agentData: Partial<Agent>) {
  const response = await fetch(`/api/agents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  });

  if (!response.ok) {
    throw new Error('Failed to update agent');
  }

  return response.json();
}

export async function deleteAgent(id: string) {
  const response = await fetch(`/api/agents/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete agent');
  }
}
