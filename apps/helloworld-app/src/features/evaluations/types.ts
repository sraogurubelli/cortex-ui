export interface Evaluation {
  id: string;
  agentId: string;
  agentName: string;
  name: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  scores: Array<{
    name: string;
    value: number;
    maxValue?: number;
    comment?: string;
  }>;
  createdAt: string;
  completedAt?: string;
}
