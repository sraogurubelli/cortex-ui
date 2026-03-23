// @ts-nocheck
/**
 * TextInput Component
 *
 * Custom input component for text fields using Canary UI Input component.
 * Extends InputComponent from @harnessio/forms.
 */

import { InputComponent, type InputProps, useController } from '@harnessio/forms';
import { Input } from '@harnessio/ui/components';

export class TextInput extends InputComponent<string> {
  // Unique type identifier for InputFactory registration
  internalType = 'text';

  // Render the text input using Canary UI
  renderComponent(props: InputProps<string>) {
    const { field, fieldState } = useController({ name: props.path });
    const hasError = !!fieldState.error;

    return (
      <div className="space-y-2">
        <Input
          {...field}
          type={props.inputConfig?.type || 'text'}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={props.readonly}
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
