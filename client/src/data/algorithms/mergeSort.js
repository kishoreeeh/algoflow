/**
 * Merge Sort Algorithm Definition (Bottom-Up Iterative)
 */

export const mergeSortAlgorithm = {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Sorting',
    difficulty: 'Intermediate',

    concept: {
        title: 'How Merge Sort Works',
        analogy: 'Imagine you have a stack of messy papers. You divide the stack into groups of two, sort them, then merge those groups into larger sorted groups. You keep doubling the size of the groups you are merging until the entire stack is one sorted group.',
        keyIdea: 'Iteratively merge small subarrays into larger ones until the array is sorted.',
        whenToUse: 'Stable sorting is needed, or when sorting linked lists or large datasets.',
        visual: 'The array is merged in increasing powers of two.',
        simpleAlgorithm: [
            { title: 'Merge size 1', description: 'Start by merging adjacent elements into pairs.' },
            { title: 'Double merge size', description: 'Take the sorted pairs and merge them into sorted groups of four.' },
            { title: 'Repeat', description: 'Keep doubling the merge size until the total array is sorted.' }
        ]
    },

    complexity: {
        time: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)'
        },
        space: 'O(n)',
        explanation: 'Iterative Merge Sort is efficient and doesn\'t use recursion, which saves stack memory.'
    },

    code: {
        cpp: `void mergeSort(int arr[], int n) {
    for (int size = 1; size < n; size *= 2) {
        for (int left = 0; left < n - size; left += 2 * size) {
            int mid = left + size - 1;
            int right = min(left + 2 * size - 1, n - 1);
            merge(arr, left, mid, right);
        }
    }
}`,
        java: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int n = arr.length;
        for (int size = 1; size < n; size *= 2) {
            for (int left = 0; left < n - size; left += 2 * size) {
                int mid = left + size - 1;
                int right = Math.min(left + 2 * size - 1, n - 1);
                int[] temp = new int[right - left + 1];
                int i = left, j = mid + 1, k = 0;
                while (i <= mid && j <= right) {
                    if (arr[i] <= arr[j]) temp[k++] = arr[i++];
                    else temp[k++] = arr[j++];
                }
                while (i <= mid) temp[k++] = arr[i++];
                while (j <= right) temp[k++] = arr[j++];
                for (int t = 0; t < temp.length; t++) arr[left + t] = temp[t];
            }
        }
        System.out.println(Arrays.toString(arr));
    }
}`,
        python: `def merge_sort(arr):
    n = len(arr)
    size = 1
    while size < n:
        for left in range(0, n - size, 2 * size):
            mid = left + size - 1
            right = min(left + 2 * size - 1, n - 1)
            merge(arr, left, mid, right)
        size *= 2`
    }
};

export const generateMergeSortSteps = (inputArray) => {
    const steps = [];
    let arr = [...inputArray];
    const n = arr.length;

    // Initial state
    steps.push({
        action: 'initialize',
        array: [...arr],
        states: Array(n).fill('default'),
        pointers: [],
        explanation: {
            objective: 'Initialize Merge Sort',
            simple: 'Starting with the unsorted array.',
            why: 'Bottom-up merge sort starts merging from size 1.',
            visual: 'All boxes are gray.'
        },
        codeLineHighlight: 5
    });

    for (let size = 1; size < n; size *= 2) {
        for (let left = 0; left < n - size; left += 2 * size) {
            let mid = left + size - 1;
            let right = Math.min(left + 2 * size - 1, n - 1);

            steps.push({
                action: 'merge-setup',
                array: [...arr],
                states: arr.map((_, idx) => (idx >= left && idx <= right) ? 'comparing' : (idx < left ? 'sorted' : 'default')),
                pointers: [
                    { index: left, label: 'L', color: '#10b981' },
                    { index: right, label: 'R', color: '#EF4444' }
                ],
                explanation: {
                    simple: `Preparing to merge subarrays from index ${left} to ${right} (size: ${size}).`,
                    objective: `Merging blocks of size ${size}`
                },
                codeLineHighlight: 7
            });

            // Actual merging logic for visualization
            let temp = [];
            let i = left, j = mid + 1;
            while (i <= mid && j <= right) {
                if (arr[i] <= arr[j]) {
                    temp.push(arr[i++]);
                } else {
                    temp.push(arr[j++]);
                }

                steps.push({
                    action: 'merge-compare',
                    array: [...arr],
                    states: arr.map((_, idx) => {
                        if (idx >= left && idx <= right) return 'comparing';
                        return 'default';
                    }),
                    pointers: [
                        { index: i <= mid ? i : mid, label: 'i', color: '#10b981' },
                        { index: j <= right ? j : right, label: 'j', color: '#EF4444' }
                    ],
                    explanation: {
                        simple: `Comparing and selecting the smaller value for the temporary block.`,
                    },
                    codeLineHighlight: 12
                });
            }

            while (i <= mid) temp.push(arr[i++]);
            while (j <= right) temp.push(arr[j++]);

            // Write back
            for (let t = 0; t < temp.length; t++) {
                arr[left + t] = temp[t];
                steps.push({
                    action: 'merge-write',
                    array: [...arr],
                    states: arr.map((_, idx) => {
                        if (idx < left + t + 1) return 'sorted';
                        if (idx >= left && idx <= right) return 'swapping';
                        return 'default';
                    }),
                    pointers: [{ index: left + t, label: 'Placed' }],
                    explanation: {
                        simple: `Writing ${temp[t]} back to the main array.`,
                    },
                    codeLineHighlight: 18
                });
            }
        }
    }

    // Final state
    steps.push({
        action: 'complete',
        array: [...arr],
        states: Array(n).fill('sorted'),
        pointers: [],
        explanation: {
            simple: 'Merge Sort Complete!',
            why: 'The entire array is now sorted using the iterative bottom-up approach.',
            visual: 'All elements are green.'
        },
        codeLineHighlight: 21
    });

    return steps;
};

export default mergeSortAlgorithm;
