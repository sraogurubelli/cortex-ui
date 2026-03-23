import { useState, useEffect, useCallback } from 'react';
import { apiRequest, useProject } from '@cortex/core';
import type { AgentDefinition } from '@cortex/core';

const DEFAULT_AGENT: Partial<AgentDefinition> = {
  name: '',
  description: '',
  system_prompt: '',
  model: 'gpt-4o',
  tools: [],
  skills: [],
  middleware: {},
  max_iterations: 25,
  temperature: 0,
};

export function AgentsPage() {
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [selected, setSelected] = useState<AgentDefinition | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(DEFAULT_AGENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { currentProject } = useProject();
  const projectUid = currentProject?.id ?? 'default';

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest<AgentDefinition[]>(`/api/v1/projects/${projectUid}/agents`);
      setAgents(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [projectUid]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const handleCreate = () => {
    setSelected(null);
    setForm({ ...DEFAULT_AGENT });
    setEditing(true);
  };

  const handleEdit = (agent: AgentDefinition) => {
    setSelected(agent);
    setForm({
      name: agent.name,
      description: agent.description,
      system_prompt: agent.system_prompt,
      model: agent.model,
      tools: agent.tools,
      skills: agent.skills,
      middleware: agent.middleware,
      max_iterations: agent.max_iterations,
      temperature: agent.temperature,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (selected) {
        await apiRequest(`/api/v1/agents/${selected.uid}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiRequest(`/api/v1/projects/${projectUid}/agents`, { method: 'POST', body: JSON.stringify(form) });
      }
      setEditing(false);
      await fetchAgents();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm('Delete this agent?')) return;
    try {
      await apiRequest(`/api/v1/agents/${uid}`, { method: 'DELETE' });
      await fetchAgents();
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (editing) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-cn-foreground-1">
            {selected ? 'Edit Agent' : 'Create Agent'}
          </h1>
          <button onClick={() => setEditing(false)} className="text-cn-foreground-2 hover:text-cn-foreground-1">
            Cancel
          </button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cn-foreground-2 mb-1">Name</label>
            <input
              className="w-full px-3 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1"
              value={form.name || ''}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cn-foreground-2 mb-1">Description</label>
            <input
              className="w-full px-3 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1"
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cn-foreground-2 mb-1">Model</label>
            <select
              className="w-full px-3 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1"
              value={form.model || 'gpt-4o'}
              onChange={e => setForm({ ...form, model: e.target.value })}
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cn-foreground-2 mb-1">System Prompt</label>
            <textarea
              className="w-full px-3 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1 font-mono text-sm"
              rows={8}
              value={form.system_prompt || ''}
              onChange={e => setForm({ ...form, system_prompt: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cn-foreground-2 mb-1">Max Iterations</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1"
                value={form.max_iterations || 25}
                onChange={e => setForm({ ...form, max_iterations: parseInt(e.target.value) || 25 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cn-foreground-2 mb-1">Temperature</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="2"
                className="w-full px-3 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1"
                value={form.temperature || 0}
                onChange={e => setForm({ ...form, temperature: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-cn-foreground-2 mb-1">
              Tools (comma-separated names)
            </label>
            <input
              className="w-full px-3 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1"
              value={(form.tools || []).join(', ')}
              onChange={e => setForm({ ...form, tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !form.name}
            className="px-4 py-2 bg-cn-brand-primary text-white rounded hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : selected ? 'Update Agent' : 'Create Agent'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-cn-foreground-1">Agents</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-cn-brand-primary text-white rounded hover:opacity-90"
        >
          + Create Agent
        </button>
      </div>
      {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded">{error}</div>}
      {loading ? (
        <div className="text-cn-foreground-2">Loading agents...</div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12 text-cn-foreground-2">
          <p className="text-lg">No agents configured yet</p>
          <p className="text-sm mt-2">Create an agent to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {agents.map(agent => (
            <div
              key={agent.uid}
              className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-cn-foreground-1">{agent.name}</h3>
                <p className="text-sm text-cn-foreground-2">{agent.description || 'No description'}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-cn-background-3 rounded text-cn-foreground-2">
                    {agent.model}
                  </span>
                  {agent.enabled ? (
                    <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded">Active</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded">Disabled</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(agent)}
                  className="px-3 py-1 text-sm bg-cn-background-3 rounded hover:bg-cn-background-4 text-cn-foreground-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(agent.uid)}
                  className="px-3 py-1 text-sm bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
