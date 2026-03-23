import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@cortex/core';
import type { ModelCapabilityInfo, ProviderInfo, TestModelResponse } from '@cortex/core';

type Tab = 'models' | 'providers' | 'playground';

export function ModelsPage() {
  const [tab, setTab] = useState<Tab>('models');
  const [models, setModels] = useState<ModelCapabilityInfo[]>([]);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Playground state
  const [pgModel, setPgModel] = useState('gpt-4o');
  const [pgPrompt, setPgPrompt] = useState('');
  const [pgResult, setPgResult] = useState('');
  const [pgLatency, setPgLatency] = useState(0);
  const [pgRunning, setPgRunning] = useState(false);

  // Provider form (add/edit)
  const [showProvForm, setShowProvForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ProviderInfo | null>(null);
  const [provForm, setProvForm] = useState({ name: '', provider_type: 'openai', api_key: '', base_url: '' });

  const fetchModels = useCallback(async () => {
    try {
      const data = await apiRequest<ModelCapabilityInfo[]>('/api/v1/models');
      setModels(data);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const fetchProviders = useCallback(async () => {
    try {
      const data = await apiRequest<ProviderInfo[]>('/api/v1/models/providers');
      setProviders(data);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchModels(), fetchProviders()]).finally(() => setLoading(false));
  }, [fetchModels, fetchProviders]);

  const healthColor = (status: string) => {
    if (status === 'healthy') return 'text-green-400 bg-green-500/10';
    if (status === 'degraded') return 'text-yellow-400 bg-yellow-500/10';
    if (status === 'unhealthy') return 'text-red-400 bg-red-500/10';
    return 'text-cn-foreground-2 bg-cn-background-3';
  };

  const capBadge = (label: string, active: boolean) =>
    active ? (
      <span className="text-xs px-2 py-0.5 bg-cn-brand-primary/10 text-cn-brand-primary rounded">{label}</span>
    ) : null;

  const handleTestModel = async () => {
    setPgRunning(true);
    setPgResult('');
    try {
      const data = await apiRequest<TestModelResponse>(
        '/api/v1/models/test',
        { method: 'POST', body: JSON.stringify({ model: pgModel, prompt: pgPrompt }) },
      );
      setPgResult(data.success ? data.response : `Error: ${data.error}`);
      setPgLatency(data.latency_ms);
    } catch (e: any) {
      setPgResult(`Error: ${e.message}`);
    } finally {
      setPgRunning(false);
    }
  };

  const handleSaveProvider = async () => {
    try {
      if (editingProvider) {
        await apiRequest(`/api/v1/models/providers/${editingProvider.uid}`, {
          method: 'PUT',
          body: JSON.stringify(provForm),
        });
      } else {
        await apiRequest('/api/v1/models/providers', { method: 'POST', body: JSON.stringify(provForm) });
      }
      setShowProvForm(false);
      setEditingProvider(null);
      setProvForm({ name: '', provider_type: 'openai', api_key: '', base_url: '' });
      await fetchProviders();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEditProvider = (provider: ProviderInfo) => {
    setEditingProvider(provider);
    setProvForm({
      name: provider.name,
      provider_type: provider.provider_type,
      api_key: '',
      base_url: provider.base_url,
    });
    setShowProvForm(true);
  };

  const handleDeleteProvider = async (uid: string) => {
    if (!confirm('Remove this provider?')) return;
    try {
      await apiRequest(`/api/v1/models/providers/${uid}`, { method: 'DELETE' });
      await fetchProviders();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'models', label: 'Models' },
    { key: 'providers', label: 'Providers' },
    { key: 'playground', label: 'Playground' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-cn-foreground-1 mb-4">Models & Providers</h1>
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

      {loading ? (
        <div className="text-cn-foreground-2">Loading...</div>
      ) : tab === 'models' ? (
        <div className="grid gap-3">
          {models.map(m => (
            <div key={m.name} className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-cn-foreground-1">{m.name}</h3>
                  <span className="text-xs text-cn-foreground-2">{m.provider}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {capBadge('Tools', m.supports_tools)}
                  {capBadge('Vision', m.supports_vision)}
                  {capBadge('Streaming', m.supports_streaming)}
                  {capBadge('Reasoning', m.supports_reasoning)}
                  {m.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-cn-background-3 text-cn-foreground-2 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-xs text-cn-foreground-2">
                <span>Context: {(m.context_window / 1000).toFixed(0)}k</span>
                <span>Max output: {(m.max_output_tokens / 1000).toFixed(0)}k</span>
              </div>
            </div>
          ))}
        </div>
      ) : tab === 'providers' ? (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingProvider(null);
                setProvForm({ name: '', provider_type: 'openai', api_key: '', base_url: '' });
                setShowProvForm(true);
              }}
              className="px-4 py-2 bg-cn-brand-primary text-white rounded hover:opacity-90 text-sm"
            >
              + Add Provider
            </button>
          </div>
          {showProvForm && (
            <div className="mb-4 p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg space-y-3">
              <h3 className="text-sm font-medium text-cn-foreground-1">
                {editingProvider ? 'Edit Provider' : 'Add Provider'}
              </h3>
              <input
                placeholder="Name"
                className="w-full px-3 py-2 bg-cn-background-3 border border-cn-borders-3 rounded text-cn-foreground-1 text-sm"
                value={provForm.name}
                onChange={e => setProvForm({ ...provForm, name: e.target.value })}
              />
              <select
                className="w-full px-3 py-2 bg-cn-background-3 border border-cn-borders-3 rounded text-cn-foreground-1 text-sm"
                value={provForm.provider_type}
                onChange={e => setProvForm({ ...provForm, provider_type: e.target.value })}
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
                <option value="azure">Azure OpenAI</option>
                <option value="custom">Custom</option>
              </select>
              <input
                placeholder={editingProvider ? 'API Key (leave blank to keep current)' : 'API Key'}
                type="password"
                className="w-full px-3 py-2 bg-cn-background-3 border border-cn-borders-3 rounded text-cn-foreground-1 text-sm"
                value={provForm.api_key}
                onChange={e => setProvForm({ ...provForm, api_key: e.target.value })}
              />
              <input
                placeholder="Base URL (optional)"
                className="w-full px-3 py-2 bg-cn-background-3 border border-cn-borders-3 rounded text-cn-foreground-1 text-sm"
                value={provForm.base_url}
                onChange={e => setProvForm({ ...provForm, base_url: e.target.value })}
              />
              <div className="flex gap-2">
                <button onClick={handleSaveProvider} className="px-4 py-2 bg-cn-brand-primary text-white rounded text-sm">
                  {editingProvider ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={() => { setShowProvForm(false); setEditingProvider(null); }}
                  className="px-4 py-2 text-cn-foreground-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {providers.length === 0 ? (
            <div className="text-center py-12 text-cn-foreground-2">No providers configured</div>
          ) : (
            <div className="grid gap-3">
              {providers.map(p => (
                <div key={p.uid} className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-cn-foreground-1">{p.name}</h3>
                    <span className="text-xs text-cn-foreground-2">{p.provider_type}</span>
                    {p.base_url && <span className="text-xs text-cn-foreground-3 ml-2">{p.base_url}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${healthColor(p.health_status)}`}>
                      {p.health_status} {p.health_latency_ms > 0 && `(${p.health_latency_ms.toFixed(0)}ms)`}
                    </span>
                    <button
                      onClick={() => handleEditProvider(p)}
                      className="px-3 py-1 text-xs bg-cn-background-3 text-cn-foreground-1 rounded hover:bg-cn-background-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(p.uid)}
                      className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-cn-foreground-2 mb-1">Model</label>
            <select
              className="w-full px-3 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1"
              value={pgModel}
              onChange={e => setPgModel(e.target.value)}
            >
              {models.map(m => (
                <option key={m.name} value={m.name}>{m.name} ({m.provider})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cn-foreground-2 mb-1">Prompt</label>
            <textarea
              className="w-full px-3 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1"
              rows={4}
              value={pgPrompt}
              onChange={e => setPgPrompt(e.target.value)}
              placeholder="Enter a test prompt..."
            />
          </div>
          <button
            onClick={handleTestModel}
            disabled={pgRunning || !pgPrompt}
            className="px-4 py-2 bg-cn-brand-primary text-white rounded hover:opacity-90 disabled:opacity-50"
          >
            {pgRunning ? 'Running...' : 'Test'}
          </button>
          {pgResult && (
            <div className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded">
              <div className="text-xs text-cn-foreground-2 mb-2">Latency: {pgLatency.toFixed(0)}ms</div>
              <pre className="text-sm text-cn-foreground-1 whitespace-pre-wrap">{pgResult}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
