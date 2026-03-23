import { useState, type FormEvent } from 'react';
import { Button, Input, Text, Avatar } from '@harnessio/ui/components';
import { SettingsLayout, SettingSection, useAuth } from '@cortex/core';

/**
 * ProfilePage - View and edit user profile
 */
export function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Valid email is required');
      return;
    }

    setIsSaving(true);

    try {
      // Update user in auth context
      updateUser({ name, email, avatar: avatar || undefined });

      // In a real app, you would call an API here
      // await updateUserProfile({ name, email, avatar });

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar src={avatar} name={name} size="lg" />
            <div className="flex-1">
              <label className="block mb-2">
                <Text variant="body-strong" className="cn-text-foreground-1">
                  Avatar URL
                </Text>
              </label>
              <Input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={avatar}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatar(e.target.value)}
                disabled={isSaving}
              />
              <Text variant="body-normal" className="cn-text-foreground-3 text-xs mt-1">
                Leave empty for auto-generated avatar based on initials
              </Text>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2">
              <Text variant="body-strong" className="cn-text-foreground-1">
                Full Name
              </Text>
            </label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              disabled={isSaving}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2">
              <Text variant="body-strong" className="cn-text-foreground-1">
                Email Address
              </Text>
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              disabled={isSaving}
              required
            />
          </div>

          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
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
