import React from 'react';
import Button from '../common/Button';

/**
 * PlaybackControls Component
 * 
 * Controls for algorithm visualization playback.
 * 
 * Features:
 * - Play/Pause toggle
 * - Step forward/backward
 * - Reset
 * - Speed control
 * 
 * Props:
 * - isPlaying: Boolean - current playback state
 * - onPlay: Function - play handler
 * - onPause: Function - pause handler
 * - onStepForward: Function - next step handler
 * - onStepBackward: Function - previous step handler
 * - onReset: Function - reset handler
 * - speed: Number - current speed (0.5x to 2x)
 * - onSpeedChange: Function - speed change handler
 * - currentStep: Number - current step index
 * - totalSteps: Number - total number of steps
 * - disabled: Boolean - disable all controls
 */
const PlaybackControls = ({
    isPlaying,
    onPlay,
    onPause,
    onStepForward,
    onStepBackward,
    onReset,
    speed = 1,
    onSpeedChange,
    currentStep = 0,
    totalSteps = 0,
    disabled = false,
}) => {
    // Handle play/pause toggle
    const handlePlayPause = () => {
        if (isPlaying) {
            onPause();
        } else {
            onPlay();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">
                    Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {speed}x speed
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-primary h-full transition-all duration-300 rounded-full"
                    style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
                />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-3">
                {/* Step Backward */}
                <Button
                    variant="icon"
                    onClick={onStepBackward}
                    disabled={disabled || currentStep === 0}
                    title="Previous Step"
                    className="hover:bg-gray-100"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                    </svg>
                </Button>

                {/* Play/Pause */}
                <Button
                    variant="primary"
                    onClick={handlePlayPause}
                    disabled={disabled || currentStep >= totalSteps}
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl"
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        // Pause Icon
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        // Play Icon
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </Button>

                {/* Step Forward */}
                <Button
                    variant="icon"
                    onClick={onStepForward}
                    disabled={disabled || currentStep >= totalSteps}
                    title="Next Step"
                    className="hover:bg-gray-100"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                </Button>

                {/* Reset */}
                <Button
                    variant="secondary"
                    onClick={onReset}
                    disabled={disabled}
                    title="Reset"
                    className="ml-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </Button>
            </div>

            {/* Speed Control */}
            <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Playback Speed
                </label>
                <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500 w-8">0.5x</span>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.5"
                        value={speed}
                        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                        disabled={disabled}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-xs text-gray-500 w-8">2x</span>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>Slower</span>
                    <span>Faster</span>
                </div>
            </div>
        </div>
    );
};

export default PlaybackControls;
