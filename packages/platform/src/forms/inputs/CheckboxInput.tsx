// @ts-nocheck
/**
 * CheckboxInput Component
 *
 * Custom input component for checkbox fields using Canary UI Checkbox component.
 * Extends InputComponent from @harnessio/forms.
 * Supports single checkbox or checkbox group.
 */

import { InputComponent, type InputProps, useController } from '@harnessio/forms';
import { Checkbox, Label } from '@harnessio/ui/components';

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxInputConfig {
  options?: CheckboxOption[]; // For checkbox group
}

export class CheckboxInput extends InputComponent<boolean | string[], CheckboxInputConfig> {
  // Unique type identifier for InputFactory registration
  internalType = 'checkbox';

  // Render the checkbox using Canary UI
  renderComponent(props: InputProps<boolean | string[], CheckboxInputConfig>) {
    const { field, fieldState } = useController({ name: props.path });
    const hasError = !!fieldState.error;
    const { options } = props.inputConfig || {};

    // Single checkbox mode
    if (!options || options.length === 0) {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={props.path}
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
              disabled={props.disabled}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${props.path}-error` : undefined}
            />
            {props.label && (
              <Label
                htmlFor={props.path}
                className="cn-text-foreground-2 cursor-pointer select-none"
              >
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

    // Checkbox group mode
    const selectedValues = Array.isArray(field.value) ? field.value : [];

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      if (checked) {
        field.onChange([...selectedValues, optionValue]);
      } else {
        field.onChange(selectedValues.filter((v) => v !== optionValue));
      }
    };

    return (
      <div className="space-y-2">
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${props.path}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, !!checked)}
                disabled={props.disabled}
                aria-invalid={hasError}
              />
              <Label
                htmlFor={`${props.path}-${option.value}`}
                className="cn-text-foreground-2 cursor-pointer select-none"
              >
                {option.label}
              </Label>
            </div>
          ))}
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
