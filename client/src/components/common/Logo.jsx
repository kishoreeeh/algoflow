import React from 'react';

/**
 * AlgoFlow Logo - Graph/Node SVG
 * 
 * A minimal graph-like icon with connected nodes,
 * representing data structures & algorithms.
 * 
 * @param {number} size - Width/height in px (default 32)
 * @param {boolean} withText - Show "AlgoFlow" text next to icon
 * @param {string} className - Additional classes
 */
const Logo = ({ size = 32, withText = false, className = '' }) => {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                {/* Background rounded square */}
                <rect width="40" height="40" rx="10" fill="currentColor" className="t-text" style={{ opacity: 0.05 }} />
                <rect width="40" height="40" rx="10" stroke="currentColor" className="t-border" strokeWidth="1" fill="none" />
                
                {/* Edges */}
                <line x1="12" y1="12" x2="28" y2="12" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
                <line x1="12" y1="12" x2="12" y2="28" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
                <line x1="12" y1="12" x2="28" y2="28" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />
                <line x1="28" y1="12" x2="28" y2="28" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
                <line x1="12" y1="28" x2="28" y2="28" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
                <line x1="20" y1="20" x2="28" y2="12" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
                <line x1="20" y1="20" x2="12" y2="28" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />

                {/* Nodes */}
                {/* Top-left node */}
                <circle cx="12" cy="12" r="3.5" fill="#3b82f6" />
                <circle cx="12" cy="12" r="2" fill="#93c5fd" />

                {/* Top-right node */}
                <circle cx="28" cy="12" r="3.5" fill="#3b82f6" />
                <circle cx="28" cy="12" r="2" fill="#93c5fd" />

                {/* Center node (largest - represents current/active) */}
                <circle cx="20" cy="20" r="4.5" fill="#2563eb" />
                <circle cx="20" cy="20" r="2.5" fill="#bfdbfe" />

                {/* Bottom-left node */}
                <circle cx="12" cy="28" r="3.5" fill="#3b82f6" />
                <circle cx="12" cy="28" r="2" fill="#93c5fd" />

                {/* Bottom-right node */}
                <circle cx="28" cy="28" r="3.5" fill="#10b981" />
                <circle cx="28" cy="28" r="2" fill="#6ee7b7" />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                </defs>
            </svg>

            {withText && (
                <span className="text-sm font-bold tracking-tight t-text font-outfit uppercase">
                    Algo<span style={{ color: 'var(--accent)' }}>Flow</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
