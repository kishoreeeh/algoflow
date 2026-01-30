import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import algorithmRegistry, { getIcon } from '../data/algorithms';

import API_URL from '../config/api';

const AlgorithmList = () => {
    const navigate = useNavigate();
    const [fullProgressData, setFullProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/progress`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setFullProgressData(response.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch progress:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const getAlgoStatus = (id) => {
        const prog = fullProgressData.find(p => p.algorithmId === id);
        return prog ? prog.status : 'not_started';
    };

    const categories = [...new Set(Object.values(algorithmRegistry).map(a => a.algorithm.category))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <div className="text-center">
                    <div className="w-20 h-20 border-t-4 border-b-4 border-cyan-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-cyan-500 font-black tracking-[0.3em] uppercase text-sm">Decoding Matrix...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] pb-24 overflow-x-hidden">
            {/* Ambient Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/5 blur-[160px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/5 blur-[160px] rounded-full" />
            </div>

            <div className="container-custom relative z-10 py-16">
                {/* Header */}
                <div className="mb-20 text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-6 mx-auto">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Full Repository Access</span>
                    </div>
                    <h1 className="text-7xl font-black text-white tracking-tighter mb-4 italic">
                        Neural <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Library</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">
                        Access the complete architectural blueprints for every algorithm and data structure in the system.
                    </p>
                </div>

                {/* Categories Breakdown */}
                <div className="space-y-24">
                    {categories.map((category) => {
                        const algos = Object.entries(algorithmRegistry).filter(([_, data]) => data.algorithm.category === category);

                        return (
                            <div key={category} className="animate-fade-in">
                                <div className="flex items-center space-x-6 mb-12">
                                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{category}</h2>
                                    <div className="flex-1 h-[2px] bg-gradient-to-r from-white/10 to-transparent" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {algos.map(([id, data]) => (
                                        <FullAlgoCard
                                            key={id}
                                            id={id}
                                            algo={data.algorithm}
                                            status={getAlgoStatus(id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const FullAlgoCard = ({ id, algo, status }) => {
    const statusConfig = {
        completed: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Decoded' },
        in_progress: { color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', label: 'Processing' },
        not_started: {
            color: localStorage.getItem('token') ? 'text-gray-500' : 'text-cyan-400',
            bg: 'bg-white/5',
            border: 'border-white/5',
            label: localStorage.getItem('token') ? 'Locked' : 'Launch'
        }
    };

    const cfg = statusConfig[status];

    return (
        <Link to={`/algorithm/${id}`} className="block group">
            <div className={`glass-card rounded-[2.5rem] p-10 border ${cfg.border} hover:bg-white/[0.03] transition-all relative overflow-hidden h-full flex flex-col`}>
                <div className="flex items-start justify-between mb-8">
                    <div className="text-6xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        {getIcon(id)}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${cfg.border} ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                    </span>
                </div>

                <div className="flex-1">
                    <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-3">{algo.name}</h3>
                    <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6">
                        {algo.concept.keyIdea}
                    </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex space-x-4">
                        <div className="text-center">
                            <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest">Time</span>
                            <span className="text-[10px] font-bold text-white uppercase italic">{algo.complexity.time.average}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest">Space</span>
                            <span className="text-[10px] font-bold text-white uppercase italic">{algo.complexity.space}</span>
                        </div>
                    </div>

                    <div className="flex items-center text-[10px] font-black text-cyan-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        Initiate <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AlgorithmList;
