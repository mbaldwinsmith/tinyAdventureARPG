import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected interface error occurred.',
    };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Tiny Adventure interface failed:', error, info.componentStack);
  }
  render() {
    if (this.state.error)
      return (
        <main className="fatal-error" role="alert">
          <h1>The adventure could not start.</h1>
          <p>{this.state.error}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </main>
      );
    return this.props.children;
  }
}
