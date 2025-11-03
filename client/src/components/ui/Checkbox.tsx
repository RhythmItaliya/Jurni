'use client';

import { useState, useEffect, forwardRef } from 'react';

/**
 * Reusable Checkbox component that prevents hydration mismatches
 * Automatically handles client-side mounting and browser extension compatibility
 *
 * @param {Object} props - Checkbox component props
 * @param {string} [props.className] - CSS classes for styling
 * @param {boolean} [props.checked] - Whether checkbox is checked
 * @param {Function} [props.onChange] - Change handler
 * @param {string} [props.id] - Checkbox ID
 * @param {string} [props.name] - Checkbox name
 * @param {string} [props.label] - Label text
 * @param {any} [props.ref] - Forwarded ref
 * @returns {JSX.Element} Checkbox element or loading placeholder
 */
interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      // Return a placeholder that matches the expected checkbox size
      return <div className={`checkbox-placeholder ${className}`} />;
    }

    return (
      <label className={`checkbox-label ${className}`}>
        <input
          {...props}
          ref={ref}
          type="checkbox"
          className="checkbox"
          suppressHydrationWarning
        />
        {label && <span className="checkbox-text">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
