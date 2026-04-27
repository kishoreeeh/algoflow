import React from 'react';
import { bubbleSortAlgorithm, generateBubbleSortSteps } from './bubbleSort';
import { selectionSortAlgorithm, generateSelectionSortSteps } from './selectionSort';
import { insertionSortAlgorithm, generateInsertionSortSteps } from './insertionSort';
import { binarySearchAlgorithm, generateBinarySearchSteps } from './binarySearch';
import { linearSearchAlgorithm, generateLinearSearchSteps } from './linearSearch';
import { linkedListAlgorithm, generateLinkedListSteps } from './linkedList';
import { stackAlgorithm, generateStackSteps } from './stack';
import { queueAlgorithm, generateQueueSteps } from './queue';
import { arraysAlgorithm, generateArraysSteps } from './arrays';
import { quickSortAlgorithm, generateQuickSortSteps } from './quickSort';
import { bstSearchAlgorithm, generateBSTSearchSteps } from './bstSearch';
import { bfsAlgorithm, generateBFSSteps } from './bfs';
import { dfsAlgorithm, generateDFSSteps } from './dfs';
import { heapAlgorithm, generateHeapSteps } from './heap';
import { mergeSortAlgorithm, generateMergeSortSteps } from './mergeSort';

export const algorithmRegistry = {
    // Foundations
    'arrays': {
        algorithm: arraysAlgorithm,
        generateSteps: generateArraysSteps
    },
    // Searching
    'linear-search': {
        algorithm: linearSearchAlgorithm,
        generateSteps: generateLinearSearchSteps
    },
    'binary-search': {
        algorithm: binarySearchAlgorithm,
        generateSteps: generateBinarySearchSteps
    },
    // Sorting
    'bubble-sort': {
        algorithm: bubbleSortAlgorithm,
        generateSteps: generateBubbleSortSteps
    },
    'selection-sort': {
        algorithm: selectionSortAlgorithm,
        generateSteps: generateSelectionSortSteps
    },
    'insertion-sort': {
        algorithm: insertionSortAlgorithm,
        generateSteps: generateInsertionSortSteps
    },
    'quick-sort': {
        algorithm: quickSortAlgorithm,
        generateSteps: generateQuickSortSteps
    },
    'merge-sort': {
        algorithm: mergeSortAlgorithm,
        generateSteps: generateMergeSortSteps
    },
    // Data Structures
    'stack': {
        algorithm: stackAlgorithm,
        generateSteps: generateStackSteps
    },
    'queue': {
        algorithm: queueAlgorithm,
        generateSteps: generateQueueSteps
    },
    'linked-list': {
        algorithm: linkedListAlgorithm,
        generateSteps: generateLinkedListSteps
    },
    // Trees & Graphs
    'bst-search': {
        algorithm: bstSearchAlgorithm,
        generateSteps: generateBSTSearchSteps
    },
    'bfs': {
        algorithm: bfsAlgorithm,
        generateSteps: generateBFSSteps
    },
    'dfs': {
        algorithm: dfsAlgorithm,
        generateSteps: generateDFSSteps
    },
    'heap': {
        algorithm: heapAlgorithm,
        generateSteps: generateHeapSteps
    }
};

export const getIcon = (id) => {
    // Minimal SVG icons — no emojis
    const iconMap = {
        'arrays':         { color: '#3b82f6', path: 'M3 3h4v18H3zm7 4h4v14h-4zm7 8h4v6h-4z' },
        'bubble-sort':    { color: '#06b6d4', path: 'M7 20l5-5 5 5M7 4l5 5 5-5' },
        'selection-sort': { color: '#8b5cf6', path: 'M9 5l7 7-7 7' },
        'insertion-sort': { color: '#f59e0b', path: 'M12 3v18m-4-4l4 4 4-4' },
        'binary-search':  { color: '#10b981', path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
        'linear-search':  { color: '#ec4899', path: 'M4 12h16M12 4l8 8-8 8' },
        'linked-list':    { color: '#f97316', path: 'M4 12h4m4 0h4m-8 0a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4z' },
        'stack':          { color: '#ef4444', path: 'M4 6h16M4 12h16M4 18h10' },
        'queue':          { color: '#14b8a6', path: 'M4 12h12m-4-4l4 4-4 4M20 4v16' },
        'quick-sort':     { color: '#eab308', path: 'M13 10V3L4 14h7v7l9-11h-7z' },
        'bst-search':     { color: '#22c55e', path: 'M12 3v6m-4 2a4 4 0 108 0 4 4 0 00-8 0zm-4 6l4-2m12 2l-4-2' },
        'bfs':            { color: '#0ea5e9', path: 'M4 6h16M4 12h12M4 18h8' },
        'dfs':            { color: '#a855f7', path: 'M12 4v16m-6-6l6 6 6-6' },
        'heap':           { color: '#f43f5e', path: 'M12 4l8 6-8 6-8-6 8-6zm0 12v4' },
        'merge-sort':     { color: '#6366f1', path: 'M8 4v16M16 4v16M4 12h16' },
    };
    const icon = iconMap[id] || { color: '#64748b', path: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' };
    return React.createElement('svg', {
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
        stroke: icon.color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
    }, React.createElement('path', { d: icon.path }));
};

export default algorithmRegistry;
