import useSWR from 'swr';
import { Operation, OperationAgent } from '@prisma/client';

export interface UseOperationsReturn {
  operations: Operation[];
  isLoading: boolean;
  error: any;
  mutate: () => Promise<Operation[] | undefined>;
}

export interface OperationWithAgents extends Operation {
  agents: OperationAgent[];
}

export function useOperations(): UseOperationsReturn {
  const { data, error, isLoading, mutate } = useSWR<Operation[]>('/api/operations');

  return {
    operations: data || [],
    isLoading,
    error,
    mutate,
  };
}

export async function createOperation(operationData: Omit<Operation, 'id' | 'createdAt' | 'updatedAt'>) {
  const response = await fetch('/api/operations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(operationData),
  });

  if (!response.ok) {
    throw new Error('Failed to create operation');
  }

  return response.json();
}

export async function updateOperation(id: string, operationData: Partial<Operation>) {
  const response = await fetch(`/api/operations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(operationData),
  });

  if (!response.ok) {
    throw new Error('Failed to update operation');
  }

  return response.json();
}

export async function deleteOperation(id: string) {
  const response = await fetch(`/api/operations/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete operation');
  }
}

export async function addAgentToOperation(operationId: string, agentId: string, role?: string) {
  const response = await fetch(`/api/operations/${operationId}/agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agentId, role }),
  });

  if (!response.ok) {
    throw new Error('Failed to add agent to operation');
  }

  return response.json();
}

export async function removeAgentFromOperation(operationId: string, agentId: string) {
  const response = await fetch(`/api/operations/${operationId}/agents/${agentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to remove agent from operation');
  }
}
