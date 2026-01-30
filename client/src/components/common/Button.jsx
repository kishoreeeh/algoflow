import React from 'react';

/**
 * Button Component
 * 
 * A reusable button component with multiple variants.
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'success' | 'icon'
 * - size: 'sm' | 'md' | 'lg'
 * - children: Button content
 * - onClick: Click handler
 * - disabled: Boolean
 * - className: Additional CSS classes
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    children,
    onClick,
    disabled = false,
    className = '',
    ...props
}) => {
    // Base button classes
    const baseClasses = 'btn';

    // Variant classes
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'btn-success',
        icon: 'btn-icon',
    };

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${size !== 'icon' ? sizeClasses[size] : ''} 
    ${className}
  `.trim();

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
