import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NotesPanel Component
 * 
 * Allows users to write and save notes for each algorithm.
 * Notes are persisted in LocalStorage and auto-loaded on revisit.
 * 
 * Props:
 * - algorithmId: Unique algorithm identifier
 * - algorithmName: Display name of the algorithm
 */

const STORAGE_KEY = 'algoflow-notes';

const getStoredNotes = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

const NotesPanel = ({ algorithmId, algorithmName }) => {
    const [notes, setNotes] = useState('');
    const [savedAt, setSavedAt] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load notes on mount
    useEffect(() => {
        const allNotes = getStoredNotes();
        if (allNotes[algorithmId]) {
            setNotes(allNotes[algorithmId].content || '');
            setSavedAt(allNotes[algorithmId].savedAt || null);
        }
    }, [algorithmId]);

    // Auto-save with debounce
    const saveNotes = useCallback((value) => {
        setIsSaving(true);
        const allNotes = getStoredNotes();
        const now = new Date().toISOString();
        allNotes[algorithmId] = {
            content: value,
            algorithmName,
            savedAt: now,
            updatedAt: now,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes));
        setSavedAt(now);
        setTimeout(() => setIsSaving(false), 600);
    }, [algorithmId, algorithmName]);

    // Debounced auto-save
    useEffect(() => {
        if (!notes && !savedAt) return; // Don't save empty initial
        const timer = setTimeout(() => {
            saveNotes(notes);
        }, 1000);
        return () => clearTimeout(timer);
    }, [notes, saveNotes]);

    const handleChange = (e) => {
        setNotes(e.target.value);
    };

    const formatDate = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="notes-panel"
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors rounded-t-2xl"
            >
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-white">My Notes</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                            {wordCount > 0 ? `${wordCount} words` : 'No notes yet'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {isSaving && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider"
                        >
                            Saving...
                        </motion.span>
                    )}
                    <motion.svg
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </div>
            </button>

            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3">
                            <textarea
                                value={notes}
                                onChange={handleChange}
                                placeholder={`Write your notes about ${algorithmName || 'this algorithm'}...\n\n• Key concepts to remember\n• Time/space complexity insights\n• Edge cases to watch for\n• Related problems`}
                                className="notes-textarea"
                                rows={8}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-[10px] text-gray-600">
                                    {savedAt && (
                                        <span className="flex items-center space-x-1">
                                            <svg className="w-3 h-3 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Saved {formatDate(savedAt)}</span>
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => { setNotes(''); saveNotes(''); }}
                                    className="text-[10px] font-bold text-red-500/50 hover:text-red-500 uppercase tracking-wider transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default NotesPanel;
