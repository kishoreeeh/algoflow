import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Challenge Mode - Interactive Practice Component
 * 
 * Allows users to predict algorithm steps and validate their understanding
 */
const ChallengeMode = ({ algorithm, steps, onComplete }) => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [userPrediction, setUserPrediction] = useState(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [hintLevel, setHintLevel] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [isComplete, setIsComplete] = useState(false);

    const totalSteps = steps.length;
    const currentStepData = steps[currentStep];

    // Predict next step
    const submitPrediction = (prediction) => {
        setAttempts(prev => prev + 1);
        setUserPrediction(prediction);

        // Validate prediction
        const isCorrect = validatePrediction(prediction, currentStepData);

        if (isCorrect) {
            setScore(prev => prev + calculatePoints());
            setFeedback({
                type: 'success',
                message: 'Excellent! Your prediction is correct.',
                points: calculatePoints()
            });

            // Move to next step after delay
            setTimeout(() => {
                if (currentStep < totalSteps - 1) {
                    setCurrentStep(prev => prev + 1);
                    resetStepState();
                } else {
                    completeChallenge();
                }
            }, 2000);
        } else {
            setFeedback({
                type: 'error',
                message: 'Not quite right. Try again or use a hint.',
                expected: currentStepData.action
            });
        }
    };

    // Validate user's prediction against correct answer
    const validatePrediction = (prediction, correctStep) => {
        // Check if predicted action matches
        if (prediction.action !== correctStep.action) return false;

        // Check if predicted indices match
        if (prediction.indices) {
            const correctIndices = correctStep.indices || [];
            if (JSON.stringify(prediction.indices.sort()) !== JSON.stringify(correctIndices.sort())) {
                return false;
            }
        }

        return true;
    };

    // Calculate points based on attempts and hints used
    const calculatePoints = () => {
        let points = 100;

        // Deduct points for multiple attempts
        points -= (attempts - 1) * 20;

        // Deduct points for hints
        points -= hintLevel * 15;

        return Math.max(points, 10); // Minimum 10 points
    };

    // Progressive hint system
    const getHint = () => {
        setShowHint(true);
        setHintLevel(prev => Math.min(prev + 1, 3));
    };

    const renderHint = () => {
        const hints = currentStepData.hints || [];
        if (hintLevel === 0) return null;

        return (
            <div className="card bg-blue-600/10 border-blue-600/20 p-4 mb-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <div className="font-semibold text-blue-400 mb-1">Hint {hintLevel}/3</div>
                        <div className="text-sm text-[#cbd5e1]">
                            {hints[hintLevel - 1] || 'Think about what action should be performed next.'}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const resetStepState = () => {
        setUserPrediction(null);
        setFeedback(null);
        setShowHint(false);
        setHintLevel(0);
        setAttempts(0);
    };

    const completeChallenge = () => {
        setIsComplete(true);
        if (onComplete) {
            onComplete({
                score,
                totalSteps,
                algorithmId: algorithm.id,
                userId: user?.id
            });
        }
    };

    if (isComplete) {
        return (
            <div className="card-elevated p-8 text-center">
                <div className="mb-6">
                    <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-[#f1f5f9] mb-4">Challenge Complete!</h2>
                <div className="text-5xl font-bold text-blue-400 mb-2">{score}</div>
                <div className="text-[#94a3b8] mb-6">Total Points Earned</div>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                    <div className="card p-4">
                        <div className="text-2xl font-bold text-[#f1f5f9]">{totalSteps}</div>
                        <div className="text-sm text-[#94a3b8]">Steps Completed</div>
                    </div>
                    <div className="card p-4">
                        <div className="text-2xl font-bold text-[#f1f5f9]">{Math.round((score / (totalSteps * 100)) * 100)}%</div>
                        <div className="text-sm text-[#94a3b8]">Accuracy</div>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Progress Header */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-[#f1f5f9]">Challenge Mode</h3>
                        <p className="text-sm text-[#94a3b8]">{algorithm.name}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">{score}</div>
                        <div className="text-xs text-[#94a3b8]">Points</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-[#1a1f2e] rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-[#94a3b8] mt-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
                </div>
            </div>

            {/* Current State Visualization */}
            <div className="card">
                <h4 className="font-semibold text-[#f1f5f9] mb-4">Current Array State</h4>
                <div className="flex gap-2 justify-center flex-wrap">
                    {currentStepData.array.map((value, index) => (
                        <div
                            key={index}
                            className={`array-element ${currentStepData.states[index] === 'sorted' ? 'array-element-sorted' :
                                    currentStepData.states[index] === 'comparing' ? 'array-element-comparing' :
                                        'array-element-default'
                                }`}
                        >
                            {value}
                        </div>
                    ))}
                </div>
            </div>

            {/* Hint Section */}
            {showHint && renderHint()}

            {/* Prediction Question */}
            <div className="card-elevated p-6">
                <h4 className="text-lg font-semibold text-[#f1f5f9] mb-4">
                    What happens next?
                </h4>
                <p className="text-[#cbd5e1] mb-6">
                    Based on the current state, predict the next action in the algorithm.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        className="btn btn-outline"
                        onClick={() => submitPrediction({ action: 'compare', indices: currentStepData.indices })}
                    >
                        Compare Elements
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => submitPrediction({ action: 'swap', indices: currentStepData.indices })}
                    >
                        Swap Elements
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => submitPrediction({ action: 'mark_sorted', indices: currentStepData.indices })}
                    >
                        Mark as Sorted
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => submitPrediction({ action: 'move_pointer', indices: currentStepData.indices })}
                    >
                        Move Pointer
                    </button>
                </div>

                {/* Hint Button */}
                {hintLevel < 3 && (
                    <button
                        className="btn btn-ghost mt-4 w-full"
                        onClick={getHint}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Get Hint ({3 - hintLevel} remaining)
                    </button>
                )}
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`card p-4 ${feedback.type === 'success' ? 'bg-green-600/10 border-green-600/20' : 'bg-red-600/10 border-red-600/20'
                    }`}>
                    <div className="flex items-start gap-3">
                        {feedback.type === 'success' ? (
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <div>
                            <div className={`font-semibold mb-1 ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {feedback.message}
                            </div>
                            {feedback.points && (
                                <div className="text-sm text-[#cbd5e1]">+{feedback.points} points earned</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChallengeMode;
