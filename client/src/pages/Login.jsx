import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import API_URL from '../config/api';

const DsaBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
            <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                        <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Simulated Binary Tree Paths */}
                <path d="M 500 100 L 300 300 L 200 500" stroke="url(#line-gradient)" strokeWidth="1" fill="none" className="animate-pulse" />
                <path d="M 500 100 L 700 300 L 800 500" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />
                <path d="M 300 300 L 400 500" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />
                <path d="M 700 300 L 600 500" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />

                {/* Floating Nodes */}
                <circle cx="500" cy="100" r="4" fill="#10b981" className="animate-ping" />
                <circle cx="300" cy="300" r="3" fill="#06b6d4" />
                <circle cx="700" cy="300" r="3" fill="#06b6d4" />
                <circle cx="200" cy="500" r="2" fill="#8b5cf6" />
                <circle cx="400" cy="500" r="2" fill="#8b5cf6" />
                <circle cx="600" cy="500" r="2" fill="#8b5cf6" />
                <circle cx="800" cy="500" r="2" fill="#8b5cf6" />
            </svg>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1)_0%,transparent_50%)]" />
        </div>
    );
};

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/auth/login`, formData);

            if (response.data.success) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Identity verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans text-stone-200">
            {/* Premium DSA Background */}
            <DsaBackground />

            <div className="max-w-md w-full relative z-10">
                {/* Floating Neural Orbs */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] animate-pulse delay-1000" />

                {/* Brand Identity Removed */}


                {/* Main Auth Card */}
                <div className="bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-700">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-black text-white italic tracking-tighter">
                            KERNAL_ACCESS
                        </h2>
                        <div className="h-0.5 w-12 bg-emerald-500 mx-auto mt-2 rounded-full" />
                        <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.3em]">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                                ! {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Registry Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
                                placeholder="name@neural.net"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Access Key</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between text-[10px] px-2">
                            <label className="flex items-center space-x-2 text-gray-500 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded-lg border-white/5 bg-white/5 checked:bg-emerald-500 transition-all" />
                                <span className="group-hover:text-gray-300 font-bold uppercase tracking-widest">Stay Logged</span>
                            </label>
                            <a href="#" className="text-emerald-500 hover:text-emerald-400 font-black tracking-widest uppercase">Lost Key?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative overflow-hidden rounded-2xl py-5 font-black text-[11px] tracking-[0.4em] uppercase transition-all shadow-xl shadow-emerald-500/5"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                            <span className="relative z-10 flex items-center justify-center text-black">
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "INITIATE AUTHENTICATION"
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            New Recruit?{' '}
                            <Link to="/signup" className="text-white hover:text-emerald-400 transition-colors ml-2 border-b border-emerald-500/30">
                                CREATE_IDENTITY
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-10">
                    <Link to="/" className="text-gray-600 hover:text-gray-400 transition-all text-[9px] font-black uppercase tracking-[0.25em] flex items-center justify-center space-x-2 group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span>TERMINATE_SESSION</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
