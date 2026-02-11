/**
 * Quick Sort Implementation (Divide and Conquer)
 */

export const quickSortAlgorithm = {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Sorting',
    difficulty: 'Intermediate',

    concept: {
        title: 'How Quick Sort Works',
        analogy: 'Imagine organizing a messy pile of mail. You pick one envelope (Pivot). You put all envelopes addressed to the city on the left and all others on the right. You then repeat this for each pile until every envelope is in the perfect order.',
        keyIdea: 'Pick a "Pivot", partition the array so left < pivot and right > pivot, then recursively sort the halves.',
        whenToUse: 'General-purpose sorting. It is often faster in practice than other O(n log n) algorithms like Merge Sort.',
        visual: 'The "Pivot" is highlighted in green. "L" and "R" pointers hunt for elements to swap around the pivot.',
        simpleAlgorithm: [
            { title: 'Pick Pivot', description: 'Choose an element (usually the last one) to be the pivot.' },
            { title: 'Partition', description: 'Rearrange the array so elements smaller than pivot are on its left.' },
            { title: 'Recurse', description: 'Apply the same logic to the left and right partitions.' },
            { title: 'Combine', description: 'The array becomes sorted once all partitions are of size 1 or 0.' }
        ]
    },

    complexity: {
        time: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n²)'
        },
        space: 'O(log n)',
        explanation: 'Quick sort is highly efficient because it sorts "in-place", meaning it doesn\'t need much extra memory like Merge Sort does.'
    },

    code: {
        cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        java: `import java.util.Arrays;

public class Main {
    static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivot = arr[high];
            int i = low - 1;
            for (int j = low; j < high; j++) {
                if (arr[j] <= pivot) {
                    i++;
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
            int temp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp;
            int pi = i + 1;
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    public static void main(String[] args) {
        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}`,
        python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi-1)
        quick_sort(arr, pi+1, high)`
    }
};

export const generateQuickSortSteps = (inputArray) => {
    const steps = [];
    let arr = [...inputArray];
    const n = arr.length;

    // We implement a non-recursive step tracker to keep it linear for the visualization
    const sort = (items, start, end) => {
        if (start >= end) return;

        // Partitioning
        let pivotValue = items[end];
        let pivotIndex = start;

        // STEP: Initial Partition Pass
        steps.push({
            action: 'partition-start',
            array: [...items],
            states: items.map((_, idx) => {
                if (idx === end) return 'sorted'; // Pivot
                if (idx >= start && idx < end) return 'default';
                return 'sorted';
            }),
            pointers: [{ index: end, label: 'Pivot', color: '#10b981' }],
            explanation: {
                simple: `Partitioning: Using ${pivotValue} as the Pivot.`,
                why: 'The pivot is the reference point. Everything smaller goes left.',
                visual: 'The green box is our chosen pivot for this partition.'
            },
            codeLineHighlight: 6
        });

        for (let i = start; i < end; i++) {
            // STEP: Compare with pivot
            steps.push({
                action: 'compare',
                array: [...items],
                states: items.map((_, idx) => {
                    if (idx === end) return 'sorted';
                    if (idx === i) return 'comparing';
                    if (idx >= start && idx < end) return 'default';
                    return 'sorted';
                }),
                pointers: [
                    { index: i, label: 'j', color: '#8B5CF6' },
                    { index: end, label: 'P', color: '#10b981' }
                ],
                explanation: {
                    simple: `Comparing ${items[i]} with pivot ${pivotValue}.`,
                    why: 'Is this value smaller than the pivot?',
                    visual: 'Yellow box is being checked against the green pivot.'
                },
                codeLineHighlight: 9
            });

            if (items[i] < pivotValue) {
                [items[i], items[pivotIndex]] = [items[pivotIndex], items[i]];

                // STEP: Swap smaller to left
                steps.push({
                    action: 'swap',
                    array: [...items],
                    states: items.map((_, idx) => {
                        if (idx === end) return 'sorted';
                        if (idx === i || idx === pivotIndex) return 'swapping';
                        return 'default';
                    }),
                    pointers: [{ index: pivotIndex, label: 'i', color: '#EF4444' }],
                    explanation: {
                        simple: `${items[pivotIndex]} is smaller than pivot, move to left boundary.`,
                        why: 'We group smaller items on the left so the pivot can sit in the middle later.',
                        visual: 'Swapping elements to satisfy partition rules.'
                    },
                    codeLineHighlight: 11
                });
                pivotIndex++;
            }
        }

        // STEP: Final Pivot Swap
        [items[pivotIndex], items[end]] = [items[end], items[pivotIndex]];
        steps.push({
            action: 'pivot-place',
            array: [...items],
            states: items.map((_, idx) => idx === pivotIndex ? 'sorted' : 'default'),
            pointers: [{ index: pivotIndex, label: 'Placed!', color: '#10b981' }],
            explanation: {
                simple: `Pivot ${pivotValue} is now in its perfect sorted position!`,
                why: 'The pivot can never move again. Everything on its left is smaller, everything on its right is larger.',
                visual: 'The pivot turns green - it is locked in place.'
            },
            codeLineHighlight: 17
        });

        sort(items, start, pivotIndex - 1);
        sort(items, pivotIndex + 1, end);
    };

    sort(arr, 0, n - 1);

    // Final
    steps.push({
        action: 'complete',
        array: [...arr],
        states: Array(n).fill('sorted'),
        pointers: [],
        explanation: {
            simple: 'Quick Sort Complete! The array is fully ordered.',
            why: 'Recursive partitions have resolved all out-of-order pairs.',
            visual: 'All boxes are green - perfectly balanced and sorted.'
        },
        codeLineHighlight: 26
    });

    return steps;
};
