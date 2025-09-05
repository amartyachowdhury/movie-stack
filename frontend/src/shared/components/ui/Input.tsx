import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'default' | 'outlined' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  variant = 'default',
  inputSize = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  const baseClasses = 'input';
  const variantClasses = `input--${variant}`;
  const sizeClasses = `input--${inputSize}`;
  const stateClasses = [
    hasError && 'input--error',
    fullWidth && 'input--full-width'
  ].filter(Boolean).join(' ');

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    stateClasses,
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'input__field',
    `input__field--${variant}`,
    `input__field--${inputSize}`,
    hasError && 'input__field--error'
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
        </label>
      )}
      
      <div className="input__wrapper">
        {leftIcon && (
          <span className="input__icon input__icon--left">
            {leftIcon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <span className="input__icon input__icon--right">
            {rightIcon}
          </span>
        )}
      </div>
      
      {hint && !hasError && (
        <p id={`${inputId}-hint`} className="input__hint">
          {hint}
        </p>
      )}
      
      {hasError && (
        <p className="input__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
