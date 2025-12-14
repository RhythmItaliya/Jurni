import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'accent'
    | 'warm'
    | 'sky';
  text?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'primary',
  text,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`icon-button icon-${size} ${variant} ${text ? 'with-text' : ''} ${className}`}
      {...props}
    >
      {icon}
      {text && <span>{text}</span>}
    </button>
  );
};

export default IconButton;
