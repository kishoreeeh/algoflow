import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle Component
 * 
 * Animated toggle switch for dark/light mode with smooth transitions.
 * Reads and updates theme through ThemeContext.
 */
const ThemeToggle = ({ compact = false }) => {
    const { isDark, toggleTheme } = useTheme();

    if (compact) {
        return (
            <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                <motion.div
                    animate={{ rotate: isDark ? 0 : 180 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    {isDark ? (
                        <svg className="w-4 h-4 text-amber-400 group-hover:text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </motion.div>
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-btn group"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div className="relative w-14 h-7 rounded-full overflow-hidden border border-white/10 transition-colors duration-500"
                style={{
                    background: isDark
                        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                        : 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)'
                }}
            >
                {/* Track Icons */}
                <div className="absolute inset-0 flex items-center justify-between px-1.5">
                    <motion.span
                        animate={{ opacity: isDark ? 0.3 : 1 }}
                        className="text-[10px]"
                    >
                        ☀️
                    </motion.span>
                    <motion.span
                        animate={{ opacity: isDark ? 1 : 0.3 }}
                        className="text-[10px]"
                    >
                        🌙
                    </motion.span>
                </div>

                {/* Thumb */}
                <motion.div
                    className="absolute top-0.5 w-6 h-6 rounded-full shadow-lg"
                    animate={{
                        x: isDark ? 28 : 2,
                        backgroundColor: isDark ? '#f59e0b' : '#fde68a',
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                    }}
                    style={{
                        boxShadow: isDark
                            ? '0 0 12px rgba(245, 158, 11, 0.5)'
                            : '0 0 12px rgba(253, 230, 138, 0.5)',
                    }}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
