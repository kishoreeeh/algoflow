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
    const icons = {
        'arrays': '📊',
        'bubble-sort': '🫧',
        'selection-sort': '🎯',
        'insertion-sort': '📥',
        'binary-search': '🔍',
        'linear-search': '🚶',
        'linked-list': '🔗',
        'stack': '🥞',
        'queue': '🎟️',
        'quick-sort': '⚡',
        'bst-search': '🌲',
        'bfs': '🌊',
        'dfs': '🧗',
        'heap': '👑'
    };
    return icons[id] || '⚙️';
};

export default algorithmRegistry;
