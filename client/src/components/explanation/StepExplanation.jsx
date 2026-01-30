import React from 'react';
import Card from '../common/Card';

/**
 * StepExplanation Component
 * 
 * Displays step-by-step explanations in simple, beginner-friendly language.
 * 
 * Teaching Philosophy:
 * - One idea per step
 * - Explain "why", not just "what"
 * - Use analogies when helpful
 * - Very simple English
 * 
 * Props:
 * - step: Object containing:
 *   - simple: String - what is happening (plain English)
 *   - why: String - why we're doing this
 *   - analogy: String (optional) - real-life comparison
 *   - visual: String (optional) - what to look for
 * - stepNumber: Number - current step number
 */
const StepExplanation = ({ step, stepNumber }) => {
    if (!step) {
        return (
            <Card className="h-full">
                <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Click Play to start the visualization</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            {/* Step Number Badge */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{stepNumber}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Current Step</h3>
            </div>

            {/* Main Explanation */}
            <div className="space-y-4">
                {/* What is happening */}
                <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
                    <h4 className="text-sm font-semibold text-primary mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        What's Happening
                    </h4>
                    <p className="text-gray-800 leading-relaxed">{step.simple}</p>
                </div>

                {/* Why we're doing this */}
                {step.why && (
                    <div className="bg-purple-50 border-l-4 border-info p-4 rounded-r-lg">
                        <h4 className="text-sm font-semibold text-info mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            Why This Step
                        </h4>
                        <p className="text-gray-800 leading-relaxed">{step.why}</p>
                    </div>
                )}

                {/* Analogy (if provided) */}
                {step.analogy && (
                    <div className="bg-green-50 border-l-4 border-success p-4 rounded-r-lg">
                        <h4 className="text-sm font-semibold text-success mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Real-Life Example
                        </h4>
                        <p className="text-gray-800 leading-relaxed italic">{step.analogy}</p>
                    </div>
                )}

                {/* Visual cue (if provided) */}
                {step.visual && (
                    <div className="bg-yellow-50 border-l-4 border-warning p-4 rounded-r-lg">
                        <h4 className="text-sm font-semibold text-warning mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            Look For
                        </h4>
                        <p className="text-gray-800 leading-relaxed">{step.visual}</p>
                    </div>
                )}
            </div>

            {/* Helpful Tip */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>
                        <strong>Tip:</strong> Take your time to understand each step before moving forward.
                        There's no rush in learning!
                    </span>
                </p>
            </div>
        </Card>
    );
};

export default StepExplanation;
