import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import algorithmRegistry, { getIcon } from '../data/algorithms';
import BookmarkButton from '../components/bookmarks/BookmarkButton';
import { API_URL } from '../config/api';

const AlgorithmList = () => {
    const navigate = useNavigate();
    const [fullProgressData, setFullProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            const token = localStorage.getItem('token');
            if (!token) { setLoading(false); return; }
            try {
                const response = await axios.get(`${API_URL}/progress`, { headers: { Authorization: `Bearer ${token}` } });
                if (response.data.success) setFullProgressData(response.data.data);
            } catch (err) { console.error("Failed to fetch progress:", err); }
            finally { setLoading(false); }
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
            <div className="min-h-screen flex items-center justify-center t-bg">
                <div className="text-center">
                    <div className="w-10 h-10 rounded-full animate-spin mx-auto mb-4" style={{ border: '2px solid var(--accent)', borderTopColor: 'transparent' }}></div>
                    <p className="t-text-muted text-sm font-medium">Loading algorithms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen t-bg t-text pb-24">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-16">
                    <h1 className="text-4xl font-bold mb-3">Algorithm Library</h1>
                    <p className="t-text-muted text-lg max-w-2xl">Explore and study every algorithm with interactive visualizations, code implementations, and quizzes.</p>
                </div>

                <div className="space-y-16">
                    {categories.map((category) => {
                        const algos = Object.entries(algorithmRegistry).filter(([_, data]) => data.algorithm.category === category);
                        return (
                            <div key={category}>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-xl font-semibold">{category}</h2>
                                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                                    <span className="text-xs t-text-dim font-medium">{algos.length} algorithms</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {algos.map(([id, data]) => (
                                        <AlgoCard key={id} id={id} algo={data.algorithm} status={getAlgoStatus(id)} />
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

const AlgoCard = ({ id, algo, status }) => {
    const statusConfig = {
        completed: { color: '#10b981', label: 'Completed' },
        in_progress: { color: 'var(--accent)', label: 'In Progress' },
        not_started: { color: 'var(--text-dim)', label: 'Not Started' }
    };
    const cfg = statusConfig[status];

    return (
        <Link to={`/algorithm/${id}`} className="block group">
            <div className="t-bg-card rounded-xl p-6 h-full flex flex-col transition-all"
                style={{ border: '1px solid var(--border)' }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center t-bg-elevated">{getIcon(id)}</div>
                    <div className="flex items-center gap-2">
                        <BookmarkButton algorithmId={id} algorithmName={algo.name} category={algo.category} size="sm" />
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ color: cfg.color, background: cfg.color + '15', border: `1px solid ${cfg.color}30` }}>{cfg.label}</span>
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold mb-1.5">{algo.name}</h3>
                    <p className="t-text-muted text-xs leading-relaxed line-clamp-2 mb-4">{algo.concept.keyIdea}</p>
                </div>
                <div className="pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex gap-4 text-[11px] font-mono t-text-dim">
                        <span>Time: <span className="t-text-secondary">{algo.complexity.time.average}</span></span>
                        <span>Space: <span className="t-text-secondary">{algo.complexity.space}</span></span>
                    </div>
                    <svg className="w-4 h-4 t-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>
        </Link>
    );
};

export default AlgorithmList;
