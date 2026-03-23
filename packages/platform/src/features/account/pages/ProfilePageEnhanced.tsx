// @ts-nocheck
/**
 * Enhanced ProfilePage
 *
 * User profile management using @harnessio/forms package with Zod validation.
 * Features:
 * - Type-safe form handling with React Hook Form
 * - Zod schema validation
 * - Custom Canary UI input components
 * - Success/error notifications
 * - Avatar preview
 */

import { useState } from 'react';
import { Button, Text, Avatar } from '@harnessio/ui/components';
import { SettingsLayout, SettingSection, useAuth } from '@cortex/core';
import {
  RootForm,
  RenderForm,
  collectDefaultValues,
  useZodValidationResolver,
  type RootFormChildrenRendererType,
} from '../../../forms';
import { inputFactory } from '../../../forms/input-factory';
import { profileFormDefinition, type ProfileFormData } from '../forms';

/**
 * ProfilePage - View and edit user profile with form validation
 */
export function ProfilePageEnhanced() {
  const { user, updateUser } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Create validation resolver from form definition
  const resolver = useZodValidationResolver(profileFormDefinition, {
    requiredMessage: 'This field is required',
  });

  // Collect default values from form definition and merge with user data
  const defaultValues: ProfileFormData = {
    ...collectDefaultValues(profileFormDefinition.inputs),
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  };

  const handleSubmit = async (values: ProfileFormData) => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      // Update user in auth context
      updateUser({
        name: values.name,
        email: values.email,
        avatar: values.avatar || undefined,
      });

      // In a real app, you would call an API here
      // await updateUserProfile(values);

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen cn-bg-background-1">
        <Text variant="body-normal" className="cn-text-foreground-3">
          Please sign in to view your profile
        </Text>
      </div>
    );
  }

  return (
    <SettingsLayout title="Profile" description="Manage your personal information">
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

      {/* Profile Information */}
      <SettingSection title="Profile Information" description="Update your personal details">
        <RootForm
          defaultValues={defaultValues}
          resolver={resolver}
          onSubmit={handleSubmit}
          mode="onSubmit"
          validateAfterFirstSubmit={true}
        >
          {(rootForm: RootFormChildrenRendererType<ProfileFormData>) => {
            const formValues = rootForm.watch();

            return (
              <div className="space-y-6">
                {/* Avatar Preview */}
                <div className="flex items-center gap-6 p-4 rounded-md cn-bg-background-2 border cn-border-default">
                  <Avatar src={formValues.avatar} name={formValues.name} size="lg" />
                  <div className="flex-1">
                    <Text variant="body-strong" className="cn-text-foreground-1 mb-1">
                      Avatar Preview
                    </Text>
                    <Text variant="body-normal" className="cn-text-foreground-3 text-sm">
                      {formValues.avatar
                        ? 'Using custom avatar URL'
                        : 'Using auto-generated avatar based on initials'}
                    </Text>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <RenderForm factory={inputFactory} formDefinition={profileFormDefinition} />
                </div>

                {/* Submit Button */}
                <Button
                  type="button"
                  variant="primary"
                  disabled={isSaving}
                  onClick={() => rootForm.submitForm()}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            );
          }}
        </RootForm>
      </SettingSection>

      {/* Account Information */}
      <SettingSection title="Account Information" description="Read-only account details">
        <div className="space-y-4">
          <div>
            <Text variant="body-strong" className="cn-text-foreground-1 mb-1">
              User ID
            </Text>
            <Text variant="body-normal" className="cn-text-foreground-3">
              {user.id}
            </Text>
          </div>
        </div>
      </SettingSection>
    </SettingsLayout>
  );
}
