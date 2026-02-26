import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({ 
  children, 
  isLoading, 
  loadingText = 'Đang tải...', 
  disabled, 
  className = '', 
  icon,
  ...props 
}) => {
  return (
    <button
      disabled={isLoading || disabled}
      className={`inline-flex items-center justify-center transition-all duration-200 ${
        isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default LoadingButton;