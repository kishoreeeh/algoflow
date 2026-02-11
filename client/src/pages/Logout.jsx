import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        // Perform logout
        logout();

        // Auto-redirect after some time
        const timer = setTimeout(() => {
            navigate('/login');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate, logout]);

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="auth-mesh opacity-50" />

            <div className="max-w-md w-full relative z-10 text-center animate-fade-in">
                {/* Success Card */}
                <div className="glass-card rounded-[3rem] p-12 border border-white/5 shadow-2xl backdrop-blur-2xl">
                    {/* Animated Checkmark Circle */}
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    className="animate-checkmark"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* User Avatar (if available) */}
                    {user && (
                        <div className="mb-6 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#10b981] to-[#06b6d4] flex items-center justify-center text-white text-2xl font-black shadow-lg mb-3">
                                {user.name.charAt(0)}
                            </div>
                            <h3 className="text-white font-bold text-lg">See you soon, {user.name}</h3>
                        </div>
                    )}

                    <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
                        Logged Out Successfully
                    </h1>

                    <p className="text-gray-400 mb-10 leading-relaxed">
                        Your session has been securely closed. All system modules are now on standby.
                    </p>

                    <div className="space-y-4">
                        <Link to="/login" className="block w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95">
                            Re-Authorize
                        </Link>

                        <Link to="/" className="block w-full py-4 rounded-2xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all">
                            Back to System Hub
                        </Link>
                    </div>

                    <div className="mt-8">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">Redirecting in 5s</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logout;
