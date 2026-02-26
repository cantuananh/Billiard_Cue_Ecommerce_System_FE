import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({ 
  children, 
  isLoading, 
  loading, // Support both isLoading and loading for backward compatibility
  loadingText = 'Đang tải...', 
  loadingClassName, // Optional className when loading
  disabled, 
  className = '', 
  icon,
  ...props 
}) => {
  // Support both isLoading and loading props
  const isButtonLoading = isLoading || loading;
  
  // Use loadingClassName if provided, otherwise use className with opacity
  const buttonClassName = isButtonLoading && loadingClassName 
    ? loadingClassName 
    : `inline-flex items-center justify-center transition-all duration-200 ${
        isButtonLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`;

  return (
    <button
      disabled={isButtonLoading || disabled}
      className={buttonClassName}
      {...props}
    >
      {isButtonLoading ? (
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