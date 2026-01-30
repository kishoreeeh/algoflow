import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import algorithmRegistry, { getIcon } from '../data/algorithms';

const API_URL = 'http://localhost:5001/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [ongoingModules, setOngoingModules] = useState([]);
    const [fullProgressData, setFullProgressData] = useState([]);

    // Dashboard Stats State
    const [stats, setStats] = useState({
        completed: 0,
        inProgress: 0,
        total: Object.keys(algorithmRegistry).length,
        percentage: 0,
        name: ''
    });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        try {
            const response = await axios.get(`${API_URL}/progress`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const progressData = response.data.data;
                setFullProgressData(progressData);

                const completed = progressData.filter(p => p.status === 'completed').length;
                const inProgressList = progressData.filter(p => p.status === 'in_progress');
                const inProgressCount = inProgressList.length;
                const total = Object.keys(algorithmRegistry).length;
                const percentage = Math.round((completed / total) * 100);

                setStats({
                    completed,
                    inProgress: inProgressCount,
                    total,
                    percentage,
                    name: parsedUser.name
                });

                setOngoingModules(inProgressList);
            }
        } catch (err) {
            console.error("Dashboard data sync failed:", err);
            setStats(prev => ({ ...prev, name: parsedUser.name }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const handleSaveProfile = () => {
        const updatedUser = { ...user, name: stats.name };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
    };

    const handleDeleteProgress = async (algoId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/progress/${algoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error("Failed to delete progress:", err);
        }
    };

    const getAlgoStatus = (id) => {
        const prog = fullProgressData.find(p => p.algorithmId === id);
        return prog ? prog.status : 'not_started';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <div className="text-center">
                    <div className="w-20 h-20 border-t-4 border-b-4 border-[#10b981] rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-[#10b981] font-black tracking-[0.3em] uppercase text-sm">Accessing Neural Core...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] pb-24 overflow-x-hidden">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-emerald-500/5 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-purple-500/5 blur-[140px] rounded-full" />
            </div>

            <div className="container-custom relative z-10 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 pb-8 border-b border-white/5">
                    <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-4">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Learning Link</span>
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter mb-2 italic">
                            Command <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Center</span>
                        </h1>
                        <p className="text-gray-400 text-xl">Identity Verified: <span className="text-white font-black">{user?.name}</span></p>
                    </div>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-8 py-4 border rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${isEditing ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[#1e293b] border-white/10 text-white hover:border-[#10b981]'}`}
                    >
                        {isEditing ? 'Exit Edit Mode' : 'Manage Statistics'}
                    </button>
                </div>

                {isEditing && (
                    <div className="glass-card rounded-[2.5rem] p-10 mb-16 border border-[#10b981]/30 animate-slide-up shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest text-emerald-500">System Identity</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Neural ID</label>
                                        <input
                                            type="text" value={stats.name}
                                            onChange={(e) => setStats({ ...stats, name: e.target.value })}
                                            className="w-full h-14 bg-[#020617] border border-white/10 rounded-xl px-6 text-white font-bold focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                    <button onClick={handleSaveProfile} className="px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all w-full md:w-auto">Update Identity</button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest text-red-500">Neural Overwrite</h3>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Active Components</label>
                                    <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                        {fullProgressData.length > 0 ? (
                                            fullProgressData.map((item) => (
                                                <div key={item.algorithmId} className="flex items-center justify-between p-4 bg-[#020617]/50 border border-white/5 rounded-xl group hover:border-red-500/30 transition-all">
                                                    <div>
                                                        <h4 className="text-white font-bold text-sm tracking-tight">{item.algorithmId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</h4>
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'completed' ? 'text-emerald-500' : 'text-cyan-500'}`}>{item.status.replace('_', ' ')}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteProgress(item.algorithmId)}
                                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                        title="Delete Progress"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center py-4">No active components found in matrix</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <MetricBox label="Modules Mastery" value={stats.completed} total={stats.total} desc="Verified Completions" theme="emerald" />
                    <MetricBox label="Neural Processing" value={stats.inProgress} desc="On-going Cycles" theme="cyan" />
                    <MetricBox label="Learning Sync" value={stats.percentage} unit="%" desc="Overall Progress" theme="purple" />
                </div>

                {/* ONGOING PROCESS LISTING */}
                {ongoingModules.length > 0 && (
                    <div className="mb-24 animate-fade-in">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Ongoing Process</h2>
                                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-black rounded-full border border-cyan-500/20">ACTIVE</span>
                            </div>
                            <div className="flex-1 h-[2px] bg-gradient-to-r from-cyan-500/20 to-transparent ml-8" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ongoingModules.map((module) => (
                                <ProcessCard key={module.algorithmId} module={module} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-4xl font-black text-white tracking-tight uppercase italic underline decoration-[#10b981] decoration-4 underline-offset-8">Algorithm Index</h2>
                            <Link to="/algorithms" className="px-4 py-2 bg-[#10b981]/10 text-[#10b981] text-[10px] font-black uppercase tracking-widest rounded-xl border border-[#10b981]/20 hover:bg-[#10b981] hover:text-black transition-all">
                                View Full Directory
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(algorithmRegistry).slice(0, 4).map(([id, data]) => (
                                <AlgoEntry
                                    key={id}
                                    id={id}
                                    name={data.algorithm.name}
                                    icon={getIcon(id)}
                                    status={getAlgoStatus(id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-4xl font-black text-white tracking-tight mb-10 uppercase italic">Execution Pulse</h2>
                        <div className="glass-card rounded-[3rem] p-10 border border-white/5 shadow-2xl">
                            <div className="space-y-10">
                                <PulseItem label="Sorting Logic" prog={stats.completed > 1 ? 100 : 30} color="bg-emerald-500" />
                                <PulseItem label="Search Patterns" prog={stats.completed > 3 ? 100 : 10} color="bg-cyan-500" />
                                <PulseItem label="Data Structures" prog={stats.completed > 5 ? 100 : 20} color="bg-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProcessCard = ({ module }) => {
    const info = algorithmRegistry[module.algorithmId]?.algorithm || { name: module.algorithmId };
    const progress = Math.round((module.currentStep / (module.totalSteps - 1)) * 100) || 1;

    return (
        <div className="group glass-card rounded-[2.5rem] p-8 border border-white/5 hover:border-cyan-500/30 transition-all relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full" />
            <div className="flex items-center space-x-5 mb-8">
                <div className="text-6xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">{getIcon(module.algorithmId)}</div>
                <div>
                    <h4 className="text-white font-black text-2xl tracking-tighter leading-none mb-1">{info.name}</h4>
                    <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Processing...</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                    <span>Neural Progress</span>
                    <span className="text-white">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-[#020617] rounded-full overflow-hidden p-[1px] border border-white/5">
                    <div className="h-full bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <Link to={`/algorithm/${module.algorithmId}`} className="block w-full py-4 bg-cyan-500 text-black text-center font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 transition-all shadow-xl">
                Resume Processing
            </Link>
        </div>
    );
};

const MetricBox = ({ label, value, total, unit, desc, theme }) => {
    const themes = {
        emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
        cyan: "text-cyan-500 bg-cyan-500/5 border-cyan-500/10",
        purple: "text-purple-500 bg-purple-500/5 border-purple-500/10"
    };

    return (
        <div className={`glass-card rounded-[2.5rem] p-10 border ${themes[theme]} flex flex-col items-center text-center group hover:bg-white/[0.02] transition-colors relative h-full`}>
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">{label}</h3>
            <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-7xl font-black text-white tracking-tighter leading-none">{value}</span>
                {unit && <span className="text-3xl font-black text-gray-500">{unit}</span>}
                {total && <span className="text-2xl font-black text-gray-700">/ {total}</span>}
            </div>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-t border-white/5 pt-4 w-full mt-auto">{desc}</p>
        </div>
    );
};

const AlgoEntry = ({ name, id, icon, status }) => {
    const statusMap = {
        completed: { label: 'Verified', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        in_progress: { label: 'Active', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        not_started: { label: 'Pending', color: 'text-gray-600', bg: 'bg-white/5' }
    };
    const s = statusMap[status];

    return (
        <Link to={`/algorithm/${id}`} className="block group">
            <div className={`glass-card rounded-[2rem] p-6 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between h-full`}>
                <div className="flex items-center space-x-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{icon}</div>
                    <h4 className="text-white font-black text-lg tracking-tight leading-none">{name}</h4>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/5 ${s.bg} ${s.color}`}>
                    {s.label}
                </span>
            </div>
        </Link>
    );
};

const PulseItem = ({ label, prog, color }) => (
    <div>
        <div className="flex justify-between mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>{label}</span>
            <span className="text-white">{prog}%</span>
        </div>
        <div className="h-3 w-full bg-[#020617] rounded-full border border-white/5 p-1">
            <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${prog}%` }} />
        </div>
    </div>
);

export default Dashboard;
