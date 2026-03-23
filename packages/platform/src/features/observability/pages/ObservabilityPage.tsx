import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@cortex/core';

interface TraceSummary {
  id: string;
  name: string;
  session_id: string;
  start_time: string;
  duration_ms: number;
  model: string;
  total_tokens: number;
  status: string;
  spans_count: number;
}

interface TraceSpan {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  duration_ms: number;
  model: string;
  tokens_input: number;
  tokens_output: number;
  status: string;
}

interface TraceDetail {
  id: string;
  name: string;
  session_id: string;
  start_time: string;
  duration_ms: number;
  total_tokens: number;
  spans: TraceSpan[];
  metadata: Record<string, unknown>;
}

interface TraceStats {
  total_traces: number;
  total_tokens: number;
  avg_latency_ms: number;
  p50_latency_ms: number;
  p95_latency_ms: number;
  error_count: number;
  error_rate: number;
  model_breakdown: Record<string, number>;
  period: string;
}

type Tab = 'traces' | 'detail' | 'metrics';

export function ObservabilityPage() {
  const [tab, setTab] = useState<Tab>('traces');
  const [traces, setTraces] = useState<TraceSummary[]>([]);
  const [detail, setDetail] = useState<TraceDetail | null>(null);
  const [stats, setStats] = useState<TraceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTraces = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest<TraceSummary[]>('/api/v1/traces?limit=50');
      setTraces(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiRequest<TraceStats>('/api/v1/traces/stats');
      setStats(data);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    fetchTraces();
    fetchStats();
  }, [fetchTraces, fetchStats]);

  const viewTrace = async (traceId: string) => {
    try {
      const data = await apiRequest<TraceDetail>(`/api/v1/traces/${traceId}`);
      setDetail(data);
      setTab('detail');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const statusColor = (status: string) =>
    status === 'error' ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10';

  const tabs: { key: Tab; label: string }[] = [
    { key: 'traces', label: 'Traces' },
    { key: 'metrics', label: 'Metrics' },
  ];

  if (tab === 'detail' && detail) {
    tabs.push({ key: 'detail', label: `Trace: ${detail.id.slice(0, 8)}...` });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-cn-foreground-1 mb-4">Observability</h1>
      {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded">{error}</div>}

      <div className="flex gap-1 mb-6 border-b border-cn-borders-3">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-cn-brand-primary text-cn-brand-primary'
                : 'border-transparent text-cn-foreground-2 hover:text-cn-foreground-1'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'traces' && (
        loading ? (
          <div className="text-cn-foreground-2">Loading traces...</div>
        ) : traces.length === 0 ? (
          <div className="text-center py-12 text-cn-foreground-2">No traces found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-cn-foreground-2 border-b border-cn-borders-3">
                  <th className="text-left py-2 px-3">Time</th>
                  <th className="text-left py-2 px-3">Name</th>
                  <th className="text-left py-2 px-3">Model</th>
                  <th className="text-right py-2 px-3">Tokens</th>
                  <th className="text-right py-2 px-3">Latency</th>
                  <th className="text-center py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {traces.map(trace => (
                  <tr
                    key={trace.id}
                    onClick={() => viewTrace(trace.id)}
                    className="border-b border-cn-borders-3 hover:bg-cn-background-2 cursor-pointer"
                  >
                    <td className="py-2 px-3 text-cn-foreground-2">
                      {trace.start_time ? new Date(trace.start_time).toLocaleString() : '-'}
                    </td>
                    <td className="py-2 px-3 text-cn-foreground-1 font-medium">
                      {trace.name || trace.id.slice(0, 12)}
                    </td>
                    <td className="py-2 px-3 text-cn-foreground-2">{trace.model || '-'}</td>
                    <td className="py-2 px-3 text-right text-cn-foreground-2">
                      {trace.total_tokens > 0 ? trace.total_tokens.toLocaleString() : '-'}
                    </td>
                    <td className="py-2 px-3 text-right text-cn-foreground-2">
                      {trace.duration_ms > 0 ? `${trace.duration_ms.toFixed(0)}ms` : '-'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded ${statusColor(trace.status)}`}>
                        {trace.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'detail' && detail && (
        <div>
          <button onClick={() => setTab('traces')} className="text-sm text-cn-brand-primary mb-4 hover:underline">
            &larr; Back to traces
          </button>
          <div className="mb-4 p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
            <h2 className="font-medium text-cn-foreground-1">{detail.name || detail.id}</h2>
            <div className="flex gap-6 mt-2 text-sm text-cn-foreground-2">
              <span>Session: {detail.session_id || '-'}</span>
              <span>Tokens: {detail.total_tokens.toLocaleString()}</span>
              <span>Duration: {detail.duration_ms.toFixed(0)}ms</span>
            </div>
          </div>

          <h3 className="text-sm font-medium text-cn-foreground-2 mb-2">Spans ({detail.spans.length})</h3>
          <div className="space-y-2">
            {detail.spans.map(span => (
              <div key={span.id} className="p-3 bg-cn-background-2 border border-cn-borders-3 rounded flex items-center justify-between">
                <div>
                  <span className="font-medium text-cn-foreground-1 text-sm">{span.name || span.id.slice(0, 12)}</span>
                  {span.model && <span className="ml-2 text-xs text-cn-foreground-2">{span.model}</span>}
                </div>
                <div className="flex gap-4 text-xs text-cn-foreground-2">
                  {(span.tokens_input > 0 || span.tokens_output > 0) && (
                    <span>{span.tokens_input}→{span.tokens_output} tokens</span>
                  )}
                  {span.duration_ms > 0 && <span>{span.duration_ms.toFixed(0)}ms</span>}
                  <span className={`px-2 py-0.5 rounded ${statusColor(span.status)}`}>{span.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'metrics' && (
        <div>
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
                <div className="text-2xl font-semibold text-cn-foreground-1">{stats.total_traces}</div>
                <div className="text-sm text-cn-foreground-2">Total Traces ({stats.period})</div>
              </div>
              <div className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
                <div className="text-2xl font-semibold text-cn-foreground-1">
                  {stats.total_tokens.toLocaleString()}
                </div>
                <div className="text-sm text-cn-foreground-2">Total Tokens</div>
              </div>
              <div className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
                <div className="text-2xl font-semibold text-cn-foreground-1">
                  {stats.avg_latency_ms.toFixed(0)}ms
                </div>
                <div className="text-sm text-cn-foreground-2">Avg Latency</div>
              </div>
              <div className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
                <div className="text-2xl font-semibold text-cn-foreground-1">
                  {(stats.error_rate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-cn-foreground-2">Error Rate</div>
              </div>
              <div className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
                <div className="text-2xl font-semibold text-cn-foreground-1">
                  {stats.p50_latency_ms.toFixed(0)}ms
                </div>
                <div className="text-sm text-cn-foreground-2">P50 Latency</div>
              </div>
              <div className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
                <div className="text-2xl font-semibold text-cn-foreground-1">
                  {stats.p95_latency_ms.toFixed(0)}ms
                </div>
                <div className="text-sm text-cn-foreground-2">P95 Latency</div>
              </div>
              <div className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg col-span-2">
                <div className="text-sm font-medium text-cn-foreground-2 mb-2">Model Breakdown</div>
                {Object.entries(stats.model_breakdown).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(stats.model_breakdown).map(([model, count]) => (
                      <div key={model} className="flex justify-between text-sm">
                        <span className="text-cn-foreground-1">{model}</span>
                        <span className="text-cn-foreground-2">{count} calls</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-cn-foreground-2 text-sm">No data</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-cn-foreground-2">Loading metrics...</div>
          )}
        </div>
      )}
    </div>
  );
}
