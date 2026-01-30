import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useVisualization from '../hooks/useVisualization';
import algorithmRegistry from '../data/algorithms';
import API_URL from '../config/api';

const DesktopVisualization = () => {
    const { algorithmId } = useParams();
    const [algorithm, setAlgorithm] = useState(null);
    const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
    const [inputArrayText, setInputArrayText] = useState("64, 34, 25, 12, 22, 11, 90");
    const [searchTarget, setSearchTarget] = useState(25);
    const [steps, setSteps] = useState([]);
    const [selectedLang, setSelectedLang] = useState('cpp');
    const [isDualMode, setIsDualMode] = useState(false);
    const [visualizationMode, setVisualizationMode] = useState('memory'); // 'memory' or 'bars'
    const [copied, setCopied] = useState(false);
    const [accentColor, setAccentColor] = useState('#10b981'); // Default Emerald
    const [statsHistory, setStatsHistory] = useState([]);

    const themes = {
        '#10b981': { name: 'Emerald', glow: 'rgba(16, 185, 129, 0.3)', secondary: '#34d399' },
        '#06b6d4': { name: 'Voltage', glow: 'rgba(6, 182, 212, 0.3)', secondary: '#22d3ee' },
        '#ef4444': { name: 'Crimson', glow: 'rgba(239, 68, 68, 0.3)', secondary: '#f87171' }
    };

    useEffect(() => {
        const algData = algorithmRegistry[algorithmId];
        if (algData) {
            setAlgorithm(algData.algorithm);
            const generatedSteps = algData.generateSteps(inputArray, searchTarget);
            setSteps(generatedSteps);
        }
    }, [algorithmId, inputArray, searchTarget]);

    const {
        currentStep,
        currentStepIndex,
        isPlaying,
        speed,
        totalSteps,
        play,
        pause,
        stepForward,
        stepBackward,
        reset,
        changeSpeed,
        jumpToStep,
    } = useVisualization(steps);

    // Live Statistics Calculation
    const stats = React.useMemo(() => {
        let comparisons = 0;
        let swaps = 0;
        for (let i = 0; i <= currentStepIndex; i++) {
            if (steps[i]?.action === 'compare') comparisons++;
            if (steps[i]?.action === 'swap') swaps++;
        }
        return { comparisons, swaps };
    }, [currentStepIndex, steps]);

    // Live Efficiency Delta Tracking
    useEffect(() => {
        if (currentStepIndex === 0) {
            setStatsHistory([{ step: 0, val: 0 }]);
            return;
        }
        setStatsHistory(prev => {
            const currentTotal = stats.comparisons + stats.swaps;
            if (prev.some(s => s.step === currentStepIndex)) return prev;
            return [...prev, { step: currentStepIndex, val: currentTotal }].slice(-20);
        });
    }, [currentStepIndex, stats]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT') return;
            switch (e.code) {
                case 'Space': e.preventDefault(); isPlaying ? pause() : play(); break;
                case 'ArrowRight': stepForward(); break;
                case 'ArrowLeft': stepBackward(); break;
                case 'KeyR': reset(); break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, play, pause, stepForward, stepBackward, reset]);

    // Progress persistence
    useEffect(() => {
        const fetchInitialProgress = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const response = await axios.get(`${API_URL}/progress`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    const progress = response.data.data.find(p => p.algorithmId === algorithmId);
                    if (progress && progress.currentStep > 0 && progress.status !== 'completed') {
                        setTimeout(() => jumpToStep(progress.currentStep), 100);
                    }
                }
            } catch (err) { console.error("Progress fetch error:", err); }
        };
        if (steps.length > 0) fetchInitialProgress();
    }, [algorithmId, steps.length]);

    const updateBackendProgress = React.useCallback(async (status, stepIdx) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await axios.post(`${API_URL}/progress/update`, {
                algorithmId, status, currentStep: stepIdx, totalSteps
            }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) { console.error("Sync error:", err); }
    }, [algorithmId, totalSteps]);

    useEffect(() => {
        if (currentStepIndex > 0 || isPlaying) {
            const status = (currentStepIndex === totalSteps - 1 && totalSteps > 0) ? 'completed' : 'in_progress';
            updateBackendProgress(status, currentStepIndex);
        }
    }, [currentStepIndex, isPlaying, totalSteps, updateBackendProgress]);

    const handleRandomArray = () => {
        const newArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
        if (algorithmId === 'binary-search') newArray.sort((a, b) => a - b);
        setInputArray(newArray);
        setInputArrayText(newArray.join(', '));
        reset();
    };

    const handleRandomTarget = () => {
        if (inputArray.length > 0) {
            const randomIndex = Math.floor(Math.random() * inputArray.length);
            setSearchTarget(inputArray[randomIndex]);
            reset();
        }
    };

    const handleCustomArray = (value) => {
        setInputArrayText(value);
        if (!value) return;
        const arr = value.split(/[,\s]+/).map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        if (arr.length > 0) {
            const finalArr = algorithmId === 'binary-search' ? [...arr].sort((a, b) => a - b) : arr;
            setInputArray(finalArr);
            reset();
        }
    };

    const copyCode = () => {
        const code = algorithm.code[selectedLang];
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isComplete = currentStepIndex === totalSteps - 1 && totalSteps > 0;

    const renderVisualization = () => {
        const dataArr = currentStep?.array || inputArray;
        const maxVal = Math.max(...dataArr, 100);

        if (algorithm.category === 'Trees & Graphs') {
            return (
                <div className="tree-container">
                    {(() => {
                        const levels = [];
                        let i = 0;
                        while (i < dataArr.length) {
                            let size = Math.pow(2, levels.length);
                            levels.push(dataArr.slice(i, i + size));
                            i += size;
                        }
                        return levels.map((nodes, lIdx) => (
                            <div key={lIdx} className="tree-level" style={{ gap: `${Math.pow(2, (levels.length - 1 - lIdx)) * 2}rem` }}>
                                {nodes.map((val, nIdx) => {
                                    const globalIdx = Math.pow(2, lIdx) - 1 + nIdx;
                                    const state = currentStep?.states?.[globalIdx] || 'default';
                                    const ptrs = currentStep?.pointers?.filter(p => p.index === globalIdx) || [];
                                    return (
                                        <div key={nIdx} className="tree-node-wrapper group">
                                            {/* Neural HUD for Trees */}
                                            <div className="absolute -top-10 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <div className="bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-black uppercase text-gray-400">Node_ID: {globalIdx}</div>
                                            </div>
                                            <div className={`tree-node node-${state}`} style={{ borderColor: state !== 'default' ? accentColor : undefined, boxShadow: state !== 'default' ? `0 0 20px ${accentColor}44` : undefined }}>{val}</div>
                                            <div className="absolute -bottom-10 flex flex-col items-center">
                                                {ptrs.map((p, pi) => (
                                                    <div key={pi} className="px-2 py-1 text-white text-[9px] font-black uppercase rounded shadow-lg whitespace-nowrap mb-1 animate-bounce" style={{ background: p.color || accentColor }}>{p.label}</div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ));
                    })()}
                </div>
            );
        }

        if (visualizationMode === 'bars') {
            return (
                <div className="flex items-end justify-center h-[380px] gap-2 px-10 pt-20">
                    {dataArr.map((value, index) => {
                        const state = currentStep?.states?.[index] || 'default';
                        const height = (value / maxVal) * 100;
                        const pointers = currentStep?.pointers?.filter(p => p.index === index) || [];
                        return (
                            <div key={index} className="flex flex-col items-center group relative h-full justify-end" style={{ width: '44px' }}>
                                {pointers.map((p, pi) => (
                                    <div key={pi} className="absolute -top-16 animate-bounce flex flex-col items-center z-10">
                                        <div className="px-2 py-1 rounded-md text-[10px] font-black text-white shadow-xl whitespace-nowrap mb-1" style={{ backgroundColor: p.color }}>{p.label}</div>
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]" style={{ borderTopColor: p.color }} />
                                    </div>
                                ))}
                                <div className={`w-full rounded-t-xl transition-all duration-300 shadow-lg bar-${state}`} style={{ height: `${height}%` }}>
                                    <div className="absolute -top-7 w-full text-center text-[10px] font-black text-gray-400 opacity-0 group-hover:opacity-100 italic">VAL: {value}</div>
                                </div>
                                <div className="mt-3 text-[10px] font-black text-gray-500 font-mono">#{index}</div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="array-visualization">
                {dataArr.map((value, index) => {
                    const state = currentStep?.states?.[index] || 'default';
                    const pointers = currentStep?.pointers?.filter(p => p.index === index) || [];
                    return (
                        <div key={index} className="relative">
                            <div className={`array-box array-box-${state}`} style={{ borderColor: state !== 'default' ? accentColor : undefined, boxShadow: state !== 'default' ? `0 0 15px ${accentColor}44` : undefined }}>
                                <span className={`${algorithmId === 'linked-list' ? 'text-lg' : 'text-2xl'} font-bold`}>{value}</span>

                                {/* Premium SVG Connection for Linked List */}
                                {algorithmId === 'linked-list' && index < dataArr.length - 1 && (
                                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none z-0">
                                        <svg width="100%" height="100%" viewBox="0 0 40 20" fill="none">
                                            <path
                                                d="M0 10H30"
                                                stroke={accentColor}
                                                strokeOpacity="0.3"
                                                strokeWidth="2"
                                                strokeDasharray="4 2"
                                                className="animate-pulse"
                                            />
                                            <path
                                                d="M25 5L32 10L25 15"
                                                stroke={accentColor}
                                                strokeOpacity="0.3"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="array-index">{index}</div>

                            {/* Neural HUD: Variable Labels */}
                            {pointers.map((pointer, pIdx) => (
                                <div key={pIdx} className="array-pointer" style={{ bottom: `-${40 + (pIdx * 25)}px` }}>
                                    <div className="pointer-arrow" style={{ borderBottomColor: pointer.color || accentColor }} />
                                    <span className="pointer-label" style={{ background: pointer.color || accentColor, boxShadow: `0 4px 15px ${pointer.color || accentColor}44` }}>
                                        {pointer.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderCodeSection = () => (
        <div className="code-container">
            <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    {isDualMode ? 'Live Execution' : 'Code Implementation'}
                </h3>
                <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                        {['cpp', 'java', 'python'].map(lang => (
                            <button key={lang} className={`code-lang-btn ${selectedLang === lang ? 'code-lang-active' : ''}`} onClick={() => setSelectedLang(lang)}>{lang === 'cpp' ? 'C++' : lang.toUpperCase()}</button>
                        ))}
                    </div>
                    <button
                        onClick={copyCode}
                        className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-[#10b981] hover:border-[#10b981]/30 transition-all relative group"
                        title="Copy Code"
                    >
                        {copied ? (
                            <span className="text-[10px] font-black text-[#10b981] px-1 animate-pulse">COPIED</span>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                        )}
                    </button>
                </div>
            </div>
            <div className="code-display h-full">
                <pre className="text-sm">
                    {algorithm.code[selectedLang].split('\n').map((line, idx) => (
                        <div key={idx} className={`code-line ${currentStep?.codeLineHighlight === idx + 1 ? 'code-line-active' : ''}`}>
                            <span className="code-line-number">{idx + 1}</span>
                            <code className="text-gray-300">{line}</code>
                        </div>
                    ))}
                </pre>
            </div>
        </div>
    );

    if (!algorithm) return null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <style dangerouslySetInnerHTML={{
                __html: `
                .bar-default { background: linear-gradient(180deg, #334155 0%, #1e293b 100%); border: 1px solid #475569; }
                .bar-comparing { background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%); border: 1px solid #f59e0b; box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
                .bar-swapping { background: linear-gradient(180deg, #f87171 0%, #dc2626 100%); border: 1px solid #ef4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
                .bar-sorted { background: ${accentColor}; border: 1px solid ${accentColor}; box-shadow: 0 0 20px ${accentColor}44; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            `}} />

            <div className="desktop-container flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="desktop-header flex items-center justify-between px-6 py-4 bg-[#0f172a] border-b border-[#334155]">
                    <div className="flex items-center space-x-6">
                        <div>
                            <h1 className="text-xl font-black italic tracking-tighter text-white">{algorithm.name}</h1>
                            <div className="flex space-x-2 mt-1">
                                <span className="text-[10px] font-bold uppercase" style={{ color: accentColor }}>{algorithm.category}</span>
                                <span className="text-[10px] font-bold text-gray-500">•</span>
                                <span className="text-[10px] font-bold text-purple-400 uppercase">{algorithm.difficulty}</span>
                            </div>
                        </div>

                        {/* Neural Metrics Dashboard */}
                        <div className="hidden lg:flex items-center bg-black/30 px-4 py-2 rounded-2xl border border-white/5 space-x-6">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Comparisons</span>
                                <span className="text-sm font-mono font-black text-yellow-500 tabular-nums">{stats.comparisons}</span>
                            </div>
                            <div className="w-[1px] h-6 bg-white/5" />
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Swaps</span>
                                <span className="text-sm font-mono font-black text-red-500 tabular-nums">{stats.swaps}</span>
                            </div>
                            <div className="w-[1px] h-6 bg-white/5" />
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Complexity</span>
                                <span className="text-sm font-mono font-black tabular-nums" style={{ color: accentColor }}>{algorithm.complexity.time.average}</span>
                            </div>
                        </div>

                        {/* Theme Switcher */}
                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 space-x-1">
                            {Object.keys(themes).map(c => (
                                <button key={c} onClick={() => setAccentColor(c)} className={`w-4 h-4 rounded-full transition-transform ${accentColor === c ? 'scale-125 border-2 border-white' : 'opacity-40 hover:opacity-100'}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>

                        {algorithm.category !== 'Trees & Graphs' && (
                            <div className="flex bg-[#1e293b] p-1 rounded-xl border border-[#334155]">
                                <button onClick={() => setVisualizationMode('memory')} className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${visualizationMode === 'memory' ? 'bg-[#10b981] text-black' : 'text-gray-500'}`}>Memory</button>
                                <button onClick={() => setVisualizationMode('bars')} className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${visualizationMode === 'bars' ? 'bg-[#10b981] text-black' : 'text-gray-500'}`}>Bars</button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isDualMode && (
                            <div className="flex items-center space-x-3 pr-4 border-r border-[#334155]">
                                <button
                                    onClick={isPlaying ? pause : play}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPlaying ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/20'}`}
                                >
                                    {isPlaying ? 'PAUSE' : 'PLAY'}
                                </button>
                                <button
                                    onClick={reset}
                                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 border border-[#334155] hover:text-white hover:border-white/20 transition-all font-mono"
                                >
                                    RESET
                                </button>
                            </div>
                        )}
                        <button onClick={() => setIsDualMode(!isDualMode)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isDualMode ? 'bg-[#10b981] border-[#10b981] text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-[#334155] text-gray-400 hover:text-white'}`}>
                            {isDualMode ? 'Exit Dual Run' : 'Dual Run Mode'}
                        </button>
                        <Link to="/algorithms" className="text-gray-500 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar */}
                    {!isDualMode && (
                        <aside className="w-72 bg-[#1e293b]/20 border-r border-[#334155] p-6 overflow-y-auto custom-scrollbar">
                            <div className="panel-section mb-8">
                                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Playback Control</h3>
                                <div className="bg-[#0f172a] rounded-2xl p-4 border border-[#334155] mb-4 relative overflow-hidden group hover:border-white/10 transition-all">
                                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: accentColor }} />
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Execution</span>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
                                            <span className="text-[8px] font-black uppercase" style={{ color: accentColor }}>Active</span>
                                        </div>
                                    </div>
                                    <div className="flex items-baseline space-x-1">
                                        <span className="text-3xl font-black font-mono text-white tracking-tighter group-hover:text-[#10b981] transition-colors">{currentStepIndex + 1}</span>
                                        <span className="text-gray-600 font-black text-xl">/</span>
                                        <span className="text-gray-500 font-bold text-lg">{totalSteps}</span>
                                    </div>
                                    <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Total Sequential Steps</div>
                                </div>
                                <button onClick={isPlaying ? pause : play} className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg mb-3 ${isPlaying ? 'bg-red-500 text-white' : 'bg-[#10b981] text-black shadow-[#10b981]/20 hover:scale-[1.02]'}`}>
                                    {isPlaying ? 'PAUSE' : 'PLAY'}
                                </button>
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    <button onClick={stepBackward} disabled={currentStepIndex === 0} className="py-3 bg-[#1e293b] border border-[#334155] rounded-xl text-[9px] font-black opacity-80 hover:opacity-100 disabled:opacity-30">◄ PREV</button>
                                    <button onClick={stepForward} disabled={currentStepIndex >= totalSteps - 1} className="py-3 bg-[#1e293b] border border-[#334155] rounded-xl text-[9px] font-black opacity-80 hover:opacity-100 disabled:opacity-30">NEXT ►</button>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block text-center">Engine Warp Speed</span>
                                    <div className="flex justify-between bg-black/20 p-1 rounded-xl">
                                        {[0.5, 1, 2].map(s => (
                                            <button key={s} onClick={() => changeSpeed(s)} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${speed === s ? 'bg-[#334155] text-[#10b981] shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>{s}x</button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={reset} className="w-full mt-4 text-[9px] font-black tracking-[0.2em] uppercase transition-colors opacity-50 hover:opacity-100" style={{ color: accentColor }}>Reset Buffer</button>
                            </div>

                            {/* Complexity Plotter Widget */}
                            <div className="panel-section mb-8">
                                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Complexity Plotter</h3>
                                <div className="bg-black/40 rounded-2xl p-4 border border-[#334155] h-32 relative overflow-hidden">
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                                        <polyline
                                            fill="none"
                                            stroke={accentColor}
                                            strokeWidth="2"
                                            points={statsHistory.length > 1 ? statsHistory.map((s, i) => `${(i / (statsHistory.length - 1)) * 100},${50 - Math.min(50, s.val * 3)}`).join(' ') : "0,50 100,50"}
                                            className="transition-all duration-500"
                                        />
                                        <rect x="0" y="49" width="100" height="1" fill="#334155" />
                                    </svg>
                                    {/* Big_O watermark - fades out when data is present */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none font-black text-[30px] italic skew-x-[-15deg] transition-opacity duration-500"
                                        style={{
                                            color: accentColor,
                                            opacity: statsHistory.length <= 3 ? 0.1 : 0.02
                                        }}
                                    >
                                        Big_O
                                    </div>
                                </div>
                                <div className="mt-2 text-center">
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic tracking-tighter">Live Efficiency Delta Tracking</span>
                                </div>
                            </div>

                            <div className="panel-section">
                                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Memory Input</h3>
                                <div className="space-y-4">
                                    <input type="text" value={inputArrayText} onChange={(e) => setInputArrayText(e.target.value)} className="w-full bg-black/40 border border-[#334155] rounded-xl px-4 py-3 text-xs font-mono focus:border-[#10b981] outline-none" placeholder="Data Matrix..." />
                                    <button onClick={() => handleCustomArray(inputArrayText)} className="w-full py-2.5 bg-[#1e293b] border border-[#334155] rounded-xl text-[10px] font-black text-[#10b981] uppercase hover:bg-[#10b981]/5 transition-all">Update Memory</button>
                                    <button onClick={handleRandomArray} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black uppercase text-[10px] rounded-xl shadow-xl hover:shadow-[#10b981]/20">Regenerate Data</button>
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* Center Canvas / Visualization Side */}
                    <div className={`${isDualMode ? 'w-1/2' : 'flex-1'} relative overflow-y-auto custom-scrollbar flex flex-col border-r border-[#334155]/20`}>
                        <div className={`flex-1 flex flex-col items-center justify-center p-10 min-h-[500px] relative ${isComplete ? 'victory-glow' : ''}`}>
                            {/* Victory Celebration Overlay */}
                            {isComplete && (
                                <div className="absolute inset-0 flex items-end justify-center pb-20 pointer-events-none z-50">
                                    <div className="bg-[#10b981]/10 backdrop-blur-md border border-[#10b981]/20 text-[#10b981]/80 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl animate-fade-in border-white/5">
                                        Optimization Success Authenticated ✓
                                    </div>
                                </div>
                            )}

                            {renderVisualization()}

                            {/* Timeline Scrubber */}
                            <div className="mt-20 w-full max-w-2xl px-10">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Temporal Delta Scrubber</span>
                                    <span className="text-[9px] font-mono text-[#10b981] font-bold">{Math.round((currentStepIndex / (totalSteps - 1)) * 100)}% THROUGH LOGIC</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={totalSteps - 1}
                                    value={currentStepIndex}
                                    onChange={(e) => jumpToStep(parseInt(e.target.value))}
                                    className="w-full neural-scrubber"
                                />
                                <div className="flex justify-between mt-3">
                                    <span className="text-[9px] font-black text-gray-600 tracking-widest">T-MINUS 00:00</span>
                                    <span className="text-[9px] font-black text-gray-600 tracking-widest">SYSTEM_TERMINAL_EOS</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-[#334155] bg-black/5">
                            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white/50 mb-6">Algorithm Logic</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {algorithm.concept.simpleAlgorithm.map((step, idx) => (
                                    <div key={idx} className="p-6 bg-[#1e293b]/20 border border-[#334155] rounded-3xl relative overflow-hidden group hover:border-[#10b981]/30 transition-all">
                                        <div className="absolute -top-4 -left-4 text-7xl font-black text-white/[0.03] group-hover:text-[#10b981]/[0.05] transition-colors">{idx + 1}</div>
                                        <h4 className="text-[#10b981] font-black text-xs uppercase mb-2 relative z-10 tracking-widest">{step.title}</h4>
                                        <p className="text-gray-400 text-[11px] leading-relaxed relative z-10 font-medium">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {!isDualMode && (
                            <div className="p-10 border-t border-[#334155] relative group">
                                {renderCodeSection()}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Code & Watchers (Dual Mode) or Sidebar (Normal) */}
                    {isDualMode ? (
                        <div className="w-1/2 bg-[#020617] p-8 overflow-y-auto custom-scrollbar flex flex-col space-y-8">
                            <div className="flex-1">
                                {renderCodeSection()}
                            </div>

                            {/* Dual Mode Metrics Overlay */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1e293b]/30 p-6 rounded-3xl border border-white/5">
                                    <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Live Pointer Watcher</h3>
                                    <div className="space-y-2">
                                        {currentStep?.pointers?.map((p, i) => (
                                            <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                                                <span className="text-gray-400 uppercase">{p.label}</span>
                                                <span className="text-[#10b981] font-bold">[{p.index === -1 ? 'NULL' : p.index}]</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-[#1e293b]/30 p-6 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Objective</h3>
                                    <p className="text-white text-xs font-black uppercase italic tracking-tighter leading-tight">
                                        {currentStep?.explanation?.objective || 'Kernel Standby'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <aside className="w-80 bg-[#1e293b]/20 border-l border-[#334155] flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-[#334155]">
                                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse" />
                                    Live Variable Watcher
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                    {currentStep?.pointers?.length > 0 ? (
                                        currentStep.pointers.map((p, i) => (
                                            <div key={i} className="flex items-center justify-between bg-black/40 p-3 rounded-xl border-l-4 border-l-[#334155]" style={{ borderLeftColor: p.color }}>
                                                <span className="text-[10px] font-mono font-black text-gray-400">{p.label}</span>
                                                <span className="text-[11px] font-mono font-black text-white">{p.index === -1 ? 'NULL' : `#${p.index}`}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-[10px] text-gray-600 italic py-4 text-center">Awaiting pointer discovery...</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 p-6 flex flex-col min-h-0">
                                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Neural Log</h3>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                                    {currentStep?.explanation ? (
                                        <>
                                            <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl p-4">
                                                <span className="text-[8px] font-black text-[#10b981] uppercase block mb-1 tracking-widest">CURRENT FOCUS</span>
                                                <p className="text-white text-xs font-bold leading-tight uppercase italic tracking-tighter">{currentStep.explanation.objective || currentStep.action}</p>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155]">
                                                    <p className="text-gray-300 text-[11px] leading-relaxed font-medium">{currentStep.explanation.simple}</p>
                                                </div>
                                                {currentStep.explanation.why && (
                                                    <div className="bg-black/20 p-4 rounded-2xl border border-[#334155] border-dashed">
                                                        <span className="text-[8px] font-black text-gray-500 uppercase block mb-1">THEORETICAL WHY</span>
                                                        <p className="text-gray-400 text-[10px] italic leading-snug">{currentStep.explanation.why}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-600">
                                            <svg className="w-10 h-10 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Kernel Standby</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-black/40 border-t border-[#334155]">
                                <h3 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center">
                                    <span className="mr-2">&gt;_</span> Execution Console
                                </h3>
                                <div className="h-40 overflow-y-auto custom-scrollbar font-mono text-[9px] text-emerald-500/70 space-y-1">
                                    {steps.slice(0, currentStepIndex + 1).reverse().map((s, i, arr) => {
                                        const originalIdx = arr.length - 1 - i;
                                        return (
                                            <div key={originalIdx} className={`flex ${originalIdx === currentStepIndex ? 'text-emerald-400 bg-emerald-500/5' : ''}`}>
                                                <span className="opacity-20 mr-2">[{originalIdx.toString().padStart(2, '0')}]</span>
                                                <span className="truncate">{s.action?.toUpperCase()}: {s.explanation?.simple}</span>
                                            </div>
                                        );
                                    })}
                                    <div className="animate-pulse">▮</div>
                                </div>
                            </div>
                        </aside>
                    )}
                </main>

            </div>
        </div>
    );
};

export default DesktopVisualization;
