// @ts-nocheck
/**
 * Enhanced AccountSettingsPage
 *
 * User preferences and account settings using @harnessio/forms package with Zod validation.
 * Features:
 * - Type-safe form handling with React Hook Form
 * - Zod schema validation
 * - Custom Canary UI input components
 * - Unified form state management
 * - Success/error notifications
 */

import { useState, useEffect } from 'react';
import { Button, Text } from '@harnessio/ui/components';
import { SettingsLayout, SettingSection, useAccount, useTheme } from '@cortex/core';
import {
  RootForm,
  RenderForm,
  collectDefaultValues,
  useZodValidationResolver,
  type RootFormChildrenRendererType,
} from '../../../forms';
import { inputFactory } from '../../../forms/input-factory';
import { settingsFormDefinition, type SettingsFormData } from '../forms/settings-form';

/**
 * AccountSettingsPage - Manage user preferences and settings with form validation
 */
export function AccountSettingsPageEnhanced() {
  const { preferences, updatePreferences, resetPreferences } = useAccount();
  const { theme, setTheme } = useTheme();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Create validation resolver from form definition
  const resolver = useZodValidationResolver(settingsFormDefinition, {
    requiredMessage: 'This field is required',
  });

  // Collect default values from form definition and merge with user preferences
  const defaultValues: SettingsFormData = {
    ...collectDefaultValues(settingsFormDefinition.inputs),
    theme: theme || 'system',
    language: preferences.language || 'en',
    timezone: preferences.timezone || 'UTC',
    emailNotifications: preferences.emailNotifications ?? true,
    desktopNotifications: preferences.desktopNotifications ?? false,
  };

  const handleSubmit = async (values: SettingsFormData) => {
    setError('');
    setSuccess('');

    try {
      // Update theme separately (uses theme context)
      if (values.theme !== theme) {
        setTheme(values.theme as any);
      }

      // Update all preferences
      updatePreferences({
        theme: values.theme,
        language: values.language,
        timezone: values.timezone,
        emailNotifications: values.emailNotifications,
        desktopNotifications: values.desktopNotifications,
      });

      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Settings update error:', err);
      setTimeout(() => setError(''), 3000);
    }
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
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-3 rounded-md cn-bg-success-1 border cn-border-success-border">
          <Text variant="body-normal" className="cn-text-success-foreground">
            {success}
          </Text>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-md cn-bg-destructive-1 border cn-border-destructive-border">
          <Text variant="body-normal" className="cn-text-destructive-foreground">
            {error}
          </Text>
        </div>
      )}

      <RootForm
        defaultValues={defaultValues}
        resolver={resolver}
        onSubmit={handleSubmit}
        mode="onSubmit"
        validateAfterFirstSubmit={true}
      >
        {(rootForm: RootFormChildrenRendererType<SettingsFormData>) => (
          <div className="space-y-6">
            {/* Appearance Settings */}
            <SettingSection title="Appearance" description="Customize how the application looks">
              <div className="space-y-4">
                <RenderForm
                  factory={inputFactory}
                  formDefinition={{
                    inputs: [settingsFormDefinition.inputs[0]], // theme
                  }}
                />
              </div>
            </SettingSection>

            {/* Localization Settings */}
            <SettingSection title="Localization" description="Language and region preferences">
              <div className="space-y-4">
                <RenderForm
                  factory={inputFactory}
                  formDefinition={{
                    inputs: [
                      settingsFormDefinition.inputs[1], // language
                      settingsFormDefinition.inputs[2], // timezone
                    ],
                  }}
                />
              </div>
            </SettingSection>

            {/* Notification Settings */}
            <SettingSection
              title="Notifications"
              description="Configure how you receive notifications"
            >
              <div className="space-y-4">
                <RenderForm
                  factory={inputFactory}
                  formDefinition={{
                    inputs: [
                      settingsFormDefinition.inputs[3], // emailNotifications
                      settingsFormDefinition.inputs[4], // desktopNotifications
                    ],
                  }}
                />
              </div>
            </SettingSection>

            {/* Action Buttons */}
            <SettingSection
              title="Actions"
              description="Save your changes or reset to defaults"
            >
              <div className="flex items-center gap-3">
                <Button type="button" variant="primary" onClick={() => rootForm.submitForm()}>
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset to Defaults
                </Button>
              </div>
            </SettingSection>
          </div>
        )}
      </RootForm>
    </SettingsLayout>
  );
}
