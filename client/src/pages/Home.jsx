import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Home Page - Professional Enterprise Design
 * 
 * Landing page with formal, corporate aesthetic
 */
const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f2e] to-[#0a0e1a] text-[#e2e8f0]">
            {/* Hero Section - Professional */}
            <section className="relative overflow-hidden border-b border-[rgba(226,232,240,0.08)] py-20 md:py-32">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />

                {/* Professional Gradient Overlay */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Professional Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600/10 border border-blue-600/20 mb-6">
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Enterprise DSA Platform</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-[#f1f5f9]">
                            Master Data Structures &{' '}
                            <span className="text-blue-400">Algorithms</span>
                        </h1>

                        <p className="text-lg md:text-xl mb-10 text-[#cbd5e1] max-w-2xl mx-auto leading-relaxed font-normal">
                            Professional learning platform with interactive visualizations,
                            comprehensive analytics, and AI-powered assistance for technical excellence.
                        </p>

                        {/* Professional Stats */}
                        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                            <StatCard number="50+" label="Algorithms" />
                            <StatCard number="10K+" label="Students" />
                            <StatCard number="95%" label="Success Rate" />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to={isAuthenticated() ? "/dashboard" : "/signup"}>
                                <button className="btn btn-primary btn-lg">
                                    {isAuthenticated() ? 'Go to Dashboard' : 'Get Started'}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </Link>
                            <Link to="/algorithms">
                                <button className="btn btn-outline btn-lg">
                                    Explore Algorithms
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Professional Grid */}
            <section className="section relative">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#f1f5f9] mb-4">
                            Platform Capabilities
                        </h2>
                        <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
                            Comprehensive learning tools designed for professional development
                        </p>
                    </div>

                    <div className="grid-professional">
                        <FeatureCard
                            icon={<VisualizationIcon />}
                            title="Interactive Visualizations"
                            description="Step-by-step algorithm execution with professional-grade visual representations and real-time state tracking."
                        />
                        <FeatureCard
                            icon={<AnalyticsIcon />}
                            title="Advanced Analytics"
                            description="Comprehensive progress tracking, performance metrics, and personalized learning insights with data visualization."
                        />
                        <FeatureCard
                            icon={<AIIcon />}
                            title="AI-Powered Assistance"
                            description="24/7 intelligent tutoring system with code explanation, error analysis, and personalized recommendations."
                        />
                        <FeatureCard
                            icon={<CodeIcon />}
                            title="Multi-Language Support"
                            description="Implementation examples in JavaScript, Python, Java, and C++ with syntax highlighting and best practices."
                        />
                        <FeatureCard
                            icon={<PracticeIcon />}
                            title="Interactive Practice"
                            description="Hands-on coding challenges, quizzes, and real-world problem-solving scenarios with instant feedback."
                        />
                        <FeatureCard
                            icon={<CertificateIcon />}
                            title="Professional Certificates"
                            description="Industry-recognized completion certificates with verification codes for resume and LinkedIn profiles."
                        />
                    </div>
                </div>
            </section>

            {/* Learning Path Section */}
            <section className="section bg-[#1a1f2e]/30 border-y border-[rgba(226,232,240,0.08)]">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#f1f5f9] mb-4">
                            Structured Learning Paths
                        </h2>
                        <p className="text-lg text-[#94a3b8]">
                            Choose your track based on your career goals
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <PathCard
                            title="Interview Preparation"
                            description="Master the most frequently asked DSA questions from top tech companies"
                            algorithms="25 Algorithms"
                            duration="8 Weeks"
                        />
                        <PathCard
                            title="Competitive Programming"
                            description="Advanced algorithms and optimization techniques for coding competitions"
                            algorithms="40 Algorithms"
                            duration="12 Weeks"
                        />
                        <PathCard
                            title="Academic Excellence"
                            description="Comprehensive curriculum aligned with computer science degree programs"
                            algorithms="50 Algorithms"
                            duration="16 Weeks"
                        />
                        <PathCard
                            title="Quick Revision"
                            description="Rapid review of essential concepts for exam preparation"
                            algorithms="15 Algorithms"
                            duration="4 Weeks"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section">
                <div className="container-custom">
                    <div className="card-elevated max-w-4xl mx-auto text-center p-12">
                        <h2 className="text-3xl font-bold mb-4 text-[#f1f5f9]">
                            Begin Your Professional Development Journey
                        </h2>
                        <p className="text-lg text-[#cbd5e1] mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals advancing their careers through structured DSA mastery
                        </p>
                        <Link to={isAuthenticated() ? "/dashboard" : "/signup"}>
                            <button className="btn btn-primary btn-lg">
                                {isAuthenticated() ? 'Access Dashboard' : 'Create Account'}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Professional Stat Card
const StatCard = ({ number, label }) => (
    <div className="card text-center p-6">
        <div className="text-3xl font-bold text-blue-400 mb-2">{number}</div>
        <div className="text-sm font-medium text-[#94a3b8] uppercase tracking-wider">{label}</div>
    </div>
);

// Professional Feature Card
const FeatureCard = ({ icon, title, description }) => (
    <div className="card-hover group">
        <div className="mb-4 text-blue-400">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-[#f1f5f9] mb-3">{title}</h3>
        <p className="text-[#94a3b8] leading-relaxed">{description}</p>
    </div>
);

// Professional Path Card
const PathCard = ({ title, description, algorithms, duration }) => (
    <div className="card-hover">
        <h3 className="text-xl font-semibold text-[#f1f5f9] mb-3">{title}</h3>
        <p className="text-[#94a3b8] mb-4 leading-relaxed">{description}</p>
        <div className="flex items-center gap-4 text-sm">
            <span className="badge badge-info">{algorithms}</span>
            <span className="badge badge-neutral">{duration}</span>
        </div>
    </div>
);

// Professional Icons
const VisualizationIcon = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const AnalyticsIcon = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const AIIcon = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const CodeIcon = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const PracticeIcon = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
);

const CertificateIcon = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

export default Home;
