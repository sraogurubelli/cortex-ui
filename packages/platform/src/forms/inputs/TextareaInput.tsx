// @ts-nocheck
/**
 * TextareaInput Component
 *
 * Custom input component for multi-line text using Canary UI Textarea component.
 * Extends InputComponent from @harnessio/forms.
 */

import { InputComponent, type InputProps, useController } from '@harnessio/forms';
import { Textarea } from '@harnessio/ui/components';

export class TextareaInput extends InputComponent<string> {
  // Unique type identifier for InputFactory registration
  internalType = 'textarea';

  // Render the textarea using Canary UI
  renderComponent(props: InputProps<string>) {
    const { field, fieldState } = useController({ name: props.path });
    const hasError = !!fieldState.error;

    return (
      <div className="space-y-2">
        <Textarea
          {...field}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={props.readonly}
          rows={props.inputConfig?.rows || 4}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.path}-error` : undefined}
        />
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
