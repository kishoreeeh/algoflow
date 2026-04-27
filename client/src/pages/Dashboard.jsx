import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import algorithmRegistry, { getIcon } from '../data/algorithms';
import ExportProgress from '../components/export/ExportProgress';
import { useBookmarks } from '../context/BookmarkContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { bookmarks } = useBookmarks();
    const [progressData, setProgressData] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                // Fetch from Backend
                const response = await axios.get(`${API_URL}/progress`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                let backendProgress = response.data.success ? response.data.data : [];
                
                // MERGE WITH LOCAL STORAGE (Instant Feedback Logic)
                const localProgressMap = JSON.parse(localStorage.getItem('algoflow-progress') || '{}');
                
                // Create a merged progress list
                const merged = [...backendProgress];
                Object.entries(localProgressMap).forEach(([id, localData]) => {
                    const existingIdx = merged.findIndex(p => p.algorithmId === id);
                    if (existingIdx === -1) {
                        merged.push({ algorithmId: id, ...localData });
                    } else if (localData.status === 'completed') {
                        // Priority to local "completed" status for better UX
                        merged[existingIdx].status = 'completed';
                    }
                });

                setProgressData(merged);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                // Fallback to local only on error
                const localProgressMap = JSON.parse(localStorage.getItem('algoflow-progress') || '{}');
                setProgressData(Object.entries(localProgressMap).map(([id, d]) => ({ algorithmId: id, ...d })));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center t-bg">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // STATS
    const completed = progressData.filter(p => p.status === 'completed');
    const inProgress = progressData.filter(p => p.status === 'in_progress');
    const totalAlgos = Object.keys(algorithmRegistry).length;
    const overallProgress = Math.round((completed.length / totalAlgos) * 100);

    return (
        <div className="min-h-screen t-bg t-text px-8 py-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="t-text-muted mt-1">
                        Welcome back, <span className="text-primary font-semibold">{user?.name}</span>
                    </p>
                </div>

                <div className="flex gap-4">
                    <ExportProgress
                        bookmarks={bookmarks}
                        progressData={progressData}
                        userName={user?.name || 'User'}
                    />
                    <button className="px-5 py-2.5 rounded-lg t-bg-elevated t-text-muted hover:t-text transition-all text-sm font-medium border t-border">
                        Manage Progress
                    </button>
                </div>
            </div>

            <div className="h-px t-bg-elevated mb-10" style={{ backgroundColor: 'var(--border)' }} />

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="t-bg-card p-6 rounded-2xl border t-border transition-colors hover:border-emerald-500/30">
                    <p className="t-text-dim text-xs font-bold uppercase tracking-wider">Completed</p>
                    <h2 className="text-4xl font-bold mt-3 text-emerald-400">
                        {completed.length}
                        <span className="t-text-dim text-lg font-medium ml-2">/ {totalAlgos}</span>
                    </h2>
                </div>

                <div className="t-bg-card p-6 rounded-2xl border t-border transition-colors hover:border-primary/30">
                    <p className="t-text-dim text-xs font-bold uppercase tracking-wider">In Progress</p>
                    <h2 className="text-4xl font-bold mt-3 text-primary">
                        {inProgress.length}
                    </h2>
                </div>

                <div className="t-bg-card p-6 rounded-2xl border t-border transition-colors hover:border-purple-500/30">
                    <p className="t-text-dim text-xs font-bold uppercase tracking-wider">Overall Mastery</p>
                    <h2 className="text-4xl font-bold mt-3 text-purple-400">
                        {overallProgress}%
                    </h2>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECENT ALGORITHMS */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            Recent Algorithms
                        </h2>
                        <Link to="/algorithms" className="text-primary text-sm hover:underline">View All</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(algorithmRegistry).slice(0, 4).map(([id, data]) => {
                            const prog = progressData.find(p => p.algorithmId === id);
                            const status = prog ? prog.status : 'not_started';
                            
                            return (
                                <Link key={id} to={`/algorithm/${id}`} className="group">
                                    <div className="t-bg-card p-4 rounded-xl border t-border flex items-center justify-between transition-all group-hover:t-border-hover group-hover:t-bg-elevated">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg t-bg flex items-center justify-center border t-border">
                                                {getIcon(id)}
                                            </div>
                                            <span className="t-text font-medium">{data.algorithm.name}</span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                            status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                                            status === 'in_progress' ? 'bg-primary/10 text-primary' : 
                                            'bg-gray-800 text-gray-500'
                                        }`}>
                                            {status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* CATEGORY PROGRESS */}
                <div>
                    <h2 className="text-lg font-semibold mb-6">Mastery by Category</h2>
                    <div className="t-bg-card p-6 rounded-2xl border t-border space-y-8">
                        <CategoryBar label="Sorting Algorithms" progress={overallProgress > 50 ? 80 : 30} color="bg-emerald-500" />
                        <CategoryBar label="Searching & Arrays" progress={overallProgress > 20 ? 45 : 15} color="bg-blue-500" />
                        <CategoryBar label="Complex Data Structures" progress={overallProgress > 70 ? 90 : 10} color="bg-purple-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategoryBar = ({ label, progress, color }) => (
    <div>
        <div className="flex justify-between text-xs font-semibold mb-2.5">
            <span className="t-text-muted uppercase tracking-wider">{label}</span>
            <span className="t-text">{progress}%</span>
        </div>
        <div className="w-full t-bg h-2 rounded-full border t-border overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }} />
        </div>
    </div>
);

export default Dashboard;