import { Component, type ReactNode } from 'react';
import { Layout, Text } from '@harnessio/ui/components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PageErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <Layout.Vertical gapY="sm" className="p-cn-lg">
          <Text variant="heading-small" color="foreground-1">
            Something went wrong
          </Text>
          <Text variant="body-normal" color="foreground-3">
            {this.state.error.message}
          </Text>
        </Layout.Vertical>
      );
    }
    return this.props.children;
  }
}
