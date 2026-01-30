import React from 'react';

/**
 * Card Component
 * 
 * A versatile card component for displaying content.
 * 
 * Props:
 * - title: Card title (optional)
 * - children: Card content
 * - hover: Boolean - adds hover effect
 * - className: Additional CSS classes
 */
const Card = ({ title, children, hover = false, className = '' }) => {
    const cardClasses = `${hover ? 'card-hover' : 'card'} ${className}`;

    return (
        <div className={cardClasses}>
            {title && (
                <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
            )}
            {children}
        </div>
    );
};

export default Card;
