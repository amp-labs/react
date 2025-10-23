/* eslint-disable react/prop-types */
import React, { Component, ReactNode } from "react";

import { ComponentContainerError } from "./ComponentContainer";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Generic React Error Boundary component that catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole application.
 *
 * This is used across Ampersand components to prevent errors in hooks or rendering from crashing the parent application.
 */
export class AmpersandErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console for debugging
    console.error("Ampersand Error Boundary caught an error:", error);
    console.error("[Error Info]:", errorInfo);

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ComponentContainerError
          message={
            this.state.error?.message ||
            "Something went wrong. Please try again later."
          }
        />
      );
    }

    return this.props.children;
  }
}
