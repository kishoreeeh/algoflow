import React, { useState, useEffect } from 'react';
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
                <path d="M 200 100 L 400 200 L 300 400" stroke="url(#line-gradient)" strokeWidth="1" fill="none" className="animate-pulse" />
                <path d="M 400 200 L 600 100 L 800 300" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />
                <path d="M 600 400 L 400 200" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />
                <path d="M 800 300 L 600 500" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />
                <circle cx="200" cy="100" r="3" fill="#10b981" />
                <circle cx="400" cy="200" r="4" fill="#06b6d4" className="animate-ping" />
                <circle cx="600" cy="100" r="3" fill="#10b981" />
                <circle cx="300" cy="400" r="2" fill="#8b5cf6" />
                <circle cx="800" cy="300" r="3" fill="#06b6d4" />
                <circle cx="600" cy="500" r="2" fill="#8b5cf6" />
            </svg>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
        </div>
    );
};

const NeuralSidePanel = () => {
    const [arr, setArr] = useState([40, 70, 20, 90, 50, 80, 30]);

    useEffect(() => {
        const interval = setInterval(() => {
            setArr(prev => {
                const newArr = [...prev];
                const i = Math.floor(Math.random() * newArr.length);
                const j = Math.floor(Math.random() * newArr.length);
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
                return newArr;
            });
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hidden lg:flex flex-col justify-center pr-16 w-1/2">
            <div className="space-y-6">
                <div>
                    <h3 className="text-[#10b981] font-black text-xs uppercase tracking-[0.4em] mb-2">Neural Onboarding</h3>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter leading-tight uppercase">
                        Master the<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 underline decoration-[#10b981]/30">Logic Flow</span>
                    </h1>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium uppercase tracking-wider opacity-80">
                    Visualize complex data structures in real-time. Witness the evolution of algorithms through our elite neural interface.
                </p>

                <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-[#10b981]/20 transition-all duration-500">
                    <div className="flex items-end space-x-2 h-32">
                        {arr.map((val, idx) => (
                            <div
                                key={idx}
                                className="flex-1 bg-gradient-to-t from-emerald-500/50 to-cyan-500/50 rounded-t-lg transition-all duration-1000 ease-in-out"
                                style={{ height: `${val}%` }}
                            />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between items-center bg-black/20 p-3 rounded-2xl border border-white/5">
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">Live Optimization Active</span>
                        <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-8 relative overflow-hidden font-sans text-stone-200">
            <DsaBackground />

            <div className="max-w-6xl w-full relative z-10 flex flex-col lg:flex-row items-center">
                <NeuralSidePanel />

                <div className="w-full lg:w-1/2 max-w-md">
                    <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                                New_identity
                            </h2>
                            <div className="h-0.5 w-12 bg-cyan-500 mx-auto mt-2 rounded-full" />
                            <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.3em]">Join the Neural Collective</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                                    ! {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                                    placeholder="IDENT_NAME"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Registry Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                                    placeholder="name@neural.net"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Passkey</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                                        placeholder="••••"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Confirm</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                                        placeholder="••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative overflow-hidden rounded-2xl py-5 font-black text-[11px] tracking-[0.4em] uppercase transition-all shadow-xl shadow-cyan-500/5 mt-4"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                                <span className="relative z-10 flex items-center justify-center text-black">
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        "INITIALIZE_IDENTITY"
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                Already Enlisted?{' '}
                                <Link to="/login" className="text-white hover:text-cyan-400 transition-colors ml-2 border-b border-cyan-500/30">
                                    ACCESS_LINK
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/" className="text-gray-600 hover:text-gray-400 transition-all text-[9px] font-black uppercase tracking-[0.25em] flex items-center justify-center space-x-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            <span>RETURN_TO_HUB</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
