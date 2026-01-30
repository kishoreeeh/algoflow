/**
 * Bubble Sort Algorithm Definition
 */

export const bubbleSortAlgorithm = {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    difficulty: 'Beginner',

    // Concept Explanation
    concept: {
        title: 'What is Bubble Sort?',
        analogy: `Imagine you have a line of students arranged by height, but they're in random order. 
    You walk down the line, and whenever you see a taller student standing before a shorter one, 
    you ask them to swap places. You keep doing this over and over until no more swaps are needed. 
    Eventually, all students will be in order from shortest to tallest!`,

        keyIdea: 'Compare adjacent elements and swap them if they are in the wrong order. Repeat until the array is sorted.',

        whenToUse: 'Bubble Sort is great for learning how sorting works, but it\'s slow for large datasets. Use it for small arrays or when teaching sorting concepts.',

        howItWorks: [
            'Start at the beginning of the array',
            'Compare each pair of adjacent elements',
            'If they are in the wrong order, swap them',
            'After each complete pass, the largest element "bubbles up" to its correct position',
            'Repeat until no more swaps are needed'
        ],
        simpleAlgorithm: [
            { title: 'Start from the first element', description: 'Compare the current element with the next one.' },
            { title: 'Swap if needed', description: 'If the left element is bigger than the right element → swap them.' },
            { title: 'Move to the next pair', description: 'Repeat the compare + swap process for all adjacent pairs in the array.' },
            { title: 'Repeat passes', description: 'Do the same steps again until no swaps are needed (array is sorted).' }
        ]
    },

    // Time and Space Complexity
    complexity: {
        time: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        space: 'O(1)',
        explanation: 'Bubble Sort compares every element with every other element, making it slow for large arrays. However, it uses very little extra memory.'
    },

    // Code in multiple languages
    code: {
        cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,

        java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,

        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`
    }
};

export const generateBubbleSortSteps = (inputArray) => {
    const steps = [];
    const arr = [...inputArray];
    const n = arr.length;

    // Initial state
    steps.push({
        action: 'initialize',
        array: [...arr],
        states: Array(n).fill('default'),
        pointers: [],
        explanation: {
            objective: 'System Preparation',
            simple: 'This is our starting array. The numbers are in random order.',
            why: 'Step zero is to identify all unsorted elements in the matrix.',
            visual: 'All boxes are gray, meaning no sorting work has been recorded yet.'
        },
        codeLineHighlight: null
    });

    let stepNumber = 1;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        // Start of new pass
        steps.push({
            action: 'pass-start',
            array: [...arr],
            states: arr.map((_, idx) => idx >= n - i ? 'sorted' : 'default'),
            pointers: [],
            explanation: {
                objective: `Initialize Sorting Pass ${i + 1}`,
                simple: `Starting pass ${i + 1}. We'll compare neighbors to bubble up the largest value.`,
                why: `Each pass is guaranteed to push the heaviest remaining element to its correct slot at the end.`,
                visual: `Green boxes are already verified as sorted. We are processing the gray sector.`
            },
            codeLineHighlight: 4
        });

        for (let j = 0; j < n - i - 1; j++) {
            // Comparing
            steps.push({
                action: 'compare',
                array: [...arr],
                states: arr.map((_, idx) => {
                    if (idx >= n - i) return 'sorted';
                    if (idx === j || idx === j + 1) return 'comparing';
                    return 'default';
                }),
                pointers: [
                    { index: j, label: 'j', color: '#8B5CF6' },
                    { index: j + 1, label: 'j+1', color: '#8B5CF6' }
                ],
                explanation: {
                    objective: 'Analyze Adjacent Pair',
                    simple: `Comparing ${arr[j]} and ${arr[j + 1]}.`,
                    why: `We check if the left element is greater than the right to determine if they need to be swapped.`,
                    visual: `Yellow boxes highlight the pair being verified right now.`
                },
                codeLineHighlight: 6
            });

            if (arr[j] > arr[j + 1]) {
                // Swapping
                steps.push({
                    action: 'swap',
                    array: [...arr],
                    states: arr.map((_, idx) => {
                        if (idx >= n - i) return 'sorted';
                        if (idx === j || idx === j + 1) return 'swapping';
                        return 'default';
                    }),
                    pointers: [
                        { index: j, label: 'Swap', color: '#EF4444' },
                        { index: j + 1, label: 'Swap', color: '#EF4444' }
                    ],
                    explanation: {
                        objective: 'Execute Position Swap',
                        simple: `${arr[j]} is larger than ${arr[j + 1]}, so they must swap.`,
                        why: `In an ascending sort, larger values must move towards higher indices (the right).`,
                        visual: `Red pulsing indicates a physical memory swap in progress.`
                    },
                    codeLineHighlight: 7
                });

                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;

                // After swap
                steps.push({
                    action: 'after-swap',
                    array: [...arr],
                    states: arr.map((_, idx) => idx >= n - i ? 'sorted' : 'default'),
                    pointers: [],
                    explanation: {
                        objective: 'Swap Verified',
                        simple: `The pair has been successfully reordered.`,
                        why: `The lower value now occupies the lower index.`,
                        visual: `The elements have changed visual positions.`
                    },
                    codeLineHighlight: 7
                });
            } else {
                // No swap needed
                steps.push({
                    action: 'no-swap',
                    array: [...arr],
                    states: arr.map((_, idx) => idx >= n - i ? 'sorted' : 'default'),
                    pointers: [],
                    explanation: {
                        objective: 'Validation Successful',
                        simple: `${arr[j]} is already smaller than or equal to ${arr[j + 1]}.`,
                        why: `No action is required as this pair satisfies the sorting condition.`,
                        visual: `Pair remains in original position.`
                    },
                    codeLineHighlight: 6
                });
            }
        }

        // End of pass - mark last element as sorted
        steps.push({
            action: 'pass-end',
            array: [...arr],
            states: arr.map((_, idx) => idx >= n - i - 1 ? 'sorted' : 'default'),
            pointers: [],
            explanation: {
                objective: `Finalize Pass ${i + 1}`,
                simple: `The number ${arr[n - i - 1]} has successfully "bubbled up" to its final position.`,
                why: `The largest of the remaining unsorted group is now correctly placed.`,
                visual: `A new box has been locked in green (Sorted).`
            },
            codeLineHighlight: 4
        });

        if (!swapped) {
            steps.push({
                action: 'early-termination',
                array: [...arr],
                states: Array(n).fill('sorted'),
                pointers: [],
                explanation: {
                    objective: 'Heuristic Optimization',
                    simple: `No swaps occurred during the last pass. Sorting is complete!`,
                    why: `If any pass completes without a single swap, the entire array is already perfectly ordered.`,
                    visual: `Emergency stop triggered. All boxes initialized to sorted status.`
                },
                codeLineHighlight: 11
            });
            break;
        }
    }

    // Final state
    steps.push({
        action: 'complete',
        array: [...arr],
        states: Array(n).fill('sorted'),
        pointers: [],
        explanation: {
            objective: 'Global Sorting Verification',
            simple: `Algorithm finished. All memory sectors are now in ascending order.`,
            why: `All logic conditions met. The dataset is perfectly organized.`,
            visual: `The array has achieved its terminal sorted state.`
        },
        codeLineHighlight: 14
    });

    return steps;
};

export default bubbleSortAlgorithm;
