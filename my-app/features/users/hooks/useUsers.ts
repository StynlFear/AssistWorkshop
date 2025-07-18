import useSWR from 'swr';
import { User } from '@prisma/client';

export interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: any;
  mutate: () => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const { data, error, isLoading, mutate } = useSWR<User[]>('/api/users');

  return {
    users: data || [],
    isLoading,
    error,
    mutate,
  };
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
}

export async function updateUser(id: string, userData: Partial<User>) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
}

export async function deleteUser(id: string) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}
