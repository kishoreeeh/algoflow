export const linearSearchAlgorithm = {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'Searching',
    difficulty: 'Beginner',
    concept: {
        title: 'Linear Search',
        keyIdea: 'Check every element one by one until you find the target.',
        analogy: 'Imagine looking for a specific key in a bunch of keys. You pick the first one, try it. Then the second, try it. You keep going until you find the right one.',
        visual: 'Watch the pointer move from left to right.',
        simpleAlgorithm: [
            { title: 'Start from the first element', description: 'Begin your search at the very first element of the array.' },
            { title: 'Compare with target', description: 'Check if the current element matches the value you are looking for.' },
            { title: 'Found or Next', description: 'If it matches, you are done! If not, move to the next element in the list.' },
            { title: 'Repeat until End', description: 'Keep going until you find the target or reach the end of the array.' }
        ]
    },
    complexity: {
        time: {
            best: 'O(1)',
            average: 'O(n)',
            worst: 'O(n)'
        },
        space: 'O(1)',
        explanation: 'Linear search is simple but slow because in the worst case, you have to look at every single element.'
    },
    code: {
        cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
        java: `public class Main {
    public static void main(String[] args) {
        int foundIdx = -1;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                foundIdx = i;
                break;
            }
        }
        if (foundIdx != -1)
            System.out.println("Found at: " + foundIdx);
        else
            System.out.println("Not Found");
    }
}`,
        python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`
    }
};

export const generateLinearSearchSteps = (initialArray, target = 22) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;

    // Initial State
    steps.push({
        array: [...array],
        states: Array(n).fill('default'),
        pointers: [],
        explanation: {
            objective: `Starting Search for ${target}`,
            simple: `We want to find the number ${target} in this array.`,
            why: 'Linear search can work on any array, sorted or unsorted.',
            analogy: 'Like checking names on a list one by one.'
        },
        action: 'start',
        codeLineHighlight: 4
    });

    for (let i = 0; i < n; i++) {
        // Step: Checking index i
        steps.push({
            array: [...array],
            states: array.map((_, idx) => idx === i ? 'comparing' : (idx < i ? 'sorted' : 'default')),
            pointers: [
                { index: i, label: 'Checking' }
            ],
            explanation: {
                objective: `Compare Element at Index ${i}`,
                simple: `Checking if ${array[i]} is equal to ${target}.`,
                why: 'We need to examine each element in order.',
                visual: 'The current element is highlighted.'
            },
            action: 'compare',
            codeLineHighlight: 5
        });

        if (array[i] === target) {
            // Step: Found it!
            steps.push({
                array: [...array],
                states: array.map((_, idx) => idx === i ? 'sorted' : (idx < i ? 'sorted' : 'default')),
                pointers: [
                    { index: i, label: 'Found!' }
                ],
                explanation: {
                    objective: 'Target Found!',
                    simple: `Found ${target} at index ${i}!`,
                    why: 'The current element matches our target.',
                    visual: 'The element turns green.'
                },
                action: 'complete',
                codeLineHighlight: 6
            });
            return steps;
        }
    }

    // Final Step: Not found
    steps.push({
        array: [...array],
        states: Array(n).fill('swapping'),
        pointers: [],
        explanation: {
            objective: 'Search Exhausted',
            simple: `${target} was not found in the array.`,
            why: 'We have checked every single element and none matched.',
            visual: 'We reached the end of the array.'
        },
        action: 'complete',
        codeLineHighlight: 10
    });

    return steps;
};
