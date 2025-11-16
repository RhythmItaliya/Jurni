'use client';

import { useState, useEffect, forwardRef } from 'react';

/**
 * Reusable Select component that prevents hydration mismatches
 * Automatically handles client-side mounting and browser extension compatibility
 *
 * @param {Object} props - Select component props
 * @param {string} [props.className] - CSS classes for styling
 * @param {string} [props.value] - Selected value
 * @param {Function} [props.onChange] - Change handler
 * @param {boolean} [props.required] - Whether select is required
 * @param {string} [props.id] - Select ID
 * @param {string} [props.name] - Select name
 * @param {string} [props.placeholder] - Placeholder text for empty select
 * @param {Array} [props.options] - Array of option objects {value: string, label: string}
 * @param {React.ReactNode} [props.children] - Option elements (alternative to options prop)
 * @param {any} [props.ref] - Forwarded ref
 * @returns {JSX.Element} Select element or loading placeholder
 */
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  options?: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, placeholder, children, ...props }, ref) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      // Return a placeholder that matches the expected select size
      return <div className={`select-placeholder ${className}`} />;
    }

    return (
      <select
        {...props}
        ref={ref}
        className={`select ${className}`}
        suppressHydrationWarning
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options
          ? options.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="select-option"
              >
                {option.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;
