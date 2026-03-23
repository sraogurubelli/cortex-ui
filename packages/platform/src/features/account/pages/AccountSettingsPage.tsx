import { useState } from 'react';
import { Button, Text } from '@harnessio/ui/components';
import { SettingsLayout, SettingSection, SettingItem, useAccount, useTheme } from '@cortex/core';

/**
 * AccountSettingsPage - Manage user preferences and settings
 */
export function AccountSettingsPage() {
  const { preferences, updatePreferences, resetPreferences } = useAccount();
  const { theme, setTheme } = useTheme();

  const [success, setSuccess] = useState('');

  const handleThemeChange = (value: any) => {
    setTheme(value);
    updatePreferences({ theme: value });
    setSuccess('Theme preference updated');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLanguageChange = (value: string) => {
    updatePreferences({ language: value });
    setSuccess('Language preference updated');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleTimezoneChange = (value: string) => {
    updatePreferences({ timezone: value });
    setSuccess('Timezone preference updated');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEmailNotificationsChange = (value: boolean) => {
    updatePreferences({ emailNotifications: value });
    setSuccess('Email notification preference updated');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDesktopNotificationsChange = (value: boolean) => {
    updatePreferences({ desktopNotifications: value });
    setSuccess('Desktop notification preference updated');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleReset = () => {
    resetPreferences();
    setSuccess('All preferences reset to defaults');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <SettingsLayout
      title="Account Settings"
      description="Manage your preferences and account settings"
    >
      {/* Success Message */}
      {success && (
        <div className="mb-6 p-3 rounded-md cn-bg-success-1 border cn-border-success-border">
          <Text variant="body-normal" className="cn-text-success-foreground">
            {success}
          </Text>
        </div>
      )}

      {/* Appearance Settings */}
      <SettingSection title="Appearance" description="Customize how the application looks">
        <div className="space-y-1">
          <SettingItem
            key="theme"
            label="Theme"
            description="Choose your preferred color theme"
            type="select"
            value={theme}
            onChange={handleThemeChange}
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ]}
          />
        </div>
      </SettingSection>

      {/* Localization Settings */}
      <SettingSection title="Localization" description="Language and region preferences">
        <div className="space-y-4">
          <SettingItem
            key="language"
            label="Language"
            description="Select your preferred language"
            type="select"
            value={preferences.language}
            onChange={handleLanguageChange}
            options={[
              { label: 'English', value: 'en' },
              { label: 'Spanish', value: 'es' },
              { label: 'French', value: 'fr' },
              { label: 'German', value: 'de' },
            ]}
          />

          <SettingItem
            key="timezone"
            label="Timezone"
            description="Your local timezone"
            type="text"
            value={preferences.timezone}
            onChange={handleTimezoneChange}
            placeholder="UTC"
          />
        </div>
      </SettingSection>

      {/* Notification Settings */}
      <SettingSection title="Notifications" description="Configure how you receive notifications">
        <div className="space-y-4">
          <SettingItem
            key="emailNotifications"
            label="Email Notifications"
            description="Receive notifications via email"
            type="toggle"
            value={preferences.emailNotifications}
            onChange={handleEmailNotificationsChange}
          />

          <SettingItem
            key="desktopNotifications"
            label="Desktop Notifications"
            description="Show desktop notifications in your browser"
            type="toggle"
            value={preferences.desktopNotifications}
            onChange={handleDesktopNotificationsChange}
          />
        </div>
      </SettingSection>

      {/* Reset Settings */}
      <SettingSection title="Reset" description="Reset all preferences to default values">
        <div className="flex items-start justify-between">
          <div>
            <Text variant="body-strong" className="cn-text-foreground-1 mb-1">
              Reset All Preferences
            </Text>
            <Text variant="body-normal" className="cn-text-foreground-3">
              This will reset all your preferences to their default values
            </Text>
          </div>
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </div>
      </SettingSection>
    </SettingsLayout>
  );
}
