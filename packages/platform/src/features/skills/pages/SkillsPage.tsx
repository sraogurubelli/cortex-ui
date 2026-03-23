import { useState, useEffect, useCallback } from 'react';
import { apiRequest, useProject } from '@cortex/core';
import type { SkillInfo } from '@cortex/core';

interface AgentSummary {
  uid: string;
  name: string;
}

export function SkillsPage() {
  const [skills, setSkills] = useState<SkillInfo[]>([]);
  const [selected, setSelected] = useState<SkillInfo | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [linkedAgentUids, setLinkedAgentUids] = useState<Set<string>>(new Set());
  const [linkingAgent, setLinkingAgent] = useState<string | null>(null);

  const { currentProject } = useProject();
  const projectUid = currentProject?.id ?? 'default';

  // Upload form
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formContent, setFormContent] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest<SkillInfo[]>('/api/v1/skills');
      setSkills(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const fetchAgents = useCallback(async () => {
    try {
      const data = await apiRequest<AgentSummary[]>(`/api/v1/projects/${projectUid}/agents`);
      setAgents(data);
    } catch {
      // agents endpoint may not exist yet
    }
  }, [projectUid]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const fetchLinkedAgents = useCallback(async (skillUid: string) => {
    const linked = new Set<string>();
    for (const agent of agents) {
      try {
        const agentSkills = await apiRequest<SkillInfo[]>(`/api/v1/agents/${agent.uid}/skills`);
        if (agentSkills.some(s => s.uid === skillUid)) {
          linked.add(agent.uid);
        }
      } catch {
        // ignore
      }
    }
    setLinkedAgentUids(linked);
  }, [agents]);

  useEffect(() => {
    if (selected && agents.length > 0) {
      fetchLinkedAgents(selected.uid);
    } else {
      setLinkedAgentUids(new Set());
    }
  }, [selected, agents, fetchLinkedAgents]);

  const handleToggleAgentLink = async (agentUid: string, skillUid: string) => {
    setLinkingAgent(agentUid);
    try {
      if (linkedAgentUids.has(agentUid)) {
        await apiRequest(`/api/v1/agents/${agentUid}/skills/${skillUid}`, { method: 'DELETE' });
        setLinkedAgentUids(prev => { const next = new Set(prev); next.delete(agentUid); return next; });
      } else {
        await apiRequest(`/api/v1/agents/${agentUid}/skills/${skillUid}`, { method: 'POST' });
        setLinkedAgentUids(prev => new Set(prev).add(agentUid));
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLinkingAgent(null);
    }
  };

  const handleUpload = async () => {
    setSaving(true);
    setError('');
    try {
      await apiRequest('/api/v1/skills', {
        method: 'POST',
        body: JSON.stringify({
          name: formName,
          description: formDesc,
          skill_md_content: formContent,
        }),
      });
      setShowUpload(false);
      setFormName('');
      setFormDesc('');
      setFormContent('');
      await fetchSkills();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (skill: SkillInfo) => {
    try {
      await apiRequest(`/api/v1/skills/${skill.uid}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !skill.enabled }),
      });
      await fetchSkills();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await apiRequest(`/api/v1/skills/${uid}`, { method: 'DELETE' });
      if (selected?.uid === uid) setSelected(null);
      await fetchSkills();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-cn-foreground-1">Skills</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-cn-brand-primary text-white rounded hover:opacity-90 text-sm"
        >
          + Upload Skill
        </button>
      </div>
      {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded">{error}</div>}

      {showUpload && (
        <div className="mb-6 p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg space-y-3">
          <h2 className="font-medium text-cn-foreground-1">Upload New Skill</h2>
          <input
            placeholder="Skill name"
            className="w-full px-3 py-2 bg-cn-background-3 border border-cn-borders-3 rounded text-cn-foreground-1 text-sm"
            value={formName}
            onChange={e => setFormName(e.target.value)}
          />
          <input
            placeholder="Description"
            className="w-full px-3 py-2 bg-cn-background-3 border border-cn-borders-3 rounded text-cn-foreground-1 text-sm"
            value={formDesc}
            onChange={e => setFormDesc(e.target.value)}
          />
          <textarea
            placeholder="Paste SKILL.md content here..."
            className="w-full px-3 py-2 bg-cn-background-3 border border-cn-borders-3 rounded text-cn-foreground-1 font-mono text-sm"
            rows={12}
            value={formContent}
            onChange={e => setFormContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={saving || !formName || !formContent}
              className="px-4 py-2 bg-cn-brand-primary text-white rounded text-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Skill'}
            </button>
            <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-cn-foreground-2 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Skills list */}
        <div className="w-1/3 space-y-2">
          {loading ? (
            <div className="text-cn-foreground-2">Loading skills...</div>
          ) : skills.length === 0 ? (
            <div className="text-center py-8 text-cn-foreground-2">No skills yet</div>
          ) : (
            skills.map(skill => (
              <div
                key={skill.uid}
                onClick={() => setSelected(skill)}
                className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                  selected?.uid === skill.uid
                    ? 'bg-cn-brand-primary/10 border-cn-brand-primary'
                    : 'bg-cn-background-2 border-cn-borders-3 hover:border-cn-borders-4'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-cn-foreground-1 text-sm">{skill.name}</span>
                  <button
                    onClick={e => { e.stopPropagation(); handleToggle(skill); }}
                    className={`text-xs px-2 py-0.5 rounded ${
                      skill.enabled ? 'bg-green-500/10 text-green-400' : 'bg-cn-background-3 text-cn-foreground-2'
                    }`}
                  >
                    {skill.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {skill.description && (
                  <p className="text-xs text-cn-foreground-2 mt-1 truncate">{skill.description}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Skill detail */}
        <div className="flex-1">
          {selected ? (
            <div className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-cn-foreground-1">{selected.name}</h2>
                <button
                  onClick={() => handleDelete(selected.uid)}
                  className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
              {selected.description && (
                <p className="text-sm text-cn-foreground-2 mb-4">{selected.description}</p>
              )}
              <pre className="text-sm text-cn-foreground-1 whitespace-pre-wrap bg-cn-background-3 p-4 rounded font-mono overflow-auto max-h-[400px]">
                {selected.skill_md_content}
              </pre>

              {/* Agent linking */}
              {agents.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-cn-foreground-1 mb-3">Assigned Agents</h3>
                  <div className="flex flex-wrap gap-2">
                    {agents.map(agent => {
                      const isLinked = linkedAgentUids.has(agent.uid);
                      const isLinking = linkingAgent === agent.uid;
                      return (
                        <button
                          key={agent.uid}
                          disabled={isLinking}
                          onClick={() => handleToggleAgentLink(agent.uid, selected.uid)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            isLinked
                              ? 'bg-cn-brand-primary/10 border-cn-brand-primary text-cn-brand-primary'
                              : 'bg-cn-background-3 border-cn-borders-3 text-cn-foreground-2 hover:border-cn-borders-4'
                          } ${isLinking ? 'opacity-50' : ''}`}
                        >
                          {isLinking ? '...' : isLinked ? `✓ ${agent.name}` : agent.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-cn-foreground-2 mt-2">
                    Click to attach or detach this skill from an agent.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-cn-foreground-2">
              Select a skill to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
