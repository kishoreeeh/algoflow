import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

/**
 * Home Page - Theme-aware, professional landing
 */
const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen t-bg t-text" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Hero Section */}
            <section className="relative overflow-hidden py-12 md:py-20" style={{ borderBottom: '1px solid var(--border)' }}>
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)',
                    backgroundSize: '64px 64px'
                }} />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <Logo size={48} />
                        </div>

                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg mb-8" style={{ background: 'var(--accent-muted)', border: '1px solid var(--accent-border)' }}>
                            <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Interactive DSA Learning Platform</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                            Master Data Structures &{' '}
                            <span style={{ color: 'var(--accent)' }}>Algorithms</span>
                        </h1>

                        <p className="text-lg mb-10 t-text-secondary max-w-2xl mx-auto leading-relaxed">
                            Learn through interactive visualizations, step-by-step execution,
                            code in multiple languages, and built-in quizzes to test your understanding.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
                            {[{ n: '50+', l: 'Algorithms' }, { n: '10K+', l: 'Students' }, { n: '4', l: 'Languages' }].map(s => (
                                <div key={s.l} className="t-bg-secondary rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
                                    <div className="text-2xl font-bold">{s.n}</div>
                                    <div className="text-[11px] t-text-muted font-medium">{s.l}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link to={isAuthenticated() ? "/dashboard" : "/signup"}>
                                <button className="px-6 py-3 text-white font-medium rounded-lg transition-colors text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--accent)' }}>
                                    {isAuthenticated() ? 'Go to Dashboard' : 'Get Started'}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </button>
                            </Link>
                            <Link to="/algorithms">
                                <button className="px-6 py-3 t-bg-secondary t-text-secondary font-medium rounded-lg transition-all text-sm" style={{ border: '1px solid var(--border)' }}>
                                    Browse Algorithms
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold mb-3">Platform Features</h2>
                        <p className="t-text-muted max-w-xl mx-auto">Everything you need to master algorithms, from visualization to assessment</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} title="Step-by-Step Visualization" description="Watch algorithms execute in real-time with array bars, memory cells, and pointer tracking." />
                        <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>} title="Monaco Code Editor" description="VS Code-style editor with syntax highlighting, line-by-line execution tracking, and multi-language support." />
                        <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} title="Built-in Quizzes" description="10-question quizzes for every algorithm with instant scoring, answer review, and retry options." />
                        <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>} title="Personal Notes" description="Write and auto-save notes for each algorithm. Your notes persist across sessions." />
                        <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>} title="Bookmarks & Export" description="Bookmark algorithms and export progress as a professional PDF report." />
                        <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} title="Dual Run Mode" description="Side-by-side visualization and code execution for deeper understanding." />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="t-bg-secondary rounded-xl max-w-3xl mx-auto text-center p-12" style={{ border: '1px solid var(--border)' }}>
                        <h2 className="text-2xl font-bold mb-3">Ready to start learning?</h2>
                        <p className="t-text-muted mb-8 max-w-lg mx-auto">
                            Join thousands of developers building their DSA skills with interactive visualizations.
                        </p>
                        <Link to={isAuthenticated() ? "/dashboard" : "/signup"}>
                            <button className="px-6 py-3 text-white font-medium rounded-lg transition-colors text-sm" style={{ backgroundColor: 'var(--accent)' }}>
                                {isAuthenticated() ? 'Go to Dashboard' : 'Create Free Account'}
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="t-bg-secondary rounded-xl p-6 group" style={{ border: '1px solid var(--border)', transition: 'border-color 0.2s' }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
        <div className="mb-3" style={{ color: 'var(--accent)' }}>{icon}</div>
        <h3 className="text-base font-semibold mb-2">{title}</h3>
        <p className="t-text-muted text-sm leading-relaxed">{description}</p>
    </div>
);

export default Home;
