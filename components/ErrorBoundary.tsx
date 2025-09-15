import React, { Component, ErrorInfo } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

// FIX: Use React.PropsWithChildren to correctly type components with children.
// This resolves the error in App.tsx where 'children' was reported as missing.
type Props = React.PropsWithChildren<{}>;

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: The error "Property 'props' does not exist" and a previous fix comment regarding arrow functions suggest a potential build configuration issue with ES class fields. While the `render` method was converted to a standard method, state initialization was still a class field. Reverting state initialization to a standard constructor ensures the component avoids any class field-related transpilation problems, which should correctly resolve the `this` context and make `this.props` available.
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  // FIX: Reverted `render` to a standard class method. The arrow function syntax was causing "Property 'props' does not exist" errors, likely due to a build configuration issue with how 'this' is typed in arrow function class fields.
  render() {
    const { hasError, error } = this.state;

    if (hasError) {
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
            {process.env.NODE_ENV === 'development' && error && (
                <details className="bg-red-50 p-4 rounded-md text-left mb-6 w-full max-w-2xl">
                    <summary className="font-semibold cursor-pointer text-red-800">Error Details</summary>
                    <pre className="text-red-700 text-sm mt-2 whitespace-pre-wrap break-words">
                        {error.toString()}
                        <br />
                        {error.stack}
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
