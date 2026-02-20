import type { Evaluation } from '../types';

const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    agentId: '1',
    agentName: 'Research Agent',
    name: 'Research Quality Evaluation',
    description: 'Evaluating research depth and accuracy',
    status: 'completed',
    scores: [
      { name: 'Accuracy', value: 0.95, maxValue: 1 },
      { name: 'Depth', value: 0.88, maxValue: 1 },
      { name: 'Relevance', value: 0.92, maxValue: 1 },
    ],
    createdAt: '2024-02-15T10:00:00Z',
    completedAt: '2024-02-15T10:15:00Z',
  },
  {
    id: '2',
    agentId: '2',
    agentName: 'Code Generation Agent',
    name: 'Code Quality Check',
    description: 'Evaluating code correctness and best practices',
    status: 'completed',
    scores: [
      { name: 'Correctness', value: 0.87, maxValue: 1 },
      { name: 'Best Practices', value: 0.85, maxValue: 1 },
      { name: 'Documentation', value: 0.82, maxValue: 1 },
    ],
    createdAt: '2024-02-16T14:00:00Z',
    completedAt: '2024-02-16T14:20:00Z',
  },
  {
    id: '3',
    agentId: '1',
    agentName: 'Research Agent',
    name: 'Research Speed Test',
    status: 'running',
    scores: [],
    createdAt: '2024-02-17T15:00:00Z',
  },
];

export const evaluationsApi = {
  getAll: async (): Promise<Evaluation[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvaluations;
  },

  getById: async (id: string): Promise<Evaluation | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEvaluations.find(eval_ => eval_.id === id) || null;
  },
};
