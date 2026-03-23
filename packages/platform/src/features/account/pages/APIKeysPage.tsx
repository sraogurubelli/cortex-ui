import { useState } from 'react';
import { Button, Text, IconV2, Input, Card } from '@harnessio/ui/components';
import { SettingsLayout } from '@cortex/core';

interface APIKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: Date;
  lastUsedAt?: Date;
}

/**
 * APIKeysPage - Manage API keys
 *
 * Note: This is a basic implementation with mock data
 * Integrate with real backend API when ready
 */
export function APIKeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleCreate = () => {
    if (!keyName.trim()) return;

    const key: APIKey = {
      id: `key_${Date.now()}`,
      name: keyName,
      prefix: `sk_${Math.random().toString(36).substr(2, 8)}`,
      createdAt: new Date(),
    };

    // In real app, call API to create key
    const fullKey = `${key.prefix}${Math.random().toString(36).substr(2, 24)}`;
    setNewKey(fullKey);
    setKeys(prev => [...prev, key]);
    setKeyName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setKeys(prev => prev.filter(k => k.id !== id));
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <SettingsLayout title="API Keys" description="Manage your API keys for programmatic access">
      {/* Info Banner */}
      <div className="mb-6 p-4 rounded-md cn-bg-background-3 border cn-border-border-1">
        <div className="flex gap-3">
          <IconV2
            name={'info' as any}
            size="sm"
            className="cn-text-brand-primary flex-shrink-0 mt-0.5"
          />
          <div>
            <Text variant="body-strong" className="cn-text-foreground-1 mb-1">
              Keep your API keys secure
            </Text>
            <Text variant="body-normal" className="cn-text-foreground-3 text-sm">
              API keys provide access to your account. Never share them or commit them to version
              control.
            </Text>
          </div>
        </div>
      </div>

      {/* New Key Display */}
      {newKey && (
        <div className="mb-6 p-4 rounded-md cn-bg-success-1 border cn-border-success-border">
          <Text variant="body-strong" className="cn-text-success-foreground mb-2">
            API Key Created Successfully
          </Text>
          <Text variant="body-normal" className="cn-text-foreground-3 text-sm mb-3">
            Make sure to copy your API key now. You won't be able to see it again!
          </Text>
          <div className="flex gap-2">
            <Input type="text" value={newKey} readOnly className="flex-1 font-mono text-sm" />
            <Button variant="outline" onClick={() => handleCopyKey(newKey)}>
              Copy
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setNewKey(null)} className="mt-2">
            Dismiss
          </Button>
        </div>
      )}

      {/* Create New Key */}
      {!showCreate ? (
        <div className="mb-8">
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <IconV2 name={'plus' as any} size="sm" className="mr-2" />
            Create API Key
          </Button>
        </div>
      ) : (
        <Card.Root className="mb-8 p-6">
          <Text variant="heading-subsection" className="cn-text-foreground-1 mb-4">
            Create New API Key
          </Text>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">
                <Text variant="body-strong" className="cn-text-foreground-1">
                  Key Name
                </Text>
              </label>
              <Input
                type="text"
                placeholder="e.g., Production API Key"
                value={keyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyName(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleCreate} disabled={!keyName.trim()}>
                Create Key
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreate(false);
                  setKeyName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card.Root>
      )}

      {/* API Keys List */}
      <div>
        <Text variant="heading-subsection" className="cn-text-foreground-1 mb-4">
          Your API Keys
        </Text>

        {keys.length === 0 ? (
          <div className="text-center py-12 cn-bg-background-2 rounded-lg border cn-border-border-1">
            <IconV2 name={'key' as any} size="lg" className="cn-text-foreground-3 mb-4 mx-auto" />
            <Text variant="body-normal" className="cn-text-foreground-3">
              No API keys yet. Create one to get started.
            </Text>
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map(key => (
              <Card.Root key={key.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <IconV2 name={'key' as any} size="sm" className="cn-text-foreground-3" />
                      <Text variant="body-strong" className="cn-text-foreground-1">
                        {key.name}
                      </Text>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <Text variant="body-normal" className="cn-text-foreground-3">
                        <span className="font-mono">{key.prefix}...</span>
                      </Text>
                      <Text variant="body-normal" className="cn-text-foreground-3">
                        Created {key.createdAt.toLocaleDateString()}
                      </Text>
                      {key.lastUsedAt && (
                        <Text variant="body-normal" className="cn-text-foreground-3">
                          Last used {key.lastUsedAt.toLocaleDateString()}
                        </Text>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(key.id)}
                    className="cn-text-destructive-foreground"
                  >
                    Delete
                  </Button>
                </div>
              </Card.Root>
            ))}
          </div>
        )}
      </div>
    </SettingsLayout>
  );
}
