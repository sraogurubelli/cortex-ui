// @ts-nocheck
/**
 * Enhanced DocumentsPage
 *
 * Production-ready document management UI using Canary components.
 * Features:
 * - Drag & drop upload
 * - DataTable with sorting
 * - Document preview modal
 * - Semantic search
 * - Toast notifications
 */

import { useState, useEffect, useCallback } from 'react';
import { useProjectContext } from '@cortex/core';
import type { DocumentInfo, SearchHit } from '@cortex/core';
import { listDocuments, deleteDocument, searchDocuments } from '../api/client';
import { DocumentUpload, DocumentsTable, DocumentPreviewModal } from '../components';
import { Button, Input, AlertDialog } from '@harnessio/ui/components';

const DialogContent = (p: any) => <div {...p} />;
const DialogHeader = (p: any) => <div {...p} />;
const DialogTitle = (p: any) => <div {...p} />;
const DialogBody = (p: any) => <div {...p} />;
const DialogFooter = (p: any) => <div {...p} />;
import { showToast } from '../../../components/ui/toast';

export function DocumentsPageEnhanced() {
  const { currentProject } = useProjectContext();
  const projectUid = currentProject?.id;

  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [searchResults, setSearchResults] = useState<SearchHit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentInfo | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; document: DocumentInfo | null }>({
    isOpen: false,
    document: null
  });

  const refresh = useCallback(async () => {
    if (!projectUid) return;
    try {
      const res = await listDocuments(projectUid);
      setDocuments(res.documents);
    } catch (err) {
      showToast.error('Failed to load documents', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
      console.error('Failed to list documents:', err);
    }
  }, [projectUid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleUploadComplete = () => {
    showToast.success('Document uploaded successfully');
    refresh();
  };

  const handleUploadError = (error: string) => {
    showToast.error('Upload failed', { description: error });
  };

  const handleDeleteClick = (doc: DocumentInfo) => {
    setDeleteConfirm({ isOpen: true, document: doc });
  };

  const handleDeleteConfirm = async () => {
    if (!projectUid || !deleteConfirm.document) return;

    try {
      await deleteDocument(projectUid, deleteConfirm.document.id);
      showToast.success('Document deleted', {
        description: `"${deleteConfirm.document.name}" has been deleted`
      });
      setDeleteConfirm({ isOpen: false, document: null });
      await refresh();
    } catch (err) {
      showToast.error('Failed to delete document', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
      console.error('Delete failed:', err);
    }
  };

  const handleView = (doc: DocumentInfo) => {
    setSelectedDocument(doc);
    setIsPreviewOpen(true);
  };

  const handleSearch = async () => {
    if (!projectUid || !searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchDocuments(projectUid, searchQuery);
      setSearchResults(res.results);
      if (res.results.length === 0) {
        showToast.success('No results found');
      }
    } catch (err) {
      showToast.error('Search failed', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  if (!projectUid) {
    return (
      <div
        style={{
          padding: 'var(--cn-spacing-8)',
          textAlign: 'center' as const,
          color: 'var(--cn-text-3)',
        }}
      >
        <p style={{ fontSize: '1.125rem' }}>Select a project to manage documents.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 'var(--cn-spacing-6)',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 'var(--cn-spacing-8)' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'var(--cn-font-weight-bold)',
            color: 'var(--cn-text-1)',
            marginBottom: 'var(--cn-spacing-2)',
          }}
        >
          Documents
        </h1>
        <p
          style={{
            color: 'var(--cn-text-2)',
            fontSize: '1rem',
          }}
        >
          Upload and manage documents for RAG within {currentProject?.name || 'this project'}.
        </p>
      </div>

      {/* Upload Section */}
      <div style={{ marginBottom: 'var(--cn-spacing-8)' }}>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 'var(--cn-font-weight-semibold)',
            color: 'var(--cn-text-1)',
            marginBottom: 'var(--cn-spacing-4)',
          }}
        >
          Upload Document
        </h2>
        <DocumentUpload
          projectUid={projectUid}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      </div>

      {/* Search Section */}
      <div
        style={{
          marginBottom: 'var(--cn-spacing-8)',
          padding: 'var(--cn-spacing-6)',
          borderRadius: 'var(--cn-rounded-lg)',
          border: '1px solid var(--cn-border-default)',
          backgroundColor: 'var(--cn-bg-1)',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 'var(--cn-font-weight-semibold)',
            color: 'var(--cn-text-1)',
            marginBottom: 'var(--cn-spacing-4)',
          }}
        >
          Semantic Search
        </h2>
        <div style={{ display: 'flex', gap: 'var(--cn-spacing-2)', marginBottom: 'var(--cn-spacing-4)' }}>
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1 }}
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            variant="primary"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 'var(--cn-spacing-3)' }}>
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--cn-font-weight-medium)',
                color: 'var(--cn-text-2)',
              }}
            >
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </h3>
            {searchResults.map((hit, i) => (
              <div
                key={hit.id}
                style={{
                  padding: 'var(--cn-spacing-4)',
                  borderRadius: 'var(--cn-rounded-md)',
                  border: '1px solid var(--cn-border-default)',
                  backgroundColor: 'var(--cn-bg-2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--cn-spacing-2)',
                    fontSize: '0.75rem',
                    color: 'var(--cn-text-3)',
                  }}
                >
                  <span>#{i + 1} · {hit.id}</span>
                  <span>Score: {hit.score.toFixed(3)}</span>
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--cn-text-1)',
                    whiteSpace: 'pre-wrap' as const,
                    lineHeight: 1.6,
                  }}
                >
                  {hit.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 'var(--cn-font-weight-semibold)',
            color: 'var(--cn-text-1)',
            marginBottom: 'var(--cn-spacing-4)',
          }}
        >
          All Documents ({documents.length})
        </h2>
        <DocumentsTable documents={documents} onDelete={handleDeleteClick} onView={handleView} />
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={selectedDocument}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirm.isOpen}
        onOpenChange={(open) => setDeleteConfirm({ isOpen: open, document: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p style={{ color: 'var(--cn-text-default)' }}>
              Are you sure you want to delete "{deleteConfirm.document?.name}"?
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--cn-text-muted)' }}>
              This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ isOpen: false, document: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </AlertDialog>
    </div>
  );
}
