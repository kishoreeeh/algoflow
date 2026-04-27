import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import algorithmRegistry, { getIcon } from '../data/algorithms';

/**
 * Bookmarks Page - Clean, professional style
 */
const Bookmarks = () => {
    const { bookmarks, removeBookmark, clearAll } = useBookmarks();

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-gray-200 pb-24">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">Bookmarks</h1>
                    <p className="text-gray-500">
                        {bookmarks.length > 0
                            ? `${bookmarks.length} algorithm${bookmarks.length !== 1 ? 's' : ''} saved for quick access`
                            : 'Save algorithms for quick access and revision'}
                    </p>
                </div>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-24">
                        <svg className="w-12 h-12 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <h2 className="text-lg font-medium text-gray-400 mb-2">No bookmarks yet</h2>
                        <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                            Click the bookmark icon on any algorithm to save it here.
                        </p>
                        <Link to="/algorithms" className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                            Browse Algorithms
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Actions */}
                        <div className="flex items-center justify-end mb-6">
                            <button
                                onClick={clearAll}
                                className="px-3 py-1.5 text-[11px] font-medium text-red-400/60 border border-red-500/15 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Bookmark Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bookmarks.map((bookmark) => {
                                const algo = algorithmRegistry[bookmark.id]?.algorithm;
                                return (
                                    <div key={bookmark.id} className="bg-[#0f1520] border border-[#1e293b] rounded-xl p-5 hover:border-[#334155] transition-all group">
                                        <div className="flex items-start justify-between mb-3">
                                            <Link to={`/algorithm/${bookmark.id}`} className="flex items-center gap-3">
                                                <div className="text-2xl">{getIcon(bookmark.id)}</div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">{bookmark.name}</h3>
                                                    {bookmark.category && <span className="text-[10px] text-gray-600">{bookmark.category}</span>}
                                                </div>
                                            </Link>
                                            <button
                                                onClick={() => removeBookmark(bookmark.id)}
                                                className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Remove bookmark"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                            </button>
                                        </div>

                                        {algo?.concept?.keyIdea && (
                                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{algo.concept.keyIdea}</p>
                                        )}

                                        <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between">
                                            {algo?.complexity?.time?.average && (
                                                <span className="text-[11px] font-mono text-gray-500">Time: {algo.complexity.time.average}</span>
                                            )}
                                            <span className="text-[10px] text-gray-700">
                                                {new Date(bookmark.bookmarkedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Bookmarks;
