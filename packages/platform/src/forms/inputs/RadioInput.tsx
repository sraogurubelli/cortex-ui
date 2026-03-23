// @ts-nocheck
/**
 * RadioInput Component
 *
 * Custom input component for radio button groups using Canary UI Radio component.
 * Extends InputComponent from @harnessio/forms.
 */

import { InputComponent, type InputProps, useController } from '@harnessio/forms';
import { Radio, Label } from '@harnessio/ui/components';

interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

interface RadioInputConfig {
  options: RadioOption[];
  layout?: 'vertical' | 'horizontal';
}

export class RadioInput extends InputComponent<string, RadioInputConfig> {
  // Unique type identifier for InputFactory registration
  internalType = 'radio';

  // Render the radio group using Canary UI
  renderComponent(props: InputProps<string, RadioInputConfig>) {
    const { field, fieldState } = useController({ name: props.path });
    const hasError = !!fieldState.error;
    const { options, layout = 'vertical' } = props.inputConfig || { options: [] };

    const containerClass =
      layout === 'horizontal'
        ? 'flex flex-wrap gap-4'
        : 'space-y-3';

    return (
      <div className="space-y-2">
        <div className={containerClass}>
          {options.map((option) => (
            <div key={option.value} className="flex items-start space-x-2">
              <Radio
                id={`${props.path}-${option.value}`}
                value={option.value}
                checked={field.value === option.value}
                onCheckedChange={() => field.onChange(option.value)}
                disabled={props.disabled}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${props.path}-error` : undefined}
              />
              <div className="flex-1">
                <Label
                  htmlFor={`${props.path}-${option.value}`}
                  className="cn-text-foreground-2 cursor-pointer select-none"
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-xs cn-text-foreground-3 mt-1">{option.description}</p>
                )}
              </div>
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
