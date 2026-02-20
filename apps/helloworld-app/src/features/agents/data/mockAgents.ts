import type { Agent } from '../types';

export const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Research Agent',
    description: 'Specialized in conducting deep research and analysis on various topics',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    lastActiveAt: '2024-02-17T14:30:00Z',
    metrics: {
      totalEvaluations: 45,
      averageScore: 0.92,
      successRate: 0.88,
    },
  },
  {
    id: '2',
    name: 'Code Generation Agent',
    description: 'Generates and reviews code based on requirements and best practices',
    status: 'running',
    createdAt: '2024-01-20T09:00:00Z',
    lastActiveAt: '2024-02-17T15:00:00Z',
    metrics: {
      totalEvaluations: 78,
      averageScore: 0.87,
      successRate: 0.82,
    },
  },
  {
    id: '3',
    name: 'Data Analysis Agent',
    description: 'Analyzes datasets and generates insights and visualizations',
    status: 'inactive',
    createdAt: '2024-02-01T11:00:00Z',
    lastActiveAt: '2024-02-15T10:00:00Z',
    metrics: {
      totalEvaluations: 23,
      averageScore: 0.89,
      successRate: 0.85,
    },
  },
];
