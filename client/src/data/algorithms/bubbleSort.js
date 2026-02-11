/**
 * Bubble Sort Algorithm Definition
 */

export const bubbleSortAlgorithm = {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    difficulty: 'Beginner',

    concept: {
        title: 'What is Bubble Sort?',
        analogy: `Imagine you have a line of students arranged by height, but they're in random order. You walk down the line, and whenever you see a taller student standing before a shorter one, you ask them to swap places. You keep doing this over and over until no more swaps are needed. eventually, all students will be in order from shortest to tallest!`,
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

    complexity: {
        time: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        space: 'O(1)',
        explanation: 'Bubble Sort compares every element with every other element, making it slow for large arrays. However, it uses very little extra memory.'
    },

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
        java: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
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
        System.out.println(Arrays.toString(arr));
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

    steps.push({
        action: 'initialize',
        array: [...arr],
        states: Array(n).fill('default'),
        pointers: [],
        explanation: {
            objective: 'System Preparation',
            simple: 'This is our starting array. The numbers are in random order.',
        },
        codeLineHighlight: 5
    });

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        steps.push({
            action: 'pass-start',
            array: [...arr],
            states: arr.map((_, idx) => idx >= n - i ? 'sorted' : 'default'),
            explanation: {
                objective: `Initialize Sorting Pass ${i + 1}`,
                simple: `Starting pass ${i + 1}.`,
            },
            codeLineHighlight: 6
        });

        for (let j = 0; j < n - i - 1; j++) {
            steps.push({
                action: 'compare',
                array: [...arr],
                states: arr.map((_, idx) => {
                    if (idx >= n - i) return 'sorted';
                    if (idx === j || idx === j + 1) return 'comparing';
                    return 'default';
                }),
                pointers: [
                    { index: j, label: 'j' },
                    { index: j + 1, label: 'j+1' }
                ],
                explanation: {
                    simple: `Comparing ${arr[j]} and ${arr[j + 1]}.`,
                },
                codeLineHighlight: 9
            });

            if (arr[j] > arr[j + 1]) {
                steps.push({
                    action: 'swap',
                    array: [...arr],
                    states: arr.map((_, idx) => {
                        if (idx >= n - i) return 'sorted';
                        if (idx === j || idx === j + 1) return 'swapping';
                        return 'default';
                    }),
                    explanation: {
                        simple: `${arr[j]} is larger than ${arr[j + 1]}, so they must swap.`,
                    },
                    codeLineHighlight: 10
                });

                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;

                steps.push({
                    action: 'after-swap',
                    array: [...arr],
                    states: arr.map((_, idx) => idx >= n - i ? 'sorted' : 'default'),
                    explanation: {
                        simple: `The pair has been successfully reordered.`,
                    },
                    codeLineHighlight: 13
                });
            }
        }

        if (!swapped) {
            steps.push({
                action: 'early-termination',
                array: [...arr],
                states: Array(n).fill('sorted'),
                explanation: {
                    simple: `No swaps occurred. Sorted!`,
                },
                codeLineHighlight: 16
            });
            break;
        }
    }

    steps.push({
        action: 'complete',
        array: [...arr],
        states: Array(n).fill('sorted'),
        explanation: {
            simple: `Algorithm finished.`,
        },
        codeLineHighlight: 18
    });

    return steps;
};

export default bubbleSortAlgorithm;
