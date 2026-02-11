export const insertionSortAlgorithm = {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Sorting',
    difficulty: 'Beginner',
    concept: {
        title: 'Insertion Sort',
        keyIdea: 'Build the sorted list one item at a time by picking an element and placing it correctly.',
        analogy: 'Like sorting playing cards in your hand. You pick up the next card and insert it into the correct position among the cards you already hold.',
        visual: 'Watch the "Current" element slide backwards until it finds its correct spot.',
        simpleAlgorithm: [
            { title: 'Pick a Key element', description: 'Start from the second element (index 1) and call it the "Key".' },
            { title: 'Look Left', description: 'Compare the Key with elements to its left that are already sorted.' },
            { title: 'Shift to Right', description: 'If left elements are larger than the Key, shift them one spot to the right.' },
            { title: 'Insert Key', description: 'Place the Key in its correct spot where its left neighbor is smaller.' }
        ]
    },
    complexity: {
        time: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        space: 'O(1)',
        explanation: 'Insertion sort is very efficient for small comparisons or nearly sorted arrays (O(n)), but slow for large reversed lists.'
    },
    code: {
        cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
        java: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        System.out.println(Arrays.toString(arr));
    }
}`,
        python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`
    }
};

export const generateInsertionSortSteps = (initialArray) => {
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
            why: 'We will solve this by building a sorted section from left to right.',
            analogy: 'Imagine holding the first card in your hand.'
        },
        action: 'start',
        codeLineHighlight: 5
    });

    // Mark first element as effectively sorted
    steps.push({
        array: [...array],
        states: array.map((_, idx) => idx === 0 ? 'sorted' : 'default'),
        pointers: [{ index: 0, label: 'Sorted Part' }],
        explanation: {
            simple: 'The first element is already sorted by itself.',
            why: 'A list of one element is always sorted.',
            visual: 'The first box turns green.'
        },
        action: 'mark-first',
        codeLineHighlight: 6
    });

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        // Pick key
        steps.push({
            array: [...array],
            states: array.map((_, idx) => {
                if (idx < i) return 'sorted';
                if (idx === i) return 'comparing';
                return 'default';
            }),
            pointers: [
                { index: i, label: 'Key' }
            ],
            explanation: {
                simple: `We pick up ${key} to insert it into the sorted part.`,
                why: 'We need to find where this number belongs among the sorted numbers to its left.',
                visual: 'The "Key" element is highlighted.'
            },
            action: 'pick-key',
            codeLineHighlight: 7
        });

        while (j >= 0 && array[j] > key) {
            // Compare
            steps.push({
                array: [...array],
                states: array.map((_, idx) => {
                    if (idx < i && idx !== j) return 'sorted';
                    if (idx === j) return 'comparing'; // Being compared
                    if (idx === j + 1) return 'swapping'; // Key/Current spot
                    return 'default';
                }),
                pointers: [
                    { index: j, label: 'Compare' },
                    { index: j + 1, label: 'Key Spot' }
                ],
                explanation: {
                    simple: `Comparing key ${key} with ${array[j]}.`,
                    why: `Since ${array[j]} is larger than ${key}, we need to move ${array[j]} forward to make space.`,
                    visual: `${array[j]} will slide to the right.`
                },
                action: 'compare',
                codeLineHighlight: 9
            });

            // Shift
            array[j + 1] = array[j];

            steps.push({
                array: [...array],
                states: array.map((_, idx) => {
                    if (idx <= i) return 'sorted'; // Technically part of sorted section now being modified
                    return 'default';
                }),
                pointers: [
                    { index: j, label: 'Shifted' }
                ],
                explanation: {
                    simple: `Moved ${array[j]} one spot to the right.`,
                    why: 'Creating space for our key value.',
                    visual: 'The larger number moves right.'
                },
                action: 'shift',
                codeLineHighlight: 10
            });

            j = j - 1;
        }

        // Insert
        array[j + 1] = key;

        steps.push({
            array: [...array],
            states: array.map((_, idx) => {
                if (idx <= i) return 'sorted';
                return 'default';
            }),
            pointers: [
                { index: j + 1, label: 'Inserted' }
            ],
            explanation: {
                simple: `Inserted ${key} into its correct position.`,
                why: 'Found the spot where the left neighbor is smaller (or this is the start).',
                visual: `The key ${key} drops into place.`
            },
            action: 'insert',
            codeLineHighlight: 13
        });
    }

    // Final State
    steps.push({
        array: [...array],
        states: Array(n).fill('sorted'),
        pointers: [],
        explanation: {
            simple: 'The array is now fully sorted!',
            why: 'We have inserted every element into the correct position.',
            visual: 'All elements are green.'
        },
        action: 'complete',
        codeLineHighlight: 15
    });

    return steps;
};
