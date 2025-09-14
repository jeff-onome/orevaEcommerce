

import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  // FIX: State must be initialized in a class component. Added a constructor to initialize 'this.state'.
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="text-center py-20 bg-surface rounded-lg shadow-md animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Oops! Something went wrong.</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                We're sorry for the inconvenience. An unexpected error occurred. Please try again or return to the homepage.
            </p>

            {/* Optional: Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-red-50 p-4 rounded-md text-left mb-6 w-full max-w-2xl">
                    <summary className="font-semibold cursor-pointer text-red-800">Error Details</summary>
                    <pre className="text-red-700 text-sm mt-2 whitespace-pre-wrap break-words">
                        {this.state.error.toString()}
                        <br />
                        {this.state.error.stack}
                    </pre>
                </details>
            )}

            <Link to="/">
                <Button variant="primary">Go to Homepage</Button>
            </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;