import useSWR from 'swr';
import { IntelligenceReport } from '@prisma/client';

export interface UseIntelligenceReturn {
  reports: IntelligenceReport[];
  isLoading: boolean;
  error: any;
  mutate: () => Promise<IntelligenceReport[] | undefined>;
}

export function useIntelligence(): UseIntelligenceReturn {
  const { data, error, isLoading, mutate } = useSWR<IntelligenceReport[]>('/api/intelligence-reports');

  return {
    reports: data || [],
    isLoading,
    error,
    mutate,
  };
}

export async function createIntelligenceReport(reportData: Omit<IntelligenceReport, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>) {
  const response = await fetch('/api/intelligence-reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportData),
  });

  if (!response.ok) {
    throw new Error('Failed to create intelligence report');
  }

  return response.json();
}

export async function updateIntelligenceReport(id: string, reportData: Partial<IntelligenceReport>) {
  const response = await fetch(`/api/intelligence-reports/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportData),
  });

  if (!response.ok) {
    throw new Error('Failed to update intelligence report');
  }

  return response.json();
}

export async function deleteIntelligenceReport(id: string) {
  const response = await fetch(`/api/intelligence-reports/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete intelligence report');
  }
}
