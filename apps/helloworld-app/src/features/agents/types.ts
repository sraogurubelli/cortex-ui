export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'running';
  avatar?: string;
  createdAt: string;
  lastActiveAt?: string;
  metrics?: {
    totalEvaluations: number;
    averageScore: number;
    successRate: number;
  };
}
