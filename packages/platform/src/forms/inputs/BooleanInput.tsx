// @ts-nocheck
/**
 * BooleanInput Component
 *
 * Custom input component for boolean/toggle fields using Canary UI Switch component.
 * Extends InputComponent from @harnessio/forms.
 */

import { InputComponent, type InputProps, useController } from '@harnessio/forms';
import { Switch, Label } from '@harnessio/ui/components';

export class BooleanInput extends InputComponent<boolean> {
  // Unique type identifier for InputFactory registration
  internalType = 'boolean';

  // Render the switch using Canary UI
  renderComponent(props: InputProps<boolean>) {
    const { field, fieldState } = useController({ name: props.path });
    const hasError = !!fieldState.error;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id={props.path}
            checked={field.value || false}
            onCheckedChange={field.onChange}
            disabled={props.disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.path}-error` : undefined}
          />
          {props.label && (
            <Label htmlFor={props.path} className="cn-text-foreground-2">
              {props.label}
            </Label>
          )}
        </div>
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
