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
 * @param {React.ReactNode} [props.children] - Option elements
 * @param {any} [props.ref] - Forwarded ref
 * @returns {JSX.Element} Select element or loading placeholder
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', ...props }, ref) => {
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
      />
    );
  }
);

Select.displayName = 'Select';

export default Select;
