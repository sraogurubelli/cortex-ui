import { StackedList, IconV2, Text, TimeAgoCard } from '@harnessio/ui/components';
import type { ScopeItem } from './types';

const RECENT_SCOPES_KEY = 'helloworld-recent-scopes';

export const getRecentScopes = (): ScopeItem[] => {
  try {
    const stored = localStorage.getItem(RECENT_SCOPES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveRecentScope = (scope: ScopeItem): void => {
  try {
    const recent = getRecentScopes();
    const filtered = recent.filter((s) => s.id !== scope.id);
    const updated = [{ ...scope, timestamp: Date.now() }, ...filtered].slice(0, 10);
    localStorage.setItem(RECENT_SCOPES_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
};

interface RecentScopesProps {
  onSelect: (scope: ScopeItem) => void;
}

export function RecentScopes({ onSelect }: RecentScopesProps) {
  const recentScopes = getRecentScopes();

  if (recentScopes.length === 0) {
    return (
      <div className="p-cn-lg text-center">
        <Text color="foreground-3">No recent scopes</Text>
      </div>
    );
  }

  return (
    <StackedList.Root className="border-none">
      {recentScopes.map((scope) => (
        <StackedList.Item
          key={scope.id}
          thumbnail={<IconV2 name={scope.icon} size="lg" fallback="list" />}
          paddingX="xs"
          paddingY={scope.path && scope.path.length > 0 ? 'xs' : 'md'}
          onClick={() => onSelect(scope)}
          className="border-none rounded-cn-3 cursor-pointer hover:bg-cn-background-hover"
        >
          <StackedList.Field
            title={scope.name}
            description={
              scope.path && scope.path.length > 0 ? (
                <Text color="foreground-3">{scope.path.join(' > ')}</Text>
              ) : null
            }
            className="gap-0"
          />
          {scope.timestamp != null && (
            <StackedList.Field
              title={
                <TimeAgoCard
                  timestamp={scope.timestamp}
                  textProps={{ color: 'foreground-3' }}
                />
              }
              right
            />
          )}
        </StackedList.Item>
      ))}
    </StackedList.Root>
  );
}
