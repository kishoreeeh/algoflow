import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';

/**
 * BookmarkButton Component
 * 
 * Toggle bookmark for an algorithm with animated heart/bookmark icon.
 * 
 * Props:
 * - algorithmId: Unique algorithm identifier
 * - algorithmName: Display name of the algorithm
 * - category: Algorithm category
 * - size: 'sm' | 'md' | 'lg'
 * - showLabel: Whether to show text label
 */
const BookmarkButton = ({
    algorithmId,
    algorithmName,
    category,
    size = 'md',
    showLabel = false,
}) => {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const bookmarked = isBookmarked(algorithmId);

    const sizeMap = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const paddingMap = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(algorithmId, algorithmName, category);
            }}
            className={`bookmark-btn ${paddingMap[size]} ${
                bookmarked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    : 'bg-white/5 border-white/10 text-gray-500 hover:text-amber-500 hover:border-amber-500/30'
            } border rounded-xl transition-all duration-200 flex items-center space-x-2 group`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark this algorithm'}
        >
            <motion.svg
                animate={bookmarked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={sizeMap[size]}
                fill={bookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
            </motion.svg>
            {showLabel && (
                <span className="text-[10px] font-bold uppercase tracking-wider">
                    {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </span>
            )}
        </motion.button>
    );
};

export default BookmarkButton;
