import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 text-stone-800">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200 p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Application Notice</h2>
            <p className="text-sm text-stone-600">
              An unexpected display issue occurred. The system has automatically preserved your data cache.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-stone-50 rounded-lg text-xs font-mono text-stone-700 text-left overflow-x-auto max-h-32 border border-stone-200">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
