/**
 * Settings framework types
 */

export interface SettingsSection {
  id: string;
  label: string;
  icon?: string;
  path: string;
}

export interface SettingsTab {
  id: string;
  label: string;
  sections: SettingsSection[];
}

export type SettingType = 'text' | 'textarea' | 'toggle' | 'select' | 'number' | 'password';

export interface SettingItemConfig {
  key: string;
  label: string;
  description?: string;
  type: SettingType;
  value: any;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: any) => void;
}
