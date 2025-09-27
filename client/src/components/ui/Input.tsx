'use client';

import { useState, useEffect, forwardRef } from 'react';

/**
 * Reusable Input component that prevents hydration mismatches
 * Automatically handles client-side mounting and browser extension compatibility
 *
 * @param {Object} props - Input component props
 * @param {string} [props.className] - CSS classes for styling
 * @param {string} [props.type] - Input type (text, email, password, etc.)
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onKeyDown] - Key down handler
 * @param {Function} [props.onFocus] - Focus handler
 * @param {boolean} [props.required] - Whether input is required
 * @param {number} [props.maxLength] - Maximum input length
 * @param {string} [props.id] - Input ID
 * @param {string} [props.name] - Input name
 * @param {any} [props.ref] - Forwarded ref
 * @returns {JSX.Element} Input element or loading placeholder
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      // Return a placeholder that matches the expected input size
      const baseClasses = className.includes('h-') ? className : 'h-10';
      return (
        <div
          className={`${baseClasses} w-full bg-gray-100 rounded animate-pulse`}
        />
      );
    }

    return (
      <input
        {...props}
        ref={ref}
        className={className}
        suppressHydrationWarning
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
