/**
 * Visualization Engine
 * 
 * Core engine for managing algorithm visualization state and playback.
 * 
 * Features:
 * - Step management (forward, backward, reset)
 * - Playback control (play, pause, speed)
 * - State tracking
 * - Event handling
 */

export class VisualizationEngine {
    constructor(steps = []) {
        this.steps = steps;
        this.currentStepIndex = 0;
        this.isPlaying = false;
        this.speed = 1; // 1x speed (in seconds per step)
        this.playbackTimer = null;
        this.listeners = {
            stepChange: [],
            playStateChange: [],
            speedChange: [],
            reset: []
        };
    }

    /**
     * Get current step data
     */
    getCurrentStep() {
        if (this.currentStepIndex < 0 || this.currentStepIndex >= this.steps.length) {
            return null;
        }
        return this.steps[this.currentStepIndex];
    }

    /**
     * Get total number of steps
     */
    getTotalSteps() {
        return this.steps.length;
    }

    /**
     * Get current step index
     */
    getCurrentStepIndex() {
        return this.currentStepIndex;
    }

    /**
     * Check if at the end
     */
    isAtEnd() {
        return this.currentStepIndex >= this.steps.length - 1;
    }

    /**
     * Check if at the beginning
     */
    isAtBeginning() {
        return this.currentStepIndex === 0;
    }

    /**
     * Move to next step
     */
    stepForward() {
        if (this.isAtEnd()) {
            this.pause();
            return false;
        }

        this.currentStepIndex++;
        this.notifyListeners('stepChange', this.getCurrentStep());
        return true;
    }

    /**
     * Move to previous step
     */
    stepBackward() {
        if (this.isAtBeginning()) {
            return false;
        }

        this.currentStepIndex--;
        this.notifyListeners('stepChange', this.getCurrentStep());
        return true;
    }

    /**
     * Jump to specific step
     */
    jumpToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            return false;
        }

        this.currentStepIndex = stepIndex;
        this.notifyListeners('stepChange', this.getCurrentStep());
        return true;
    }

    /**
     * Reset to beginning
     */
    reset() {
        this.pause();
        this.currentStepIndex = 0;
        this.notifyListeners('reset', this.getCurrentStep());
        this.notifyListeners('stepChange', this.getCurrentStep());
    }

    /**
     * Start playback
     */
    play() {
        if (this.isPlaying || this.isAtEnd()) {
            return;
        }

        this.isPlaying = true;
        this.notifyListeners('playStateChange', true);
        this.startPlaybackLoop();
    }

    /**
     * Pause playback
     */
    pause() {
        if (!this.isPlaying) {
            return;
        }

        this.isPlaying = false;
        this.notifyListeners('playStateChange', false);
        this.stopPlaybackLoop();
    }

    /**
     * Toggle play/pause
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Set playback speed
     * @param {number} speed - Speed multiplier (0.5 = slow, 1 = normal, 2 = fast)
     */
    setSpeed(speed) {
        this.speed = speed;
        this.notifyListeners('speedChange', speed);

        // Restart playback loop if playing to apply new speed
        if (this.isPlaying) {
            this.stopPlaybackLoop();
            this.startPlaybackLoop();
        }
    }

    /**
     * Get current speed
     */
    getSpeed() {
        return this.speed;
    }

    /**
     * Start the playback loop
     * @private
     */
    startPlaybackLoop() {
        // Calculate delay based on speed (base delay is 1500ms)
        const baseDelay = 1500; // 1.5 seconds per step at 1x speed
        const delay = baseDelay / this.speed;

        this.playbackTimer = setInterval(() => {
            const hasNext = this.stepForward();

            if (!hasNext) {
                this.pause();
            }
        }, delay);
    }

    /**
     * Stop the playback loop
     * @private
     */
    stopPlaybackLoop() {
        if (this.playbackTimer) {
            clearInterval(this.playbackTimer);
            this.playbackTimer = null;
        }
    }

    /**
     * Add event listener
     * @param {string} event - Event name ('stepChange', 'playStateChange', 'speedChange', 'reset')
     * @param {Function} callback - Callback function
     */
    addEventListener(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    removeEventListener(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Notify all listeners of an event
     * @private
     */
    notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    /**
     * Load new steps
     */
    loadSteps(steps) {
        this.pause();
        this.steps = steps;
        this.currentStepIndex = 0;
        this.notifyListeners('reset', this.getCurrentStep());
        this.notifyListeners('stepChange', this.getCurrentStep());
    }

    /**
     * Cleanup - call this when component unmounts
     */
    destroy() {
        this.pause();
        this.listeners = {
            stepChange: [],
            playStateChange: [],
            speedChange: [],
            reset: []
        };
    }
}

export default VisualizationEngine;
