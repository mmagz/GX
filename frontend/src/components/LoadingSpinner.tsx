import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-[#262930]" style={{ fontSize: '16px' }}>
        Loading...
      </p>
    </div>
  );
}

export default LoadingSpinner;
