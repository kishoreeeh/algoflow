import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageTransition Component
 * 
 * Wraps pages with smooth enter/exit animations.
 * Use as a wrapper around page content.
 * 
 * Props:
 * - children: Page content
 * - variant: 'fade' | 'slideUp' | 'slideLeft' | 'scale'
 */

const variants = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slideUp: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    slideLeft: {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
    },
};

const PageTransition = ({ children, variant = 'slideUp' }) => {
    const v = variants[variant] || variants.slideUp;

    return (
        <motion.div
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * StaggerContainer - Animates children with stagger effect
 */
export const StaggerContainer = ({ children, staggerDelay = 0.08, className = '' }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/**
 * StaggerItem - Individual staggered child
 */
export const StaggerItem = ({ children, className = '' }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/**
 * FadeIn - Simple fade-in animation with optional direction
 */
export const FadeIn = ({
    children,
    delay = 0,
    direction = 'up',
    distance = 20,
    className = '',
}) => {
    const dirMap = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
        none: {},
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...dirMap[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
