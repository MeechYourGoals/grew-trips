import React, { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';

interface LazyRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

export const LazyRoute: React.FC<LazyRouteProps> = ({ 
  children, 
  fallback = <DefaultLoader /> 
}) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};