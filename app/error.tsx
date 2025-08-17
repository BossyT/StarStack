'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error boundary:', error);
  }, [error]);

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        Please try again. If the problem persists, contact support.
      </p>
      <button
        onClick={() => reset()}
        className="px-3 py-2 text-sm rounded bg-black text-white"
      >
        Try again
      </button>
    </div>
  );
}
