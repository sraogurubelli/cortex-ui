/**
 * DocumentsPage – Upload, list, search documents within a project
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useProjectContext } from '@cortex/core';
import type { DocumentInfo, SearchHit } from '@cortex/core';
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  searchDocuments,
} from '../api/client';

export function DocumentsPage() {
  const { currentProject } = useProjectContext();
  const projectUid = currentProject?.id;

  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [searchResults, setSearchResults] = useState<SearchHit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    if (!projectUid) return;
    try {
      const res = await listDocuments(projectUid);
      setDocuments(res.documents);
    } catch (err) {
      console.error('Failed to list documents:', err);
    }
  }, [projectUid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectUid) return;

    setIsUploading(true);
    setUploadMessage('');
    try {
      const res = await uploadDocument(projectUid, file);
      setUploadMessage(res.message);
      await refresh();
    } catch (err) {
      setUploadMessage(`Upload failed: ${String(err)}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (docId: string) => {
    if (!projectUid) return;
    try {
      await deleteDocument(projectUid, docId);
      await refresh();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSearch = async () => {
    if (!projectUid || !searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchDocuments(projectUid, searchQuery);
      setSearchResults(res.results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  if (!projectUid) {
    return (
      <div className="p-8 text-center text-cn-text-foreground-3">
        Select a project to manage documents.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-cn-text-foreground-1">Documents</h1>
        <p className="mt-1 text-cn-text-foreground-3">
          Upload, manage, and search documents for RAG within this project.
        </p>
      </div>

      {/* Upload section */}
      <div className="p-4 rounded-lg border border-cn-border-border-1 bg-cn-bg-background-1 space-y-3">
        <h2 className="text-lg font-medium text-cn-text-foreground-1">Upload document</h2>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.pdf,.html"
            onChange={handleUpload}
            disabled={isUploading}
            className="block text-sm text-cn-text-foreground-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-cn-brand-primary file:text-white hover:file:opacity-90 disabled:opacity-50"
          />
          {isUploading && (
            <span className="text-sm text-cn-text-foreground-3 animate-pulse">Uploading...</span>
          )}
        </div>
        {uploadMessage && (
          <p className="text-sm text-cn-text-foreground-2">{uploadMessage}</p>
        )}
      </div>

      {/* Search section */}
      <div className="p-4 rounded-lg border border-cn-border-border-1 bg-cn-bg-background-1 space-y-3">
        <h2 className="text-lg font-medium text-cn-text-foreground-1">Semantic search</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-3 py-2 rounded border border-cn-border-border-1 bg-cn-bg-background-2 text-cn-text-foreground-1 placeholder:text-cn-text-foreground-3 focus:outline-none focus:ring-2 focus:ring-cn-brand-primary"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 rounded bg-cn-brand-primary text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2 mt-3">
            {searchResults.map((hit, i) => (
              <div
                key={hit.id}
                className="p-3 rounded border border-cn-border-border-1 bg-cn-bg-background-2"
              >
                <div className="flex justify-between text-xs text-cn-text-foreground-3 mb-1">
                  <span>#{i + 1} &middot; {hit.id}</span>
                  <span>Score: {hit.score.toFixed(3)}</span>
                </div>
                <p className="text-sm text-cn-text-foreground-1 whitespace-pre-wrap line-clamp-4">
                  {hit.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document list */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium text-cn-text-foreground-1">
          All documents ({documents.length})
        </h2>

        {documents.length === 0 ? (
          <p className="text-cn-text-foreground-3">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded border border-cn-border-border-1 bg-cn-bg-background-1"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-cn-text-foreground-1 truncate">
                    {doc.filename ?? doc.id}
                  </p>
                  <p className="text-xs text-cn-text-foreground-3 truncate">
                    {doc.content_preview}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="ml-3 px-3 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
