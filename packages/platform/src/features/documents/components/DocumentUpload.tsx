/**
 * Document Upload Component
 *
 * Provides drag-and-drop file upload functionality using Canary UI components.
 */

import React, { useCallback, useState, useRef } from 'react';

interface DocumentUploadProps {
  projectUid: string;
  onUploadComplete: () => void;
  onUploadError: (error: string) => void;
}

export function DocumentUpload({
  projectUid,
  onUploadComplete,
  onUploadError,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/v1/projects/${projectUid}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setUploadProgress(`Successfully uploaded: ${result.message || file.name}`);
      setTimeout(() => {
        setUploadProgress('');
        onUploadComplete();
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      setUploadProgress('');
      onUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{
        padding: 'var(--cn-spacing-8)',
        borderRadius: 'var(--cn-rounded-lg)',
        border: `2px dashed ${isDragging ? 'var(--cn-accent-500)' : 'var(--cn-border-default)'}`,
        backgroundColor: isDragging ? 'var(--cn-bg-2)' : 'var(--cn-bg-1)',
        cursor: isUploading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'center' as const,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".txt,.md,.pdf,.html,.doc,.docx"
        disabled={isUploading}
        style={{ display: 'none' }}
        aria-label="Upload document"
      />

      <div
        style={{
          fontSize: '3rem',
          marginBottom: 'var(--cn-spacing-3)',
          color: 'var(--cn-text-3)',
        }}
      >
        📄
      </div>

      {isUploading ? (
        <div>
          <p
            style={{
              fontSize: '1rem',
              fontWeight: 'var(--cn-font-weight-medium)',
              color: 'var(--cn-text-1)',
              marginBottom: 'var(--cn-spacing-2)',
            }}
          >
            {uploadProgress}
          </p>
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'var(--cn-bg-2)',
              borderRadius: 'var(--cn-rounded-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--cn-accent-500)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          <p
            style={{
              fontSize: '1rem',
              fontWeight: 'var(--cn-font-weight-medium)',
              color: 'var(--cn-text-1)',
              marginBottom: 'var(--cn-spacing-1)',
            }}
          >
            {isDragging ? 'Drop file here' : 'Drag & drop or click to upload'}
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--cn-text-3)',
            }}
          >
            Supported formats: TXT, MD, PDF, HTML, DOC, DOCX
          </p>
        </div>
      )}
    </div>
  );
}
