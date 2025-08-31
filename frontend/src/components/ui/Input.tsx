import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  state?: 'default' | 'success' | 'error' | 'warning';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  readOnly = false,
  size = 'md',
  variant = 'default',
  state = 'default',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  label,
  helperText,
  errorMessage,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  className = '',
  id,
  name,
  autoComplete,
  'aria-describedby': ariaDescribedby,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;

  const baseClass = 'ui-input';
  const sizeClass = `ui-input--${size}`;
  const variantClass = `ui-input--${variant}`;
  const stateClass = state !== 'default' ? `ui-input--${state}` : '';
  const widthClass = fullWidth ? 'ui-input--full-width' : '';
  const iconClass = icon ? `ui-input--with-icon ui-input--icon-${iconPosition}` : '';

  const inputClasses = [
    baseClass,
    sizeClass,
    variantClass,
    stateClass,
    widthClass,
    iconClass,
    className
  ].filter(Boolean).join(' ');

  const describedBy = [ariaDescribedby, helperId, errorId].filter(Boolean).join(' ');

  return (
    <div className="ui-input-wrapper">
      {label && (
        <label htmlFor={inputId} className="ui-input__label">
          {label}
          {required && <span className="ui-input__required">*</span>}
        </label>
      )}
      
      <div className="ui-input__container">
        {icon && iconPosition === 'left' && (
          <span className="ui-input__icon ui-input__icon--left">
            {icon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          autoComplete={autoComplete}
          className={inputClasses}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          aria-describedby={describedBy || undefined}
          aria-label={ariaLabel}
          aria-invalid={state === 'error'}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <span className="ui-input__icon ui-input__icon--right">
            {icon}
          </span>
        )}
      </div>
      
      {helperText && !errorMessage && (
        <p id={helperId} className="ui-input__helper-text">
          {helperText}
        </p>
      )}
      
      {errorMessage && (
        <p id={errorId} className="ui-input__error-message">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
