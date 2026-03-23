import { Text, Input } from '@harnessio/ui/components';
import type { SettingItemConfig } from './types';

export interface SettingItemProps extends SettingItemConfig {
  actions?: React.ReactNode;
}

/**
 * SettingItem - Individual setting row
 *
 * Renders different input types based on the setting configuration
 */
export function SettingItem({
  label,
  description,
  type,
  value,
  options,
  placeholder,
  disabled,
  required,
  onChange,
  actions,
}: SettingItemProps) {
  const renderInput = () => {
    switch (type) {
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={e => onChange?.(e.target.checked)}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 cn-bg-background-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:cn-bg-brand-primary"></div>
          </label>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={e => onChange?.(e.target.value)}
            disabled={disabled}
            required={required}
            className="px-3 py-2 rounded-md border cn-border-border-1 cn-bg-background-1 cn-text-foreground-1 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={4}
            className="w-full px-3 py-2 rounded-md border cn-border-border-1 cn-bg-background-1 cn-text-foreground-1 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={e => onChange?.(Number(e.target.value))}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
          />
        );

      case 'password':
        return (
          <Input
            type="password"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
          />
        );

      case 'text':
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
          />
        );
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <Text variant="body-strong" className="cn-text-foreground-1 mb-1">
          {label}
          {required && <span className="cn-text-destructive-foreground ml-1">*</span>}
        </Text>
        {description && (
          <Text variant="body-normal" className="cn-text-foreground-3 text-sm">
            {description}
          </Text>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className={type === 'toggle' ? '' : 'w-64'}>{renderInput()}</div>
        {actions}
      </div>
    </div>
  );
}
