export const binarySearchAlgorithm = {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    difficulty: 'Beginner',
    concept: {
        title: 'Binary Search',
        keyIdea: 'Find a target in a sorted list by repeatedly dividing the search interval in half.',
        analogy: 'Imagine looking for a word in a dictionary. You open it to the middle. If the word you want is alphabetically before the middle word, you look in the first half. If it is after, you look in the second half. You keep doing this until you find it.',
        visual: 'Watch the "Low" and "High" pointers close in on the target.',
        simpleAlgorithm: [
            { title: 'Find the Middle', description: 'Calculate the middle index of the current search range.' },
            { title: 'Check Middle', description: 'If middle matches target, found! If not, see if target is smaller or larger.' },
            { title: 'Half the Range', description: 'If smaller, search left half. If larger, search right half.' },
            { title: 'Repeat or Fail', description: 'Repeat until found or range size becomes zero (not found).' }
        ]
    },
    complexity: {
        time: {
            best: 'O(1)',
            average: 'O(log n)',
            worst: 'O(log n)'
        },
        space: 'O(1)',
        explanation: 'Binary search is incredibly fast because it throws away half of the remaining elements at every step.'
    },
    code: {
        cpp: `int binarySearch(vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
        java: `int binarySearch(int[] arr, int target) {
  int low = 0;
  int high = arr.length - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
        python: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
    }
};

export const generateBinarySearchSteps = (initialArray, target = 22) => {
    const steps = [];
    const array = [...initialArray].sort((a, b) => a - b); // Must be sorted
    const n = array.length;

    // Initial State
    steps.push({
        array: [...array],
        states: Array(n).fill('default'),
        pointers: [],
        explanation: {
            objective: `Locate ${target} in Sorted Memory`,
            simple: `We want to find the number ${target} in this sorted array.`,
            why: 'Binary search only works on sorted lists.',
            analogy: 'Like looking for a name in a phone book.'
        },
        action: 'start'
    });

    let low = 0;
    let high = n - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);

        // Step: Show current range
        steps.push({
            array: [...array],
            states: array.map((_, idx) => (idx >= low && idx <= high) ? 'default' : 'sorted'), // Gray out out-of-range
            pointers: [
                { index: low, label: 'Low' },
                { index: high, label: 'High' }
            ],
            explanation: {
                objective: `Define Search Range [${low} - ${high}]`,
                simple: `Our search range is from index ${low} to ${high}.`,
                why: 'We narrow down the search area at each step.',
                visual: 'The elements outside our current range are grayed out.'
            },
            action: 'range',
            codeLineHighlight: 4
        });

        // Step: Calculate mid
        steps.push({
            array: [...array],
            states: array.map((_, idx) => {
                if (idx === mid) return 'comparing';
                if (idx >= low && idx <= high) return 'default';
                return 'sorted';
            }),
            pointers: [
                { index: low, label: 'Low' },
                { index: high, label: 'High' },
                { index: mid, label: 'Mid' }
            ],
            explanation: {
                objective: `Split Range at Index ${mid}`,
                simple: `Calculating the middle index: (${low} + ${high}) / 2 = ${mid}.`,
                why: 'We check the middle element to decide which half to keep.',
                visual: 'The middle element is highlighted.'
            },
            action: 'mid',
            codeLineHighlight: 5
        });

        if (array[mid] === target) {
            // Step: Found it!
            steps.push({
                array: [...array],
                states: array.map((_, idx) => idx === mid ? 'sorted' : 'sorted'),
                pointers: [
                    { index: mid, label: 'Found!' }
                ],
                explanation: {
                    objective: 'Target Authenticated',
                    simple: `Found ${target} at index ${mid}!`,
                    why: 'The middle element matches our target.',
                    visual: 'The target element turns green.'
                },
                action: 'complete',
                codeLineHighlight: 6
            });
            return steps;
        }

        if (array[mid] < target) {
            // Step: Target is in right half
            steps.push({
                array: [...array],
                states: array.map((_, idx) => {
                    if (idx === mid) return 'swapping'; // Highlight as "failure" for this element
                    if (idx >= low && idx <= high) return 'default';
                    return 'sorted';
                }),
                pointers: [
                    { index: mid, label: 'Mid' }
                ],
                explanation: {
                    objective: 'Target is Larger than Mid',
                    simple: `${array[mid]} is smaller than ${target}.`,
                    why: 'Everything to the left of Mid (including Mid) is also smaller than the target.',
                    visual: `Target must be in the right half.`
                },
                action: 'move-low',
                codeLineHighlight: 8
            });
            low = mid + 1;
        } else {
            // Step: Target is in left half
            steps.push({
                array: [...array],
                states: array.map((_, idx) => {
                    if (idx === mid) return 'swapping';
                    if (idx >= low && idx <= high) return 'default';
                    return 'sorted';
                }),
                pointers: [
                    { index: mid, label: 'Mid' }
                ],
                explanation: {
                    objective: 'Target is Smaller than Mid',
                    simple: `${array[mid]} is larger than ${target}.`,
                    why: 'Everything to the right of Mid (including Mid) is also larger than the target.',
                    visual: `Target must be in the left half.`
                },
                action: 'move-high',
                codeLineHighlight: 10
            });
            high = mid - 1;
        }
    }

    // Final Step: Not found
    steps.push({
        array: [...array],
        states: Array(n).fill('swapping'),
        pointers: [],
        explanation: {
            objective: 'Target Not Present',
            simple: `${target} was not found in the array.`,
            why: 'We have exhausted the entire search range.',
            visual: 'The range became empty.'
        },
        action: 'complete',
        codeLineHighlight: 13
    });

    return steps;
};
