import React from 'react';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PageLoader({ message = 'Loading...', size = 'md' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-[#262930]" style={{ fontSize: '16px' }}>
          Loading...
        </p>
      </div>
    </div>
  );
}

export function ProductLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-[#262930]" style={{ fontSize: '16px' }}>
          Loading...
        </p>
      </div>
    </div>
  );
}

export function PageTransitionLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#262930]" style={{ fontSize: '16px' }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
