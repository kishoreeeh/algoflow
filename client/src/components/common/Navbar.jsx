import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar Component
 * 
 * Navigation bar with authentication state.
 * Shows different options for logged in vs logged out users.
 */
const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const handleLogout = () => {
        navigate('/logout');
    };

    return (
        <nav className="bg-[#0f172a] border-b border-[#334155] sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#10b981] to-[#06b6d4] rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                            <span className="text-white font-bold text-xl">AF</span>
                        </div>
                        <span className="text-xl font-bold text-white group-hover:text-[#10b981] transition-colors duration-200">
                            Algo Flow
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/algorithms">Algorithms</NavLink>

                        {isAuthenticated() ? (
                            <>
                                <NavLink to="/dashboard">Dashboard</NavLink>
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-300 font-medium">
                                        Hi, {user?.name || 'User'}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-300 hover:text-[#10b981] font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-[#10b981] text-black rounded-lg hover:bg-[#34d399] transition-all font-medium shadow-md hover:shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden btn-icon">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

/**
 * NavLink Component
 */
const NavLink = ({ to, children }) => {
    return (
        <Link
            to={to}
            className="text-gray-300 hover:text-[#10b981] font-medium transition-colors duration-200 relative group"
        >
            {children}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#10b981] group-hover:w-full transition-all duration-300"></span>
        </Link>
    );
};

export default Navbar;
