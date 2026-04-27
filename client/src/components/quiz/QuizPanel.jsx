import React, { useState, useCallback } from 'react';
import { getQuizForAlgorithm } from '../../data/quizzes';

/**
 * QuizPanel Component
 * 
 * Displays 10 algorithm-specific questions, one at a time.
 * Tracks score, shows results, allows retry.
 */
const QuizPanel = ({ algorithmId, algorithmName, category }) => {
    const questions = getQuizForAlgorithm(algorithmId, algorithmName, category);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const question = questions[currentQ];

    const handleSelect = useCallback((optIndex) => {
        if (submitted) return;
        setSelected(optIndex);
    }, [submitted]);

    const handleSubmit = useCallback(() => {
        if (selected === null) return;
        const isCorrect = selected === question.answer;
        if (isCorrect) setScore(prev => prev + 1);
        setAnswers(prev => [...prev, { questionIndex: currentQ, selected, correct: question.answer, isCorrect }]);
        setSubmitted(true);
    }, [selected, question, currentQ]);

    const handleNext = useCallback(() => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(prev => prev + 1);
            setSelected(null);
            setSubmitted(false);
        } else {
            setShowResult(true);
        }
    }, [currentQ, questions.length]);

    const handleRetry = useCallback(() => {
        setCurrentQ(0);
        setSelected(null);
        setScore(0);
        setAnswers([]);
        setShowResult(false);
        setSubmitted(false);
    }, []);

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        const grade = percentage >= 90 ? 'Excellent' : percentage >= 70 ? 'Good' : percentage >= 50 ? 'Fair' : 'Needs Practice';
        const gradeColor = percentage >= 90 ? '#10b981' : percentage >= 70 ? '#06b6d4' : percentage >= 50 ? '#f59e0b' : '#ef4444';

        return (
            <div className="quiz-panel h-full flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {/* Score Card */}
                    <div className="text-center mb-8">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quiz Complete</div>
                        <div className="text-5xl font-bold font-mono mb-1" style={{ color: gradeColor }}>{score}/{questions.length}</div>
                        <div className="text-sm font-medium" style={{ color: gradeColor }}>{grade} — {percentage}%</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden mb-8">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percentage}%`, backgroundColor: gradeColor }} />
                    </div>

                    {/* Answer Review */}
                    <div className="space-y-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Answer Review</div>
                        {answers.map((a, i) => (
                            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border text-xs ${a.isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                <span className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5 ${a.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {a.isCorrect ? '✓' : '✗'}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-300 font-medium leading-snug">{questions[a.questionIndex].q}</p>
                                    {!a.isCorrect && (
                                        <p className="text-emerald-400/70 mt-1">Correct: {questions[a.questionIndex].options[a.correct]}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Retry Button */}
                <div className="p-4 border-t border-[#1e293b]">
                    <button onClick={handleRetry} className="w-full py-2.5 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] rounded-lg text-xs font-semibold text-gray-300 transition-colors">
                        Retry Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-panel h-full flex flex-col">
            {/* Progress Header */}
            <div className="px-5 py-3 border-b border-[#1e293b] flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                    Question {currentQ + 1} of {questions.length}
                </span>
                <span className="text-xs font-mono text-emerald-400">{score} correct</span>
            </div>

            {/* Progress dots */}
            <div className="px-5 py-2 flex gap-1">
                {questions.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        i < currentQ ? (answers[i]?.isCorrect ? 'bg-emerald-500' : 'bg-red-500')
                        : i === currentQ ? 'bg-blue-500' : 'bg-[#1e293b]'
                    }`} />
                ))}
            </div>

            {/* Question */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                <p className="text-sm font-medium text-gray-200 leading-relaxed mb-5">{question.q}</p>

                {/* Options */}
                <div className="space-y-2">
                    {question.options.map((opt, i) => {
                        let optClass = 'bg-[#0f172a] border-[#1e293b] text-gray-400 hover:border-[#334155] hover:text-gray-300';
                        if (submitted) {
                            if (i === question.answer) {
                                optClass = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300';
                            } else if (i === selected && i !== question.answer) {
                                optClass = 'bg-red-500/10 border-red-500/40 text-red-300';
                            } else {
                                optClass = 'bg-[#0f172a] border-[#1e293b] text-gray-600';
                            }
                        } else if (i === selected) {
                            optClass = 'bg-blue-500/10 border-blue-500/40 text-blue-300';
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(i)}
                                disabled={submitted}
                                className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-medium transition-all ${optClass}`}
                            >
                                <span className="inline-block w-5 text-gray-600 font-mono">{String.fromCharCode(65 + i)}.</span>
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Action Button */}
            <div className="p-4 border-t border-[#1e293b]">
                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selected === null}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-[#1e293b] disabled:text-gray-600 rounded-lg text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed"
                    >
                        Check Answer
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="w-full py-2.5 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] rounded-lg text-xs font-semibold text-gray-300 transition-colors"
                    >
                        {currentQ < questions.length - 1 ? 'Next Question' : 'View Results'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizPanel;
