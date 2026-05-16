import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h3 className="font-display font-semibold text-text-primary text-xl mb-2">Something went wrong</h3>
      <p className="text-text-secondary max-w-md mb-8">
        {message || "We encountered an unexpected error while fetching this data. Please try again."}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
