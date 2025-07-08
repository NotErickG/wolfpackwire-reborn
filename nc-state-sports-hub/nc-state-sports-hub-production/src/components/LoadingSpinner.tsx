import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

/**
 * LoadingSpinner Component for NC State Sports Hub
 * Provides a spinning animation with optional loading message
 * Uses NC State red color (#CC0000)
 */
export default function LoadingSpinner({ 
  size = 'medium', 
  message, 
  className = '' 
}: LoadingSpinnerProps) {
  // Size mappings for spinner dimensions
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinning circle */}
      <div 
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-red-600 rounded-full animate-spin`}
        style={{ borderTopColor: '#CC0000' }}
      />
      
      {/* Optional loading message */}
      {message && (
        <p className="mt-2 text-sm text-gray-600 text-center">
          {message}
        </p>
      )}
    </div>
  );
}
