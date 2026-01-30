import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

/**
 * Home Page - Premium Visual Experience
 * 
 * Landing page for the DSA learning platform with stunning visuals.
 */
const Home = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] overflow-hidden">
            {/* Hero Section with Advanced Visuals */}
            <section className="relative overflow-hidden bg-[#0f172a] border-b border-[#334155] py-12 md:py-16 min-h-[75vh] flex items-center">
                {/* Animated Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-emerald-500/30 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${10 + Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div>

                {/* Floating Code Snippets */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                    <div className="absolute top-20 left-10 text-emerald-400 font-mono text-xs animate-float-slow">for (i = 0; i &lt; n; i++)</div>
                    <div className="absolute top-40 right-20 text-cyan-400 font-mono text-xs animate-float-slow" style={{ animationDelay: '2s' }}>if (arr[i] &gt; arr[j])</div>
                    <div className="absolute bottom-32 left-1/4 text-emerald-400 font-mono text-xs animate-float-slow" style={{ animationDelay: '4s' }}>swap(a, b)</div>
                    <div className="absolute top-1/3 right-1/4 text-cyan-400 font-mono text-xs animate-float-slow" style={{ animationDelay: '1s' }}>O(n log n)</div>
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />

                <div className="container-custom relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Glowing Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 animate-fade-in">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Master DSA Visually</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight animate-fade-in">
                            Learn DSA the{' '}
                            <span className="relative inline-block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient">
                                    Visual Way
                                </span>
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-xl -z-10" />
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up font-medium">
                            Master Data Structures & Algorithms through{' '}
                            <span className="text-emerald-400 font-bold">step-by-step visualizations</span>,
                            simple explanations, and real-life analogies.
                        </p>

                        {/* Animated Stats */}
                        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-8 animate-slide-up">
                            <StatCard number="15+" label="Algorithms" delay="0s" />
                            <StatCard number="100%" label="Visual" delay="0.1s" />
                            <StatCard number="∞" label="Practice" delay="0.2s" />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up">
                            <Link to="/algorithms">
                                <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black text-base rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative flex items-center">
                                        Start Learning
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </button>
                            </Link>
                            <a href="#how-it-works">
                                <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white font-bold text-base rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 transition-all">
                                    How It Works
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-emerald-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Features Section - Enhanced */}
            <section className="section relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b]/30 to-[#0f172a]" />

                {/* Animated Geometric Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                    <div className="absolute top-20 left-10 w-32 h-32 border border-emerald-500/30 rounded-lg rotate-12 animate-spin-slow" />
                    <div className="absolute bottom-40 right-20 w-24 h-24 border border-cyan-500/30 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
                    <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-emerald-500/30 animate-bounce" style={{ animationDuration: '4s' }} />
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                            Why Choose <span className="text-emerald-400">Algo Flow</span>?
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Built for beginners who struggle with traditional DSA resources
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <EnhancedFeatureCard
                            icon="👁️"
                            title="Visual First"
                            description="See algorithms in action with beautiful, animated visualizations. Watch every step unfold before your eyes."
                            gradient="from-emerald-500/10 to-emerald-600/10"
                            borderColor="border-emerald-500/20"
                        />
                        <EnhancedFeatureCard
                            icon="💡"
                            title="Simple Explanations"
                            description="No jargon, no confusion. Every step is explained in plain English, like a friend teaching you."
                            gradient="from-cyan-500/10 to-cyan-600/10"
                            borderColor="border-cyan-500/20"
                        />
                        <EnhancedFeatureCard
                            icon="⭐"
                            title="Real-Life Analogies"
                            description="Understand concepts through everyday examples. We make abstract ideas concrete and relatable."
                            gradient="from-emerald-500/10 to-cyan-500/10"
                            borderColor="border-emerald-500/20"
                        />
                        <EnhancedFeatureCard
                            icon="▶️"
                            title="Control Your Pace"
                            description="Play, pause, step forward, or go back. Learn at your own speed without feeling rushed."
                            gradient="from-purple-500/10 to-purple-600/10"
                            borderColor="border-purple-500/20"
                        />
                        <EnhancedFeatureCard
                            icon="💻"
                            title="Code Walkthrough"
                            description="See the actual code alongside the visualization. Watch which line executes at each step."
                            gradient="from-blue-500/10 to-blue-600/10"
                            borderColor="border-blue-500/20"
                        />
                        <EnhancedFeatureCard
                            icon="🎓"
                            title="Build Confidence"
                            description="Start with basics and gradually build your skills. Every algorithm is beginner-friendly."
                            gradient="from-emerald-500/10 to-emerald-600/10"
                            borderColor="border-emerald-500/20"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section - Enhanced */}
            <section id="how-it-works" className="section bg-[#0f172a] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[200px] rounded-full" />

                {/* Animated Connection Lines */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <svg className="absolute top-0 left-0 w-full h-full">
                        <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" className="animate-dash" />
                        <line x1="90%" y1="20%" x2="10%" y2="80%" stroke="#06b6d4" strokeWidth="1" strokeDasharray="5,5" className="animate-dash" style={{ animationDelay: '1s' }} />
                    </svg>
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-white mb-4">How It Works</h2>
                        <p className="text-lg text-gray-400">Four simple steps to master any algorithm</p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        <EnhancedStepCard
                            number="1"
                            title="Understand the Concept"
                            description="Start with a real-life analogy and key idea. No code yet - just the core concept in simple terms."
                            icon="🧠"
                        />
                        <EnhancedStepCard
                            number="2"
                            title="Watch the Visualization"
                            description="See the algorithm in action with animated visualizations. Control the pace - play, pause, or step through."
                            icon="🎬"
                        />
                        <EnhancedStepCard
                            number="3"
                            title="Read Step-by-Step Explanations"
                            description="Each step comes with a clear explanation of what's happening and why. No confusion, just clarity."
                            icon="📖"
                        />
                        <EnhancedStepCard
                            number="4"
                            title="Study the Code"
                            description="Finally, see the actual code with line-by-line highlighting that matches the visualization."
                            icon="⚡"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section - Enhanced */}
            <section className="section relative overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] border-y border-[#334155]">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
                </div>

                <div className="container-custom text-center relative z-10">
                    <h2 className="text-4xl font-black mb-5 text-white">
                        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Start Learning</span>?
                    </h2>
                    <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
                        Join thousands of students who've overcome their fear of DSA and landed their dream jobs
                    </p>
                    <Link to="/algorithms">
                        <button className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative flex items-center">
                                Explore Algorithms
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </Link>
                </div>
            </section>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
                    50% { transform: translateY(-100px) translateX(50px); opacity: 0.6; }
                }
                .animate-float {
                    animation: float linear infinite;
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
                    50% { transform: translateY(-50px) translateX(30px); opacity: 0.8; }
                }
                .animate-float-slow {
                    animation: float-slow 15s ease-in-out infinite;
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                @keyframes dash {
                    to { stroke-dashoffset: -100; }
                }
                .animate-dash {
                    animation: dash 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

/**
 * Stat Card Component
 */
const StatCard = ({ number, label, delay }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" style={{ animationDelay: delay }}>
        <div className="text-3xl font-black text-emerald-400 mb-1">{number}</div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
);

/**
 * Enhanced Feature Card Component
 */
const EnhancedFeatureCard = ({ icon, title, description, gradient, borderColor }) => (
    <div className={`group relative bg-gradient-to-br ${gradient} backdrop-blur-sm border ${borderColor} rounded-3xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
        <div className="relative">
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="text-xl font-black text-white mb-2">{title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
    </div>
);

/**
 * Enhanced Step Card Component
 */
const EnhancedStepCard = ({ number, title, description, icon }) => (
    <div className="group flex items-start space-x-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all">
        <div className="relative flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg group-hover:scale-110 transition-transform">
                {number}
            </div>
            <div className="absolute -top-2 -right-2 text-2xl">{icon}</div>
        </div>
        <div className="flex-1 pt-1">
            <h3 className="text-xl font-black text-white mb-2">{title}</h3>
            <p className="text-gray-300 text-base leading-relaxed">{description}</p>
        </div>
    </div>
);

export default Home;
