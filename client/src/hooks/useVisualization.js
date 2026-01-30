import { useState, useEffect, useRef } from 'react';
import VisualizationEngine from '../engines/VisualizationEngine';

/**
 * useVisualization Hook
 * 
 * Custom React hook for managing visualization state.
 * 
 * @param {Array} steps - Array of visualization steps
 * @returns {Object} Visualization state and controls
 */
const useVisualization = (steps = []) => {
    const engineRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [totalSteps, setTotalSteps] = useState(0);

    // Initialize engine
    useEffect(() => {
        engineRef.current = new VisualizationEngine(steps);
        setTotalSteps(steps.length);
        setCurrentStep(engineRef.current.getCurrentStep());
        setCurrentStepIndex(0);

        // Setup event listeners
        const handleStepChange = (step) => {
            setCurrentStep(step);
            setCurrentStepIndex(engineRef.current.getCurrentStepIndex());
        };

        const handlePlayStateChange = (playing) => {
            setIsPlaying(playing);
        };

        const handleSpeedChange = (newSpeed) => {
            setSpeed(newSpeed);
        };

        engineRef.current.addEventListener('stepChange', handleStepChange);
        engineRef.current.addEventListener('playStateChange', handlePlayStateChange);
        engineRef.current.addEventListener('speedChange', handleSpeedChange);

        // Cleanup
        return () => {
            if (engineRef.current) {
                engineRef.current.destroy();
            }
        };
    }, [steps]);

    // Control functions
    const play = () => {
        if (engineRef.current) {
            engineRef.current.play();
        }
    };

    const pause = () => {
        if (engineRef.current) {
            engineRef.current.pause();
        }
    };

    const stepForward = () => {
        if (engineRef.current) {
            engineRef.current.stepForward();
        }
    };

    const stepBackward = () => {
        if (engineRef.current) {
            engineRef.current.stepBackward();
        }
    };

    const reset = () => {
        if (engineRef.current) {
            engineRef.current.reset();
        }
    };

    const changeSpeed = (newSpeed) => {
        if (engineRef.current) {
            engineRef.current.setSpeed(newSpeed);
        }
    };

    const jumpToStep = (stepIndex) => {
        if (engineRef.current) {
            engineRef.current.jumpToStep(stepIndex);
        }
    };

    return {
        // State
        currentStep,
        currentStepIndex,
        isPlaying,
        speed,
        totalSteps,

        // Controls
        play,
        pause,
        stepForward,
        stepBackward,
        reset,
        changeSpeed,
        jumpToStep,

        // Computed
        isAtEnd: currentStepIndex >= totalSteps - 1,
        isAtBeginning: currentStepIndex === 0,
    };
};

export default useVisualization;
