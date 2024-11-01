'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-black/50 p-6 border border-[#8b0000] rounded-lg backdrop-blur-sm max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-[#8b0000]" />
              <h2 className="text-xl text-[#8b0000] toxic-shadow">SYSTEM FAILURE</h2>
            </div>
            <p className="text-gray-400">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#8b0000] hover:bg-[#39ff14] hover:text-black transition-colors duration-300 border border-[#39ff14] rounded"
            >
              RETRY
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}