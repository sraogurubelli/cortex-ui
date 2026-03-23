// @ts-nocheck
/**
 * Documents Table Component
 *
 * Displays documents in a DataTable with sorting, selection, and actions.
 * Uses Canary UI DataTable component.
 */

import React, { useMemo, useState } from 'react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import type { DocumentInfo } from '@cortex/core';

// Note: Uncomment when using Canary components
// import { DataTable, Button, Badge } from '@harnessio/ui';

interface DocumentsTableProps {
  documents: DocumentInfo[];
  onDelete: (docId: string) => void;
  onView?: (doc: DocumentInfo) => void;
}

export function DocumentsTable({ documents, onDelete, onView }: DocumentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<DocumentInfo>[] = useMemo(
    () => [
      {
        accessorKey: 'filename',
        header: 'Filename',
        cell: ({ row }) => (
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontWeight: 'var(--cn-font-weight-medium)',
                color: 'var(--cn-text-1)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.original.filename ?? row.original.id}
            </p>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'content_preview',
        header: 'Preview',
        cell: ({ getValue }) => {
          const preview = getValue() as string | undefined;
          return (
            <p
              style={{
                color: 'var(--cn-text-2)',
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '400px',
              }}
            >
              {preview || 'No preview available'}
            </p>
          );
        },
      },
      {
        accessorKey: 'chunk_count',
        header: 'Chunks',
        cell: ({ getValue }) => {
          const count = getValue() as number | undefined;
          return (
            <span
              style={{
                padding: 'var(--cn-spacing-1) var(--cn-spacing-2)',
                borderRadius: 'var(--cn-rounded-md)',
                backgroundColor: 'var(--cn-bg-2)',
                color: 'var(--cn-text-2)',
                fontSize: '0.75rem',
                fontWeight: 'var(--cn-font-weight-medium)',
              }}
            >
              {count ?? 0}
            </span>
          );
        },
        enableSorting: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: 'var(--cn-spacing-2)' }}>
            {onView && (
              <button
                onClick={() => onView(row.original)}
                style={{
                  padding: 'var(--cn-spacing-1) var(--cn-spacing-3)',
                  borderRadius: 'var(--cn-rounded-md)',
                  border: '1px solid var(--cn-border-default)',
                  backgroundColor: 'var(--cn-bg-0)',
                  color: 'var(--cn-text-1)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                View
              </button>
            )}
            <button
              onClick={() => onDelete(row.original.id)}
              style={{
                padding: 'var(--cn-spacing-1) var(--cn-spacing-3)',
                borderRadius: 'var(--cn-rounded-md)',
                border: '1px solid var(--cn-set-danger-outline-border)',
                backgroundColor: 'var(--cn-bg-0)',
                color: 'var(--cn-set-danger-outline-text)',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onDelete, onView],
  );

  // Placeholder for when DataTable is imported from @harnessio/ui
  return (
    <div
      style={{
        border: '1px solid var(--cn-border-default)',
        borderRadius: 'var(--cn-rounded-md)',
        overflow: 'hidden',
      }}
    >
      {/*
      Uncomment when ready to use Canary DataTable:

      <DataTable
        data={documents}
        columns={columns}
        currentSorting={sorting}
        onSortingChange={setSorting}
        getRowId={(row) => row.id}
        size="normal"
      />
      */}

      {/* Temporary table implementation */}
      <div style={{ padding: 'var(--cn-spacing-4)' }}>
        <p style={{ color: 'var(--cn-text-2)', marginBottom: 'var(--cn-spacing-3)' }}>
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </p>
        {documents.length === 0 ? (
          <p style={{ color: 'var(--cn-text-3)', textAlign: 'center' as const, padding: 'var(--cn-spacing-8)' }}>
            No documents yet. Upload your first document above.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 'var(--cn-spacing-2)' }}>
            {documents.map((doc) => (
              <div
                key={doc.id}
                style={{
                  padding: 'var(--cn-spacing-3)',
                  borderRadius: 'var(--cn-rounded-md)',
                  border: '1px solid var(--cn-border-default)',
                  backgroundColor: 'var(--cn-bg-1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontWeight: 'var(--cn-font-weight-medium)',
                      color: 'var(--cn-text-1)',
                      marginBottom: 'var(--cn-spacing-1)',
                    }}
                  >
                    {doc.filename ?? doc.id}
                  </p>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--cn-text-2)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap' as const,
                    }}
                  >
                    {doc.content_preview || 'No preview available'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--cn-spacing-2)', marginLeft: 'var(--cn-spacing-3)' }}>
                  {onView && (
                    <button
                      onClick={() => onView(doc)}
                      style={{
                        padding: 'var(--cn-spacing-1) var(--cn-spacing-3)',
                        borderRadius: 'var(--cn-rounded-md)',
                        border: '1px solid var(--cn-border-default)',
                        backgroundColor: 'var(--cn-bg-0)',
                        color: 'var(--cn-text-1)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      View
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(doc.id)}
                    style={{
                      padding: 'var(--cn-spacing-1) var(--cn-spacing-3)',
                      borderRadius: 'var(--cn-rounded-md)',
                      border: '1px solid var(--cn-set-danger-outline-border)',
                      backgroundColor: 'var(--cn-bg-0)',
                      color: 'var(--cn-set-danger-outline-text)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
