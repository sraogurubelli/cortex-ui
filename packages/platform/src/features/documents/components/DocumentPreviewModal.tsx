// @ts-nocheck
/**
 * Document Preview Modal
 *
 * Displays document content in a modal dialog.
 * Uses Canary UI Dialog component.
 */

import React from 'react';
import type { DocumentInfo } from '@cortex/core';

interface DocumentPreviewModalProps {
  document: DocumentInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentPreviewModal({
  document,
  isOpen,
  onClose,
}: DocumentPreviewModalProps) {
  if (!isOpen || !document) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed' as const,
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50,
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: 'fixed' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51,
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          backgroundColor: 'var(--cn-bg-0)',
          borderRadius: 'var(--cn-rounded-lg)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column' as const,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--cn-spacing-6)',
            borderBottom: '1px solid var(--cn-border-default)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            id="modal-title"
            style={{
              fontSize: '1.25rem',
              fontWeight: 'var(--cn-font-weight-semibold)',
              color: 'var(--cn-text-1)',
            }}
          >
            {document.filename ?? document.id}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              padding: 'var(--cn-spacing-2)',
              borderRadius: 'var(--cn-rounded-md)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--cn-text-2)',
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto' as const,
            padding: 'var(--cn-spacing-6)',
          }}
        >
          <div style={{ marginBottom: 'var(--cn-spacing-4)' }}>
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--cn-font-weight-medium)',
                color: 'var(--cn-text-3)',
                marginBottom: 'var(--cn-spacing-2)',
              }}
            >
              Document ID
            </h3>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: 'var(--cn-text-2)',
                padding: 'var(--cn-spacing-2)',
                backgroundColor: 'var(--cn-bg-2)',
                borderRadius: 'var(--cn-rounded-md)',
              }}
            >
              {document.id}
            </p>
          </div>

          {document.chunk_count !== undefined && (
            <div style={{ marginBottom: 'var(--cn-spacing-4)' }}>
              <h3
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 'var(--cn-font-weight-medium)',
                  color: 'var(--cn-text-3)',
                  marginBottom: 'var(--cn-spacing-2)',
                }}
              >
                Chunks
              </h3>
              <p style={{ color: 'var(--cn-text-2)' }}>{document.chunk_count}</p>
            </div>
          )}

          <div>
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 'var(--cn-font-weight-medium)',
                color: 'var(--cn-text-3)',
                marginBottom: 'var(--cn-spacing-2)',
              }}
            >
              Preview
            </h3>
            <div
              style={{
                padding: 'var(--cn-spacing-4)',
                backgroundColor: 'var(--cn-bg-2)',
                borderRadius: 'var(--cn-rounded-md)',
                border: '1px solid var(--cn-border-default)',
                color: 'var(--cn-text-1)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap' as const,
                fontFamily: 'monospace',
              }}
            >
              {document.content_preview || 'No preview available'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--cn-spacing-6)',
            borderTop: '1px solid var(--cn-border-default)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: 'var(--cn-spacing-2) var(--cn-spacing-4)',
              borderRadius: 'var(--cn-rounded-md)',
              border: '1px solid var(--cn-border-default)',
              backgroundColor: 'var(--cn-bg-1)',
              color: 'var(--cn-text-1)',
              fontWeight: 'var(--cn-font-weight-medium)',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
