import React, { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <Card className="max-w-md w-full border-0 shadow-sm bg-white dark:bg-[#1a1a1a]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#A00000]">
                <AlertCircle className="w-6 h-6" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[#404040] dark:text-gray-400">
                We encountered an error while loading this page. Please try again.
              </p>
              {this.state.error && (
                <details className="text-xs text-[#404040] dark:text-gray-400 p-3 bg-[#F8F8F8] dark:bg-[#262930] rounded">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-2 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <Button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full bg-[#A00000] hover:bg-[#800000]"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
