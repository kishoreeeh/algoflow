import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useVisualization from '../hooks/useVisualization';
import algorithmRegistry from '../data/algorithms';
import { API_URL } from '../config/api';
import MonacoEditor from '../components/code/MonacoEditor';
import NotesPanel from '../components/notes/NotesPanel';
import BookmarkButton from '../components/bookmarks/BookmarkButton';
import QuizPanel from '../components/quiz/QuizPanel';

const AlgorithmDetail = () => {
    const { algorithmId } = useParams();
    const [algorithm, setAlgorithm] = useState(null);
    const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
    const [inputArrayText, setInputArrayText] = useState("64, 34, 25, 12, 22, 11, 90");
    const [searchTarget, setSearchTarget] = useState(25);
    const [steps, setSteps] = useState([]);
    const [selectedLang, setSelectedLang] = useState('cpp');
    const [visualizationMode, setVisualizationMode] = useState('bars');
    const [copied, setCopied] = useState(false);
    const [rightTab, setRightTab] = useState('explain');
    const [isDualMode, setIsDualMode] = useState(false);

    // Draggable resizer state
    const [editorHeight, setEditorHeight] = useState(300);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startHeight = useRef(0);
    const centerRef = useRef(null);

    useEffect(() => {
        const algData = algorithmRegistry[algorithmId];
        if (algData) {
            setAlgorithm(algData.algorithm);
            const generatedSteps = algData.generateSteps(inputArray, searchTarget);
            setSteps(generatedSteps);
        }
    }, [algorithmId, inputArray, searchTarget]);

    const {
        currentStep, currentStepIndex, isPlaying, speed, totalSteps,
        play, pause, stepForward, stepBackward, reset, changeSpeed, jumpToStep,
    } = useVisualization(steps);

    // Stats
    const stats = React.useMemo(() => {
        let comparisons = 0, swaps = 0;
        for (let i = 0; i <= currentStepIndex; i++) {
            if (steps[i]?.action === 'compare') comparisons++;
            if (steps[i]?.action === 'swap') swaps++;
        }
        return { comparisons, swaps };
    }, [currentStepIndex, steps]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
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

    // ===== DRAGGABLE RESIZER LOGIC =====
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        isDragging.current = true;
        startY.current = e.clientY;
        startHeight.current = editorHeight;
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    }, [editorHeight]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging.current) return;
            const delta = startY.current - e.clientY;
            const newHeight = Math.max(100, Math.min(600, startHeight.current + delta));
            setEditorHeight(newHeight);
        };

        const handleMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

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
        // 1. Update LocalStorage immediately for instant feedback
        try {
            const localProgress = JSON.parse(localStorage.getItem('algoflow-progress') || '{}');
            localProgress[algorithmId] = { status, currentStep: stepIdx, totalSteps, updatedAt: new Date().toISOString() };
            localStorage.setItem('algoflow-progress', JSON.stringify(localProgress));
        } catch (e) { console.error("Local save error:", e); }

        // 2. Sync to Backend
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await axios.post(`${API_URL}/progress/update`, {
                algorithmId, status, currentStep: stepIdx, totalSteps
            }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) { console.error("Cloud sync error:", err); }
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
        navigator.clipboard.writeText(algorithm.code[selectedLang]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isComplete = currentStepIndex === totalSteps - 1 && totalSteps > 0;
    const progressPct = totalSteps > 1 ? Math.round((currentStepIndex / (totalSteps - 1)) * 100) : 0;

    // ======================== VISUALIZATION RENDERERS ========================

    const renderVisualization = () => {
        const dataArr = currentStep?.array || inputArray;
        const maxVal = Math.max(...dataArr, 1);

        if (algorithm.category === 'Trees & Graphs') {
            return (
                <div className="flex flex-col items-center gap-10 py-8">
                    {(() => {
                        const levels = [];
                        let i = 0;
                        while (i < dataArr.length) {
                            let size = Math.pow(2, levels.length);
                            levels.push(dataArr.slice(i, i + size));
                            i += size;
                        }
                        return levels.map((nodes, lIdx) => (
                            <div key={lIdx} className="flex justify-center" style={{ gap: `${Math.pow(2, (levels.length - 1 - lIdx)) * 2.5}rem` }}>
                                {nodes.map((val, nIdx) => {
                                    const globalIdx = Math.pow(2, lIdx) - 1 + nIdx;
                                    const state = currentStep?.states?.[globalIdx] || 'default';
                                    return (
                                        <div key={nIdx} className="flex flex-col items-center relative">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-base border-2 transition-all duration-300 ${
                                                state === 'comparing' ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                                : state === 'sorted' || state === 'found' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                                : state === 'swapping' ? 'bg-red-500/20 border-red-500 text-red-300'
                                                : 'bg-[#1e293b] border-[#475569] text-gray-200'
                                            }`}>
                                                {val}
                                            </div>
                                            <span className="text-[10px] text-gray-600 font-mono mt-1">idx {globalIdx}</span>
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
                <div className="flex items-end justify-center gap-3 px-8 py-8" style={{ height: '340px' }}>
                    {dataArr.map((value, index) => {
                        const state = currentStep?.states?.[index] || 'default';
                        const height = Math.max(8, (value / maxVal) * 100);
                        const pointers = currentStep?.pointers?.filter(p => p.index === index) || [];
                        return (
                            <div key={index} className="flex flex-col items-center group relative h-full justify-end" style={{ flex: '1 1 0', maxWidth: '60px' }}>
                                {pointers.map((p, pi) => (
                                    <div key={pi} className="absolute -top-8 flex flex-col items-center z-10">
                                        <div className="px-2 py-0.5 rounded text-[10px] font-semibold text-white whitespace-nowrap" style={{ backgroundColor: p.color || '#3b82f6' }}>{p.label}</div>
                                        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4" style={{ borderTopColor: p.color || '#3b82f6' }} />
                                    </div>
                                ))}
                                <div className={`w-full rounded-t transition-all duration-300 ${
                                    state === 'comparing' ? 'bg-amber-500' 
                                    : state === 'swapping' ? 'bg-red-500'
                                    : state === 'sorted' || state === 'found' ? 'bg-emerald-500'
                                    : 'bg-[#334155]'
                                }`} style={{ height: `${height}%`, minHeight: '8px' }}>
                                </div>
                                <div className="mt-2 text-[10px] text-gray-500 font-mono">{value}</div>
                                <div className="text-[9px] text-gray-700 font-mono">[{index}]</div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        // Memory / box view
        return (
            <div className="flex items-center justify-center gap-5 py-10 px-8 flex-wrap">
                {dataArr.map((value, index) => {
                    const state = currentStep?.states?.[index] || 'default';
                    const pointers = currentStep?.pointers?.filter(p => p.index === index) || [];
                    return (
                        <div key={index} className="relative flex flex-col items-center">
                            <span className="text-[10px] text-gray-600 font-mono mb-2">[{index}]</span>
                            <div className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all duration-300 ${
                                state === 'comparing' ? 'bg-amber-500/15 border-amber-500 text-amber-300 -translate-y-2'
                                : state === 'swapping' ? 'bg-red-500/15 border-red-500 text-red-300 -translate-y-3'
                                : state === 'sorted' || state === 'found' ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                                : 'bg-[#1e293b] border-[#475569] text-gray-200'
                            }`}>
                                {value}
                            </div>
                            {algorithmId === 'linked-list' && index < dataArr.length - 1 && (
                                <div className="absolute -right-5 top-1/2 mt-1 w-5 flex items-center">
                                    <div className="w-full h-px bg-[#475569]" />
                                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-4 border-l-[#475569] absolute right-0" />
                                </div>
                            )}
                            {pointers.map((pointer, pIdx) => (
                                <div key={pIdx} className="mt-1" style={{ marginTop: `${4 + pIdx * 20}px` }}>
                                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 mx-auto" style={{ borderBottomColor: pointer.color || '#3b82f6' }} />
                                    <span className="px-2 py-0.5 text-[10px] font-semibold text-white rounded block text-center" style={{ backgroundColor: pointer.color || '#3b82f6' }}>
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

    if (!algorithm) return null;

    return (
        <div className="h-screen flex flex-col bg-[#0a0f1a] text-gray-200" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
                .resize-handle { cursor: row-resize; }
                .resize-handle:hover .resize-bar { background-color: #3b82f6; }
                .resize-handle:active .resize-bar { background-color: #60a5fa; }
            `}} />

            {/* ============ TOP BAR ============ */}
            <header className="h-12 flex items-center justify-between px-4 bg-[#0f1520] border-b border-[#1e293b] flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/algorithms" className="text-gray-500 hover:text-gray-300 transition-colors p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div className="h-4 w-px bg-[#1e293b]" />
                    <h1 className="text-sm font-semibold text-gray-200">{algorithm.name}</h1>
                    <span className="text-[10px] font-medium text-gray-600 bg-[#1e293b] px-2 py-0.5 rounded">{algorithm.category}</span>
                    <span className="text-[10px] font-medium text-blue-400/70 bg-blue-500/10 px-2 py-0.5 rounded">{algorithm.difficulty}</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Metrics */}
                    <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono mr-2">
                        <span className="text-gray-500">Cmp: <span className="text-amber-400">{stats.comparisons}</span></span>
                        <span className="text-gray-500">Swp: <span className="text-red-400">{stats.swaps}</span></span>
                        <span className="text-gray-500">Time: <span className="text-emerald-400">{algorithm.complexity.time.average}</span></span>
                    </div>

                    {/* Dual Run toggle */}
                    <button
                        onClick={() => setIsDualMode(!isDualMode)}
                        className={`px-3 py-1 rounded text-[10px] font-semibold border transition-all ${
                            isDualMode
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : 'border-[#334155] text-gray-500 hover:text-gray-300 hover:border-[#475569]'
                        }`}
                    >
                        {isDualMode ? 'Exit Dual' : 'Dual Run'}
                    </button>

                    {/* View mode toggle */}
                    {algorithm.category !== 'Trees & Graphs' && (
                        <div className="flex bg-[#1e293b] rounded overflow-hidden border border-[#334155]">
                            <button onClick={() => setVisualizationMode('memory')} className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${visualizationMode === 'memory' ? 'bg-[#334155] text-gray-200' : 'text-gray-500 hover:text-gray-400'}`}>Cells</button>
                            <button onClick={() => setVisualizationMode('bars')} className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${visualizationMode === 'bars' ? 'bg-[#334155] text-gray-200' : 'text-gray-500 hover:text-gray-400'}`}>Bars</button>
                        </div>
                    )}

                    <BookmarkButton algorithmId={algorithmId} algorithmName={algorithm.name} category={algorithm.category} size="sm" />

                    <Link to="/algorithms" className="text-gray-600 hover:text-gray-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </Link>
                </div>
            </header>

            {/* ============ MAIN LAYOUT ============ */}
            <main className="flex-1 flex overflow-hidden">

                {/* ---------- LEFT PANEL: Controls (hidden in dual mode) ---------- */}
                {!isDualMode && (
                    <aside className="w-60 bg-[#0f1520] border-r border-[#1e293b] flex flex-col overflow-y-auto custom-scrollbar flex-shrink-0">
                        {/* Playback */}
                        <div className="p-4 border-b border-[#1e293b]">
                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Playback</div>
                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-2xl font-bold font-mono text-gray-200">{currentStepIndex + 1}</span>
                                <span className="text-gray-600 font-mono text-sm">/ {totalSteps}</span>
                                <span className="text-[10px] text-gray-600 ml-auto">steps</span>
                            </div>
                            <div className="h-1 bg-[#1e293b] rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-blue-500 transition-all duration-200 rounded-full" style={{ width: `${progressPct}%` }} />
                            </div>
                            <button onClick={isPlaying ? pause : play} className={`w-full py-2.5 rounded-lg font-semibold text-xs transition-all mb-2 ${isPlaying ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
                                {isPlaying ? 'Pause' : 'Play'}
                            </button>
                            <div className="grid grid-cols-2 gap-1.5 mb-3">
                                <button onClick={stepBackward} disabled={currentStepIndex === 0} className="py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-200 hover:border-[#475569] disabled:opacity-30 transition-all">Prev</button>
                                <button onClick={stepForward} disabled={currentStepIndex >= totalSteps - 1} className="py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-200 hover:border-[#475569] disabled:opacity-30 transition-all">Next</button>
                            </div>
                            <div className="flex items-center gap-1 bg-[#1e293b] p-0.5 rounded-lg">
                                {[0.5, 1, 2].map(s => (
                                    <button key={s} onClick={() => changeSpeed(s)} className={`flex-1 py-1 text-[10px] font-medium rounded transition-all ${speed === s ? 'bg-[#334155] text-blue-400' : 'text-gray-500 hover:text-gray-400'}`}>{s}x</button>
                                ))}
                            </div>
                            <button onClick={reset} className="w-full mt-2 py-1.5 text-[10px] font-medium text-gray-600 hover:text-gray-400 transition-colors">Reset</button>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-b border-[#1e293b]">
                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Input Data</div>
                            <input type="text" value={inputArrayText} onChange={(e) => setInputArrayText(e.target.value)}
                                className="w-full bg-[#0a0f1a] border border-[#1e293b] rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:border-blue-500/50 outline-none transition-colors mb-2"
                                placeholder="e.g. 64, 34, 25, 12" />
                            <button onClick={() => handleCustomArray(inputArrayText)} className="w-full py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-[10px] font-medium text-gray-400 hover:text-gray-200 hover:border-[#475569] transition-all mb-1.5">Apply</button>
                            <button onClick={handleRandomArray} className="w-full py-2 bg-blue-600/10 border border-blue-500/20 rounded-lg text-[10px] font-medium text-blue-400 hover:bg-blue-600/20 transition-all">Random Array</button>
                        </div>

                        {/* Algorithm Steps */}
                        <div className="p-4 flex-1">
                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">How It Works</div>
                            <div className="space-y-2">
                                {algorithm.concept.simpleAlgorithm.map((step, idx) => (
                                    <div key={idx} className="text-xs">
                                        <div className="flex items-start gap-2">
                                            <span className="text-[10px] font-mono text-blue-400 font-bold mt-0.5 flex-shrink-0">{idx + 1}.</span>
                                            <div>
                                                <span className="text-gray-300 font-medium">{step.title}</span>
                                                <p className="text-gray-600 text-[11px] leading-relaxed mt-0.5">{step.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                {/* ========== DUAL MODE LAYOUT ========== */}
                {isDualMode ? (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Half: Visualization */}
                        <div className="w-1/2 flex flex-col border-r border-[#1e293b] overflow-hidden">
                            {/* Compact controls bar */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#0f1520] border-b border-[#1e293b] flex-shrink-0">
                                <button onClick={isPlaying ? pause : play} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${isPlaying ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-blue-600 text-white'}`}>
                                    {isPlaying ? 'Pause' : 'Play'}
                                </button>
                                <button onClick={stepBackward} disabled={currentStepIndex === 0} className="px-2 py-1.5 bg-[#1e293b] border border-[#334155] rounded-lg text-[10px] text-gray-400 disabled:opacity-30">Prev</button>
                                <button onClick={stepForward} disabled={currentStepIndex >= totalSteps - 1} className="px-2 py-1.5 bg-[#1e293b] border border-[#334155] rounded-lg text-[10px] text-gray-400 disabled:opacity-30">Next</button>
                                <div className="flex items-center gap-0.5 bg-[#1e293b] p-0.5 rounded ml-1">
                                    {[0.5, 1, 2].map(s => (
                                        <button key={s} onClick={() => changeSpeed(s)} className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${speed === s ? 'bg-[#334155] text-blue-400' : 'text-gray-600'}`}>{s}x</button>
                                    ))}
                                </div>
                                <button onClick={reset} className="px-2 py-1.5 text-[10px] text-gray-600 hover:text-gray-400 ml-auto">Reset</button>
                                <span className="text-[10px] font-mono text-gray-500">
                                    {currentStepIndex + 1}/{totalSteps}
                                </span>
                            </div>

                            {/* Visualization */}
                            <div className="flex-1 relative flex flex-col items-center justify-center overflow-auto custom-scrollbar bg-[#0a0f1a]">
                                {isComplete && (
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[11px] font-medium">
                                        Complete
                                    </div>
                                )}
                                {renderVisualization()}
                            </div>

                            {/* Scrubber */}
                            <div className="px-4 py-3 bg-[#0f1520] border-t border-[#1e293b] flex-shrink-0">
                                <input type="range" min="0" max={totalSteps - 1} value={currentStepIndex}
                                    onChange={(e) => jumpToStep(parseInt(e.target.value))}
                                    className="w-full h-1 bg-[#1e293b] rounded-full appearance-none cursor-pointer
                                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer" />
                            </div>
                        </div>

                        {/* Right Half: Code + Live Metrics */}
                        <div className="w-1/2 flex flex-col overflow-hidden bg-[#0a0f1a]">
                            {/* Code Editor */}
                            <div className="flex-1 min-h-0">
                                <MonacoEditor
                                    code={algorithm.code}
                                    language={selectedLang}
                                    highlightLine={currentStep?.codeLineHighlight || null}
                                    onLanguageChange={setSelectedLang}
                                    readOnly={false}
                                />
                            </div>

                            {/* Live Metrics */}
                            <div className="flex-shrink-0 border-t border-[#1e293b] bg-[#0f1520]">
                                <div className="grid grid-cols-2 gap-3 p-4">
                                    {/* Variable Watcher */}
                                    <div className="bg-[#0a0f1a] border border-[#1e293b] rounded-lg p-3">
                                        <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Variables</div>
                                        <div className="space-y-1.5 max-h-28 overflow-y-auto custom-scrollbar">
                                            {currentStep?.pointers?.length > 0 ? (
                                                currentStep.pointers.map((p, i) => (
                                                    <div key={i} className="flex items-center justify-between text-[11px] font-mono">
                                                        <span className="text-gray-400">{p.label}</span>
                                                        <span className="text-emerald-400 font-semibold">{p.index === -1 ? 'null' : p.index}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-gray-600">Idle</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Current Step */}
                                    <div className="bg-[#0a0f1a] border border-[#1e293b] rounded-lg p-3">
                                        <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Step</div>
                                        <p className="text-xs text-gray-200 font-medium leading-snug">
                                            {currentStep?.explanation?.objective || 'Ready'}
                                        </p>
                                        {currentStep?.explanation?.simple && (
                                            <p className="text-[10px] text-gray-500 mt-1 leading-snug">{currentStep.explanation.simple}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Compact stats */}
                                <div className="flex items-center gap-4 px-4 pb-3 text-[10px] font-mono text-gray-600">
                                    <span>Comparisons: <span className="text-amber-400">{stats.comparisons}</span></span>
                                    <span>Swaps: <span className="text-red-400">{stats.swaps}</span></span>
                                    <span>Progress: <span className="text-blue-400">{progressPct}%</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ========== NORMAL MODE LAYOUT ========== */
                    <>
                        {/* ---------- CENTER: Visualization + Resizer + Code ---------- */}
                        <div ref={centerRef} className="flex-1 flex flex-col overflow-hidden min-w-0">

                            {/* Visualization Area */}
                            <div className="flex-1 relative flex flex-col items-center justify-center overflow-auto custom-scrollbar bg-[#0a0f1a]" style={{ minHeight: '200px' }}>
                                {isComplete && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-lg text-xs font-medium">
                                        Algorithm complete
                                    </div>
                                )}
                                {renderVisualization()}

                                {/* Timeline scrubber */}
                                <div className="w-full max-w-xl px-8 pb-6">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] text-gray-600 font-mono">Step {currentStepIndex + 1}</span>
                                        <span className="text-[10px] text-gray-600 font-mono">{progressPct}%</span>
                                    </div>
                                    <input type="range" min="0" max={totalSteps - 1} value={currentStepIndex}
                                        onChange={(e) => jumpToStep(parseInt(e.target.value))}
                                        className="w-full h-1 bg-[#1e293b] rounded-full appearance-none cursor-pointer
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer
                                            [&::-webkit-slider-thumb]:hover:bg-blue-400" />
                                </div>
                            </div>

                            {/* ===== DRAG RESIZER ===== */}
                            <div
                                className="resize-handle flex-shrink-0 h-3 flex items-center justify-center bg-[#0f1520] border-y border-[#1e293b] group hover:bg-[#131b2e] transition-colors select-none"
                                onMouseDown={handleMouseDown}
                            >
                                <div className="resize-bar w-12 h-1 rounded-full bg-[#334155] transition-colors group-hover:bg-blue-500" />
                            </div>

                            {/* Code Editor (resizable) */}
                            <div className="flex-shrink-0 overflow-hidden" style={{ height: `${editorHeight}px` }}>
                                <MonacoEditor
                                    code={algorithm.code}
                                    language={selectedLang}
                                    highlightLine={currentStep?.codeLineHighlight || null}
                                    onLanguageChange={setSelectedLang}
                                    readOnly={false}
                                />
                            </div>
                        </div>

                        {/* ---------- RIGHT PANEL: Tabs ---------- */}
                        <aside className="w-72 bg-[#0f1520] border-l border-[#1e293b] flex flex-col overflow-hidden flex-shrink-0">
                            <div className="flex border-b border-[#1e293b] flex-shrink-0">
                                {[
                                    { id: 'explain', label: 'Explain' },
                                    { id: 'console', label: 'Console' },
                                    { id: 'quiz', label: 'Quiz' },
                                ].map(tab => (
                                    <button key={tab.id} onClick={() => setRightTab(tab.id)}
                                        className={`flex-1 py-2.5 text-[11px] font-medium transition-colors border-b-2 ${
                                            rightTab === tab.id ? 'text-blue-400 border-blue-400 bg-blue-500/5' : 'text-gray-600 border-transparent hover:text-gray-400'
                                        }`}>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-hidden flex flex-col">
                                {rightTab === 'explain' && (
                                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                                        <div className="p-4 border-b border-[#1e293b]">
                                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Variables</div>
                                            <div className="space-y-1.5">
                                                {currentStep?.pointers?.length > 0 ? (
                                                    currentStep.pointers.map((p, i) => (
                                                        <div key={i} className="flex items-center justify-between bg-[#0a0f1a] px-3 py-2 rounded-lg border-l-2" style={{ borderLeftColor: p.color || '#3b82f6' }}>
                                                            <span className="text-[11px] font-mono text-gray-400">{p.label}</span>
                                                            <span className="text-[11px] font-mono font-semibold text-gray-200">{p.index === -1 ? 'null' : p.index}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-[11px] text-gray-600 py-2">No active variables</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4 border-b border-[#1e293b]">
                                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Step</div>
                                            {currentStep?.explanation ? (
                                                <div className="space-y-2">
                                                    {currentStep.explanation.objective && (
                                                        <div className="text-xs font-medium text-blue-400">{currentStep.explanation.objective}</div>
                                                    )}
                                                    <p className="text-[12px] text-gray-300 leading-relaxed">{currentStep.explanation.simple}</p>
                                                    {currentStep.explanation.why && (
                                                        <p className="text-[11px] text-gray-500 italic leading-relaxed border-l-2 border-[#1e293b] pl-3 mt-2">{currentStep.explanation.why}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-gray-600">Press Play to begin visualization</p>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <NotesPanel algorithmId={algorithmId} algorithmName={algorithm.name} />
                                        </div>
                                    </div>
                                )}

                                {rightTab === 'console' && (
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono text-[11px]">
                                        <div className="space-y-0.5">
                                            {steps.slice(0, currentStepIndex + 1).map((s, i) => (
                                                <div key={i} className={`py-0.5 flex ${i === currentStepIndex ? 'text-blue-400' : 'text-gray-600'}`}>
                                                    <span className="w-6 text-right mr-2 text-gray-700 flex-shrink-0">{i}</span>
                                                    <span className="truncate">{s.action}: {s.explanation?.simple}</span>
                                                </div>
                                            ))}
                                            {currentStepIndex >= 0 && <div className="text-gray-700 animate-pulse mt-1">_</div>}
                                        </div>
                                    </div>
                                )}

                                {rightTab === 'quiz' && (
                                    <QuizPanel algorithmId={algorithmId} algorithmName={algorithm.name} category={algorithm.category} />
                                )}
                            </div>
                        </aside>
                    </>
                )}
            </main>
        </div>
    );
};

export default AlgorithmDetail;
