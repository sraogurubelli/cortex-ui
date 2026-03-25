import { IconV2, Layout, Text } from '@harnessio/ui/components';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: string;
}

export function StatCard({ title, value, icon, color = 'text-cn-foreground-1' }: StatCardProps) {
  return (
    <Layout.Vertical
      gap="sm"
      className="rounded-cn-md border border-cn-borders-2 bg-cn-background-2 p-cn-lg min-w-[180px]"
    >
      <Layout.Horizontal gap="sm" align="center">
        <IconV2 name={icon as any} size="sm" className="text-cn-foreground-3" />
        <Text variant="body-normal" color="foreground-3">
          {title}
        </Text>
      </Layout.Horizontal>
      <Text variant="heading-section" className={color}>
        {value}
      </Text>
    </Layout.Vertical>
  );
}
