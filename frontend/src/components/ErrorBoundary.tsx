import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f9f7f0] flex items-center justify-center px-4">
          <div className="max-w-md w-full frosted-glass border border-white/30 rounded-sm p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-[#D04007]" />
            <h1 className="uppercase-headline mb-4" style={{ fontSize: '24px', letterSpacing: '0.1em' }}>
              SOMETHING WENT WRONG
            </h1>
            <p className="mb-6 opacity-70" style={{ fontSize: '13px' }}>
              We apologize for the inconvenience. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#262930] text-white uppercase-headline hover:bg-[#D04007] transition-colors duration-300"
              style={{ fontSize: '11px', letterSpacing: '0.15em' }}
            >
              RELOAD PAGE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
