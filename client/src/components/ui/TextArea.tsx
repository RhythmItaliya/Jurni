'use client';

import { useState, useEffect, forwardRef } from 'react';

/**
 * Reusable TextArea component that prevents hydration mismatches
 * Automatically handles client-side mounting and browser extension compatibility
 *
 * @param {Object} props - TextArea component props
 * @param {string} [props.className] - CSS classes for styling
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.value] - TextArea value
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onKeyDown] - Key down handler
 * @param {Function} [props.onFocus] - Focus handler
 * @param {boolean} [props.required] - Whether textarea is required
 * @param {number} [props.maxLength] - Maximum input length
 * @param {number} [props.rows] - Number of rows
 * @param {string} [props.id] - TextArea ID
 * @param {string} [props.name] - TextArea name
 * @param {any} [props.ref] - Forwarded ref
 * @returns {JSX.Element} TextArea element or loading placeholder
 */
interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', ...props }, ref) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      // Return a placeholder that matches the expected textarea size
      return <div className={`textarea-placeholder ${className}`} />;
    }

    return (
      <textarea
        {...props}
        ref={ref}
        className={`textarea ${className}`}
        suppressHydrationWarning
      />
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
