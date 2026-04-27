import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBookmarks } from '../../context/BookmarkContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

/**
 * Navbar - Theme-aware professional navigation
 */
const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { count: bookmarkCount } = useBookmarks();

    return (
        <nav className="t-bg-secondary sticky top-0 z-50" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link to="/" className="group">
                        <Logo size={32} withText />
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/algorithms">Algorithms</NavLink>

                        <Link to="/bookmarks" className="relative px-3 py-1.5 text-sm t-text-muted hover:t-text transition-colors rounded-lg flex items-center gap-1.5"
                            style={{ ':hover': { backgroundColor: 'var(--bg-elevated)' } }}>
                            <svg className="w-3.5 h-3.5" fill={bookmarkCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Bookmarks
                            {bookmarkCount > 0 && (
                                <span className="w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                                    {bookmarkCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated() && <NavLink to="/dashboard">Dashboard</NavLink>}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle compact />

                        {isAuthenticated() ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm t-text-muted hidden md:block">{user?.name}</span>
                                <button
                                    onClick={() => navigate('/logout')}
                                    className="px-3 py-1.5 t-bg-elevated t-text-muted rounded-lg text-xs font-medium transition-all"
                                    style={{ border: '1px solid var(--border-hover)' }}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="px-3 py-1.5 text-sm t-text-muted">Login</Link>
                                <Link to="/signup" className="px-3 py-1.5 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--accent)' }}>Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children }) => (
    <Link to={to} className="px-3 py-1.5 text-sm t-text-muted transition-colors rounded-lg hover:t-text">
        {children}
    </Link>
);

export default Navbar;
