import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * BookmarkContext
 * 
 * Manages algorithm bookmarks with LocalStorage persistence.
 * Provides bookmark/unbookmark functionality and bookmark list.
 */

const STORAGE_KEY = 'algoflow-bookmarks';
const BookmarkContext = createContext(null);

export const useBookmarks = () => {
    const context = useContext(BookmarkContext);
    if (!context) {
        throw new Error('useBookmarks must be used within BookmarkProvider');
    }
    return context;
};

export const BookmarkProvider = ({ children }) => {
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Persist to localStorage whenever bookmarks change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }, [bookmarks]);

    const isBookmarked = useCallback((algorithmId) => {
        return bookmarks.some(b => b.id === algorithmId);
    }, [bookmarks]);

    const toggleBookmark = useCallback((algorithmId, algorithmName, category) => {
        setBookmarks(prev => {
            if (prev.some(b => b.id === algorithmId)) {
                return prev.filter(b => b.id !== algorithmId);
            }
            return [...prev, {
                id: algorithmId,
                name: algorithmName,
                category,
                bookmarkedAt: new Date().toISOString(),
            }];
        });
    }, []);

    const removeBookmark = useCallback((algorithmId) => {
        setBookmarks(prev => prev.filter(b => b.id !== algorithmId));
    }, []);

    const clearAll = useCallback(() => {
        setBookmarks([]);
    }, []);

    const value = {
        bookmarks,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        clearAll,
        count: bookmarks.length,
    };

    return (
        <BookmarkContext.Provider value={value}>
            {children}
        </BookmarkContext.Provider>
    );
};
