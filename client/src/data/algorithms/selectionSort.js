export const selectionSortAlgorithm = {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Sorting',
    difficulty: 'Beginner',
    concept: {
        title: 'Selection Sort',
        keyIdea: 'Find the smallest item and move it to the front, one by one.',
        analogy: 'Imagine organizing a hand of cards. You look through all the cards to find the smallest one, pick it out, and put it at the very front. Then you look at the remaining cards, find the next smallest, and put it next. You keep doing this until all cards are sorted.',
        visual: 'Watch for the "Minimum" pointer finding the smallest number in the unsorted part.',
        simpleAlgorithm: [
            { title: 'Assume first as minimum', description: 'Start by picking the first element as the current minimum.' },
            { title: 'Scan for smallest', description: 'Look through the remaining unsorted elements to find the actual minimum.' },
            { title: 'Swap if needed', description: 'Swap the found minimum with the starting element of that pass.' },
            { title: 'Move forward', description: 'Repeat for the next position until the entire array is processed.' }
        ]
    },
    complexity: {
        time: {
            best: 'O(n²)',
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        space: 'O(1)',
        explanation: 'Selection sort always scans the unsorted part to find the minimum, so it takes the same amount of time regardless of whether the array is already sorted or not.'
    },
    code: {
        cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            swap(arr[i], arr[minIdx]);
        }
    }
}`,
        java: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx])
                    minIdx = j;
            }
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
        System.out.println(Arrays.toString(arr));
    }
}`,
        python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`
    }
};

export const generateSelectionSortSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;

    // Initial State
    steps.push({
        array: [...array],
        states: Array(n).fill('default'),
        pointers: [],
        explanation: {
            simple: 'We start with an unsorted array.',
            why: 'We need to sort these numbers from smallest to largest.',
            analogy: 'Like a shuffled deck of cards on the table.'
        },
        action: 'start',
        codeLineHighlight: 5
    });

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        // Step: Mark start of iteration
        steps.push({
            array: [...array],
            states: array.map((_, idx) => idx < i ? 'sorted' : (idx === i ? 'comparing' : 'default')),
            pointers: [
                { index: i, label: 'Current' },
                { index: minIdx, label: 'Minimum' }
            ],
            explanation: {
                simple: `We start looking for the smallest number from index ${i} onwards.`,
                why: 'We assume the first number in the unsorted part is the minimum until we find something smaller.',
                visual: 'The "Minimum" pointer starts at the same place as "Current".'
            },
            action: 'scan',
            codeLineHighlight: 6
        });

        for (let j = i + 1; j < n; j++) {
            // Step: Compare current element with minimum
            steps.push({
                array: [...array],
                states: array.map((_, idx) => {
                    if (idx < i) return 'sorted';
                    if (idx === minIdx || idx === j) return 'comparing';
                    return 'default';
                }),
                pointers: [
                    { index: i, label: 'Current' },
                    { index: minIdx, label: 'Minimum' },
                    { index: j, label: 'Check' }
                ],
                explanation: {
                    simple: `Comparing ${array[j]} with current minimum ${array[minIdx]}.`,
                    why: `Is ${array[j]} smaller than ${array[minIdx]}?`,
                    visual: 'We compare the number checked (Check) against the current smallest number found (Minimum).'
                },
                action: 'compare',
                codeLineHighlight: 9
            });

            if (array[j] < array[minIdx]) {
                minIdx = j;

                // Step: Update minimum
                steps.push({
                    array: [...array],
                    states: array.map((_, idx) => {
                        if (idx < i) return 'sorted';
                        if (idx === minIdx) return 'comparing';
                        return 'default';
                    }),
                    pointers: [
                        { index: i, label: 'Current' },
                        { index: minIdx, label: 'New Min' }
                    ],
                    explanation: {
                        simple: `Found a smaller number! ${array[minIdx]} is the new minimum.`,
                        why: 'We update our record of the smallest number found so far.',
                        visual: 'The "Minimum" pointer moves to the new, smaller number.'
                    },
                    action: 'found-min',
                    codeLineHighlight: 10
                });
            }
        }

        // Step: Before Swap
        if (minIdx !== i) {
            steps.push({
                array: [...array],
                states: array.map((_, idx) => {
                    if (idx < i) return 'sorted';
                    if (idx === i || idx === minIdx) return 'swapping';
                    return 'default';
                }),
                pointers: [
                    { index: i, label: 'Current' },
                    { index: minIdx, label: 'Found Min' }
                ],
                explanation: {
                    simple: `Swapping ${array[i]} with ${array[minIdx]}.`,
                    why: `${array[minIdx]} helps form the sorted part of the array.`,
                    visual: 'We move the smallest number we found to the front of the unsorted section.'
                },
                action: 'swap',
                codeLineHighlight: 12
            });

            // Perform swap
            let temp = array[i];
            array[i] = array[minIdx];
            array[minIdx] = temp;

            // Step: After Swap
            steps.push({
                array: [...array],
                states: array.map((_, idx) => {
                    if (idx <= i) return 'sorted';
                    return 'default';
                }),
                pointers: [
                    { index: i, label: 'Sorted' }
                ],
                explanation: {
                    simple: `${array[i]} is now in its correct sorted position.`,
                    why: 'We have placed the smallest available number in the correct spot.',
                    visual: 'The element turns green, indicating it is sorted and locked in place.'
                },
                action: 'sorted',
                codeLineHighlight: 14
            });
        } else {
            // Step: No Swap Needed
            steps.push({
                array: [...array],
                states: array.map((_, idx) => {
                    if (idx <= i) return 'sorted';
                    return 'default';
                }),
                pointers: [
                    { index: i, label: 'Sorted' }
                ],
                explanation: {
                    simple: `${array[i]} was already the smallest remaining number.`,
                    why: 'No swap needed, it is already in the correct place.',
                    visual: 'The element turns green instantly.'
                },
                action: 'sorted',
                codeLineHighlight: 6
            });
        }
    }

    // Final Step
    steps.push({
        array: [...array],
        states: Array(n).fill('sorted'),
        pointers: [],
        explanation: {
            simple: 'The array is fully sorted!',
            why: 'We have gone through all positions.',
            analogy: 'The deck of cards is now completely ordered.'
        },
        action: 'complete',
        codeLineHighlight: 16
    });

    return steps;
};
