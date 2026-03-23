/**
 * PromptsPage — UI for viewing, editing, and testing prompt templates
 * registered in the cortex-ai PromptRegistry.
 */

import { useEffect, useState, useCallback } from 'react';
import { apiRequest } from '@cortex/core';

interface PromptInfo {
  key: string;
  template: string;
}

export function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editTemplate, setEditTemplate] = useState('');
  const [testVars, setTestVars] = useState('{}');
  const [rendered, setRendered] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPrompts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ prompts: PromptInfo[]; total: number }>(
        '/api/v1/prompts',
      );
      setPrompts(res.prompts);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const selectPrompt = (key: string) => {
    const prompt = prompts.find(p => p.key === key);
    if (prompt) {
      setSelectedKey(key);
      setEditTemplate(prompt.template);
      setRendered(null);
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!selectedKey) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await apiRequest<PromptInfo>(`/api/v1/prompts/${selectedKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: editTemplate }),
      });
      setPrompts(prev =>
        prev.map(p => (p.key === updated.key ? updated : p)),
      );
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleTestRender = async () => {
    if (!selectedKey) return;
    try {
      setError(null);
      let variables: Record<string, unknown> = {};
      try {
        variables = JSON.parse(testVars);
      } catch {
        setError('Invalid JSON in test variables');
        return;
      }
      const res = await apiRequest<{ rendered: string }>(
        `/api/v1/prompts/${selectedKey}/render`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template: editTemplate, variables }),
        },
      );
      setRendered(res.rendered);
    } catch (err) {
      setError(String(err));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cn-brand-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar — prompt list */}
      <div className="w-64 border-r border-cn-border-border-1 bg-cn-bg-background-1 overflow-y-auto">
        <div className="p-4 border-b border-cn-border-border-1">
          <h2 className="text-sm font-semibold text-cn-text-foreground-1">Prompt Templates</h2>
          <p className="text-xs text-cn-text-foreground-3 mt-1">{prompts.length} registered</p>
        </div>
        <div className="p-2">
          {prompts.map(p => (
            <button
              key={p.key}
              onClick={() => selectPrompt(p.key)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedKey === p.key
                  ? 'bg-cn-bg-background-3 text-cn-text-foreground-1 font-medium'
                  : 'text-cn-text-foreground-2 hover:bg-cn-bg-background-2'
              }`}
            >
              {p.key}
            </button>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 min-w-0 flex flex-col">
        {selectedKey ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cn-border-border-1">
              <div>
                <h2 className="text-lg font-semibold text-cn-text-foreground-1">
                  {selectedKey}
                </h2>
                <p className="text-xs text-cn-text-foreground-3">
                  Edit the Jinja2 template below. Changes persist for the server lifetime.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleTestRender}
                  className="px-3 py-1.5 text-sm rounded border border-cn-border-border-1 hover:bg-cn-bg-background-2 text-cn-text-foreground-2 transition-colors"
                >
                  Test Render
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-1.5 text-sm rounded bg-cn-brand-primary text-white hover:opacity-90 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Template editor and test panel */}
            <div className="flex-1 flex overflow-hidden">
              {/* Editor */}
              <div className="flex-1 flex flex-col p-4">
                <label className="text-xs font-medium text-cn-text-foreground-3 mb-2">
                  Template (Jinja2)
                </label>
                <textarea
                  value={editTemplate}
                  onChange={e => setEditTemplate(e.target.value)}
                  className="flex-1 w-full p-3 font-mono text-sm bg-cn-bg-background-2 border border-cn-border-border-1 rounded text-cn-text-foreground-1 resize-none focus:outline-none focus:ring-2 focus:ring-cn-brand-primary"
                  spellCheck={false}
                />
              </div>

              {/* Test panel */}
              <div className="w-80 border-l border-cn-border-border-1 flex flex-col p-4">
                <label className="text-xs font-medium text-cn-text-foreground-3 mb-2">
                  Test Variables (JSON)
                </label>
                <textarea
                  value={testVars}
                  onChange={e => setTestVars(e.target.value)}
                  className="h-32 w-full p-3 font-mono text-sm bg-cn-bg-background-2 border border-cn-border-border-1 rounded text-cn-text-foreground-1 resize-none focus:outline-none focus:ring-2 focus:ring-cn-brand-primary"
                  spellCheck={false}
                  placeholder='{"agent_name": "assistant"}'
                />

                {rendered !== null && (
                  <div className="mt-4">
                    <label className="text-xs font-medium text-cn-text-foreground-3 mb-2 block">
                      Rendered Output
                    </label>
                    <pre className="p-3 text-sm bg-cn-bg-background-2 border border-cn-border-border-1 rounded text-cn-text-foreground-1 whitespace-pre-wrap overflow-y-auto max-h-64">
                      {rendered}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <p className="text-cn-text-foreground-2 text-lg mb-2">Select a prompt</p>
              <p className="text-cn-text-foreground-3 text-sm">
                Choose a prompt template from the sidebar to view and edit it.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
