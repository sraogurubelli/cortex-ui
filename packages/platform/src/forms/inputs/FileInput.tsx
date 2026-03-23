// @ts-nocheck
/**
 * FileInput Component
 *
 * Custom input component for file uploads with drag-drop support.
 * Extends InputComponent from @harnessio/forms.
 * Features: drag-drop, file type filtering, size limits, multiple files.
 */

import { useCallback, useState } from 'react';
import { InputComponent, type InputProps, useController } from '@harnessio/forms';
import { Button, Text } from '@harnessio/ui/components';

interface FileInputConfig {
  accept?: string; // e.g., '.pdf,.doc,.docx' or 'image/*'
  maxSize?: number; // in bytes
  multiple?: boolean;
  showPreview?: boolean;
}

export class FileInput extends InputComponent<File | File[] | null, FileInputConfig> {
  // Unique type identifier for InputFactory registration
  internalType = 'file';

  // Render the file input with drag-drop
  renderComponent(props: InputProps<File | File[] | null, FileInputConfig>) {
    const { field, fieldState } = useController({ name: props.path });
    const hasError = !!fieldState.error;
    const {
      accept,
      maxSize,
      multiple = false,
      showPreview = true,
    } = props.inputConfig || {};

    const [isDragging, setIsDragging] = useState(false);

    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`;
      }
      if (accept) {
        const acceptedTypes = accept.split(',').map((t) => t.trim());
        const fileExt = `.${file.name.split('.').pop()}`;
        const fileMime = file.type;
        const isAccepted = acceptedTypes.some(
          (type) =>
            type === fileExt ||
            type === fileMime ||
            (type.endsWith('/*') && fileMime.startsWith(type.replace('/*', '')))
        );
        if (!isAccepted) {
          return `File type not accepted. Allowed: ${accept}`;
        }
      }
      return null;
    };

    const handleFiles = (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const errors: string[] = [];

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        }
      }

      if (errors.length > 0) {
        // In a real implementation, you might want to show these errors
        console.error('File validation errors:', errors);
        return;
      }

      if (multiple) {
        field.onChange(fileArray);
      } else {
        field.onChange(fileArray[0] || null);
      }
    };

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (props.disabled || props.readonly) return;

        handleFiles(e.dataTransfer.files);
      },
      [props.disabled, props.readonly]
    );

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

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };

    const handleClear = () => {
      field.onChange(null);
    };

    const files = field.value
      ? Array.isArray(field.value)
        ? field.value
        : [field.value]
      : [];

    return (
      <div className="space-y-2">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragging ? 'border-cn-accent-500 cn-bg-background-2' : 'border-cn-border-default cn-bg-background-1'}
            ${props.disabled || props.readonly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-cn-accent-500'}
          `}
        >
          <input
            type="file"
            id={props.path}
            accept={accept}
            multiple={multiple}
            onChange={handleFileInputChange}
            disabled={props.disabled || props.readonly}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.path}-error` : undefined}
          />

          <div className="pointer-events-none">
            <div className="mb-2">
              <svg
                className="mx-auto h-12 w-12 cn-text-foreground-3"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Text variant="body-normal" className="cn-text-foreground-2">
              <span className="font-medium cn-text-accent-500">Click to upload</span> or drag and
              drop
            </Text>
            {accept && (
              <Text variant="body-normal" className="cn-text-foreground-3 text-xs mt-1">
                {accept}
              </Text>
            )}
            {maxSize && (
              <Text variant="body-normal" className="cn-text-foreground-3 text-xs">
                Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
              </Text>
            )}
          </div>
        </div>

        {showPreview && files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md cn-bg-background-2 border border-cn-border-default"
              >
                <div className="flex-1 min-w-0">
                  <Text variant="body-normal" className="cn-text-foreground-1 truncate">
                    {file.name}
                  </Text>
                  <Text variant="body-normal" className="cn-text-foreground-3 text-xs">
                    {(file.size / 1024).toFixed(1)} KB
                  </Text>
                </div>
                {!props.disabled && !props.readonly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="ml-2"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {hasError && (
          <p
            id={`${props.path}-error`}
            className="text-sm cn-text-destructive-foreground"
            role="alert"
          >
            {fieldState.error.message}
          </p>
        )}
      </div>
    );
  }
}
