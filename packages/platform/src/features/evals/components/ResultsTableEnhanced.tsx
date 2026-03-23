// @ts-nocheck
/**
 * Enhanced Results Table Component
 *
 * Enhanced version using Canary UI components and design tokens.
 */

import { useState } from 'react';
import { Card, Tabs } from '@harnessio/ui/components';

const Badge = ({ children, ...props }: any) => <span {...props}>{children}</span>;
const TabsList = (p: any) => <div {...p} />;
const TabsTrigger = (p: any) => <button type="button" {...p} />;
const TabsContent = (p: any) => <div {...p} />;
import { useResults } from '../hooks';
import type { RunResponse } from '../api/types';

export interface ResultsTableEnhancedProps {
  page?: number;
  limit?: number;
}

// Helper to get status badge variant
const getStatusBadge = (status: string): { variant: 'default' | 'secondary' | 'outline' | 'success' | 'destructive'; label: string } => {
  const statusMap: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'success' | 'destructive'; label: string }> = {
    completed: { variant: 'success', label: 'Completed' },
    running: { variant: 'default', label: 'Running' },
    failed: { variant: 'destructive', label: 'Failed' },
    pending: { variant: 'outline', label: 'Pending' }
  };

  return statusMap[status.toLowerCase()] || { variant: 'secondary', label: status };
};

export function ResultsTableEnhanced({ page = 0, limit = 20 }: ResultsTableEnhancedProps) {
  const { data, isLoading, error } = useResults(page, limit);
  const [activeTab, setActiveTab] = useState('all');

  if (isLoading) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--cn-text-subtle)' }}>
        Loading results...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--cn-destructive-default)' }}>
        Error: {(error as Error).message}
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg mb-2" style={{ color: 'var(--cn-text-subtle)' }}>
          No evaluation runs yet
        </p>
        <p className="text-sm" style={{ color: 'var(--cn-text-muted)' }}>
          Results from evaluation runs will appear here
        </p>
      </div>
    );
  }

  const runs = data.data;

  // Filter runs by status for tabs
  const completedRuns = runs.filter((run: RunResponse) => run.status.toLowerCase() === 'completed');
  const runningRuns = runs.filter((run: RunResponse) => run.status.toLowerCase() === 'running');
  const failedRuns = runs.filter((run: RunResponse) => run.status.toLowerCase() === 'failed');

  const renderRunsTable = (filteredRuns: RunResponse[]) => {
    if (filteredRuns.length === 0) {
      return (
        <div className="text-center py-8" style={{ color: 'var(--cn-text-muted)' }}>
          No runs in this category
        </div>
      );
    }

    return (
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ borderBottom: '1px solid var(--cn-border-default)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--cn-text-subtle)' }}>
                  Run ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--cn-text-subtle)' }}>
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--cn-text-subtle)' }}>
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium" style={{ color: 'var(--cn-text-subtle)' }}>
                  Total Items
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium" style={{ color: 'var(--cn-text-subtle)' }}>
                  Success
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium" style={{ color: 'var(--cn-text-subtle)' }}>
                  Failed
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--cn-text-subtle)' }}>
                  Started
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--cn-text-subtle)' }}>
                  Completed
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRuns.map((run: RunResponse, index: number) => {
                const statusBadge = getStatusBadge(run.status);
                const successRate =
                  run.total_items && run.success_count
                    ? ((run.success_count / run.total_items) * 100).toFixed(1)
                    : null;

                return (
                  <tr
                    key={run.run_id}
                    className="hover:bg-[var(--cn-surface-hover)] transition-colors cursor-pointer"
                    style={
                      index !== filteredRuns.length - 1
                        ? { borderBottom: '1px solid var(--cn-border-default)' }
                        : undefined
                    }
                  >
                    <td className="px-4 py-3">
                      <code className="text-sm font-mono" style={{ color: 'var(--cn-text-default)' }}>
                        {run.run_id.slice(0, 8)}…
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm" style={{ color: 'var(--cn-text-default)' }}>
                        {run.name || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm" style={{ color: 'var(--cn-text-default)' }}>
                        {run.total_items ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm" style={{ color: 'var(--cn-text-default)' }}>
                          {run.success_count ?? '—'}
                        </span>
                        {successRate && (
                          <Badge variant="outline" className="text-xs">
                            {successRate}%
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm" style={{ color: 'var(--cn-text-default)' }}>
                        {run.failed_count ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm" style={{ color: 'var(--cn-text-muted)' }}>
                        {run.started_at
                          ? new Date(run.started_at).toLocaleString()
                          : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm" style={{ color: 'var(--cn-text-muted)' }}>
                        {run.completed_at
                          ? new Date(run.completed_at).toLocaleString()
                          : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  return (
    <div className="evals-results-table-enhanced">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--cn-text-default)' }}>
          Evaluation Results
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--cn-text-muted)' }}>
          View and analyze evaluation run results
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Runs ({runs.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRuns.length})</TabsTrigger>
          <TabsTrigger value="running">Running ({runningRuns.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failedRuns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderRunsTable(runs)}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderRunsTable(completedRuns)}
        </TabsContent>

        <TabsContent value="running" className="mt-6">
          {renderRunsTable(runningRuns)}
        </TabsContent>

        <TabsContent value="failed" className="mt-6">
          {renderRunsTable(failedRuns)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
