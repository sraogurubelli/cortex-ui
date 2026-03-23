import { useState, useEffect, useCallback } from 'react';
import { apiRequest, useProject } from '@cortex/core';

interface DocumentInfo {
  id: string;
  filename: string;
  content_type: string;
  chunks: number;
  created_at: string;
}

interface SearchResult {
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}

type Tab = 'documents' | 'search';

export function MemoryPage() {
  const [tab, setTab] = useState<Tab>('documents');
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Upload
  const [uploading, setUploading] = useState(false);

  const { currentProject } = useProject();
  const projectUid = currentProject?.id ?? 'default';

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest<{ documents: DocumentInfo[] }>(`/api/v1/projects/${projectUid}/documents`);
      setDocuments(data.documents || []);
    } catch (e: any) {
      if (!e.message.includes('404')) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [projectUid]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError('');
    try {
      const data = await apiRequest<{ results: SearchResult[] }>(
        `/api/v1/projects/${projectUid}/search`,
        { method: 'POST', body: JSON.stringify({ query: searchQuery, top_k: 10 }) },
      );
      setSearchResults(data.results || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSearching(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('cortex_auth_token');
      const resp = await fetch(`/api/v1/projects/${projectUid}/documents`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);
      await fetchDocuments();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      await apiRequest(`/api/v1/projects/${projectUid}/documents/${docId}`, { method: 'DELETE' });
      await fetchDocuments();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'documents', label: 'Documents' },
    { key: 'search', label: 'Semantic Search' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cn-foreground-1">Memory & RAG</h1>
        <label className="px-4 py-2 bg-cn-brand-primary text-white rounded hover:opacity-90 text-sm cursor-pointer">
          {uploading ? 'Uploading...' : '+ Upload Document'}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

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

      {tab === 'documents' && (
        loading ? (
          <div className="text-cn-foreground-2">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-cn-foreground-2">
            <p className="text-lg">No documents indexed</p>
            <p className="text-sm mt-2">Upload documents to build a knowledge base for your agents.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-cn-foreground-1">{doc.filename}</h3>
                  <div className="flex gap-4 mt-1 text-xs text-cn-foreground-2">
                    <span>{doc.content_type}</span>
                    {doc.chunks > 0 && <span>{doc.chunks} chunks</span>}
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'search' && (
        <div>
          <div className="flex gap-2 mb-6">
            <input
              placeholder="Search your knowledge base..."
              className="flex-1 px-4 py-2 bg-cn-background-2 border border-cn-borders-3 rounded text-cn-foreground-1"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="px-4 py-2 bg-cn-brand-primary text-white rounded hover:opacity-90 disabled:opacity-50 text-sm"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((result, i) => (
                <div key={i} className="p-4 bg-cn-background-2 border border-cn-borders-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-cn-foreground-2">
                      Score: {(result.score * 100).toFixed(1)}%
                    </span>
                    {!!result.metadata?.source && (
                      <span className="text-xs text-cn-foreground-2">
                        Source: {String(result.metadata.source)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-cn-foreground-1 whitespace-pre-wrap">{String(result.content)}</p>
                </div>
              ))}
            </div>
          ) : searchQuery && !searching ? (
            <div className="text-center py-8 text-cn-foreground-2">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
