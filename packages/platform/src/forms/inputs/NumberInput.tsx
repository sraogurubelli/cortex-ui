// @ts-nocheck
/**
 * NumberInput Component
 *
 * Custom input component for numeric fields using Canary UI Input with number controls.
 * Extends InputComponent from @harnessio/forms.
 * Features: increment/decrement buttons, min/max constraints, step support.
 */

import { InputComponent, type InputProps, useController } from '@harnessio/forms';
import { Input } from '@harnessio/ui/components';

interface NumberInputConfig {
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  showControls?: boolean;
}

export class NumberInput extends InputComponent<number, NumberInputConfig> {
  // Unique type identifier for InputFactory registration
  internalType = 'number';

  // Render the number input using Canary UI
  renderComponent(props: InputProps<number, NumberInputConfig>) {
    const { field, fieldState } = useController({ name: props.path });
    const hasError = !!fieldState.error;
    const { min, max, step = 1, placeholder, showControls = true } = props.inputConfig || {};

    const handleIncrement = () => {
      const currentValue = Number(field.value) || 0;
      const newValue = currentValue + step;
      if (max === undefined || newValue <= max) {
        field.onChange(newValue);
      }
    };

    const handleDecrement = () => {
      const currentValue = Number(field.value) || 0;
      const newValue = currentValue - step;
      if (min === undefined || newValue >= min) {
        field.onChange(newValue);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '' || value === '-') {
        field.onChange(value);
        return;
      }
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        field.onChange(numValue);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            {...field}
            type="number"
            value={field.value ?? ''}
            onChange={handleInputChange}
            placeholder={placeholder || props.placeholder}
            disabled={props.disabled}
            readOnly={props.readonly}
            min={min}
            max={max}
            step={step}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.path}-error` : undefined}
            className="flex-1"
          />
          {showControls && !props.readonly && !props.disabled && (
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={handleIncrement}
                disabled={max !== undefined && Number(field.value) >= max}
                className="px-2 py-1 text-xs rounded border border-cn-border-default hover:cn-bg-background-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Increment"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={handleDecrement}
                disabled={min !== undefined && Number(field.value) <= min}
                className="px-2 py-1 text-xs rounded border border-cn-border-default hover:cn-bg-background-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrement"
              >
                ▼
              </button>
            </div>
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
