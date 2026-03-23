// @ts-nocheck
/**
 * SelectInput Component
 *
 * Custom input component for select dropdowns using Canary UI Select component.
 * Extends InputComponent from @harnessio/forms.
 */

import { InputComponent, type InputProps, useController } from '@harnessio/forms';
import { Select } from '@harnessio/ui/components';

const SelectTrigger = (p: any) => <div {...p} />;
const SelectValue = (p: any) => <span {...p} />;
const SelectContent = (p: any) => <div {...p} />;
const SelectItem = (p: any) => <div role="option" {...p} />;

interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputConfig {
  options: SelectOption[];
  placeholder?: string;
}

export class SelectInput extends InputComponent<string, SelectInputConfig> {
  // Unique type identifier for InputFactory registration
  internalType = 'select';

  // Render the select using Canary UI
  renderComponent(props: InputProps<string, SelectInputConfig>) {
    const { field, fieldState } = useController({ name: props.path });
    const hasError = !!fieldState.error;
    const { options = [], placeholder } = props.inputConfig || {};

    return (
      <div className="space-y-2">
        <Select
          value={field.value}
          onValueChange={field.onChange}
          disabled={props.disabled}
        >
          <SelectTrigger
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.path}-error` : undefined}
          >
            <SelectValue placeholder={placeholder || props.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
