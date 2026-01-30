/**
 * Array Operations (Core Foundation)
 */

export const arraysAlgorithm = {
    id: 'arrays',
    name: 'Array Basics',
    category: 'Foundations',
    difficulty: 'Beginner',

    concept: {
        title: 'Array Operations',
        analogy: 'Imagine a row of lockers in a school. Each locker has a unique number (Index) and holds one item (Value). To update an item, you go directly to that locker number.',
        keyIdea: 'A contiguous block of memory where elements are stored at fixed indices starting from 0.',
        whenToUse: 'Basic data storage when you know the total number of items or need fast random access (O(1)).',
        visual: 'Each box is a memory slot. We will visualize Access (reading), Traversal (visiting all), and Update (changing value) operations.',
        simpleAlgorithm: [
            { title: 'Access', description: 'Go directly to index i. Complexity is O(1).' },
            { title: 'Traversal', description: 'Visit every index from 0 to n-1.' },
            { title: 'Update', description: 'Replace the value at index i with a new value.' }
        ]
    },

    complexity: {
        time: {
            best: 'O(1)',
            average: 'O(n)',
            worst: 'O(n)'
        },
        space: 'O(1)',
        explanation: 'Random access is O(1), but searching or traversing takes O(n).'
    },

    code: {
        cpp: `// Access
int val = arr[2];

// Traversal
for(int i = 0; i < arr.size(); i++) {
    cout << arr[i] << endl;
}

// Update
arr[2] = 50;`,
        java: `// Access
int val = arr[2];

// Traversal
for(int i=0; i < arr.length; i++) {
  System.out.println(arr[i]);
}

// Update
arr[2] = 50;`,
        python: `# Access
val = arr[2]

# Traversal
for x in arr:
    print(x)

# Update
arr[2] = 50`
    }
};

export const generateArraysSteps = (inputArray) => {
    const steps = [];
    let arr = [...inputArray];
    const n = arr.length;

    // 1. Initial State
    steps.push({
        action: 'initialize',
        array: [...arr],
        states: Array(n).fill('default'),
        pointers: [],
        explanation: {
            objective: 'System Initialization',
            simple: 'This is our array in memory. It holds 7 elements.',
            why: 'Arrays occupy a fixed, contiguous block of space.',
            visual: 'Indices are numbered 0 to 6 underneath the boxes.'
        }
    });

    // 2. Traversal Simulation
    for (let i = 0; i < n; i++) {
        steps.push({
            action: 'traversing',
            array: [...arr],
            states: arr.map((_, idx) => idx === i ? 'comparing' : 'default'),
            pointers: [{ index: i, label: `index ${i}`, color: '#8B5CF6' }],
            explanation: {
                objective: 'Perform Linear Traversal',
                simple: `Traversing: Accessing element at index ${i} with value ${arr[i]}.`,
                why: 'Linear traversal is used to process every element in a list one-by-one.',
                visual: 'The purple pointer moves from left to right.'
            },
            codeLineHighlight: 4
        });
    }

    // 3. Update Simulation
    const targetIdx = 3;
    const newValue = 100;
    steps.push({
        action: 'updating',
        array: [...arr],
        states: arr.map((_, idx) => idx === targetIdx ? 'swapping' : 'default'),
        pointers: [{ index: targetIdx, label: 'Target', color: '#EF4444' }],
        explanation: {
            objective: 'Modify Memory at Index ' + targetIdx,
            simple: `Updating index ${targetIdx}. Changing ${arr[targetIdx]} to ${newValue}.`,
            why: 'Update operations replace old data with new data in O(1) time.',
            visual: 'The red pulse indicates a pending memory write at this location.'
        },
        codeLineHighlight: 10
    });

    arr[targetIdx] = newValue;

    steps.push({
        action: 'complete',
        array: [...arr],
        states: arr.map((_, idx) => idx === targetIdx ? 'sorted' : 'default'),
        pointers: [{ index: targetIdx, label: 'Updated!', color: '#10b981' }],
        explanation: {
            objective: 'Verification of Modification',
            simple: `Update complete! The value at index ${targetIdx} is now ${newValue}.`,
            why: 'The memory Slot now successfully stores the new integer.',
            visual: 'The green highlight shows the successfully modified slot.'
        },
        codeLineHighlight: 10
    });

    return steps;
};
