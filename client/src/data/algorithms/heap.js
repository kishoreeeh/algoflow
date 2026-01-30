/**
 * Binary Heap (Max-Heap) Operations
 * Visualized using the Physical Array Layout.
 */

export const heapAlgorithm = {
    id: 'heap',
    name: 'Max-Heap Insert',
    category: 'Trees & Graphs',
    difficulty: 'Intermediate',

    concept: {
        title: 'Binary Heap (Max-Heap)',
        analogy: 'Imagine a organization chart. Every manager (Parent) must be more experienced (higher value) than their subordinates (Children). When a new person joins at the bottom, they keep getting promoted (Bubble Up) until they meet a manager who is more experienced than them.',
        keyIdea: 'A complete binary tree where every parent is ≥ its children.',
        whenToUse: 'Priority Queues, Heapsort, and finding the smallest/largest element in O(1) time.',
        visual: 'Heaps are physically stored as Arrays. We use the "Bubble Up" animation to show how order is restored.',
        simpleAlgorithm: [
            { title: 'Insert at End', description: 'Add the new element to the first available slot in the array.' },
            { title: 'Bubble Up', description: 'Compare with Parent (Index (i-1)/2). If larger, swap.' },
            { title: 'Repeat', description: 'Continue swapping upward until the Max-Heap property is satisfied.' }
        ]
    },

    complexity: {
        time: {
            best: 'O(1)',
            average: 'O(log n)',
            worst: 'O(log n)'
        },
        space: 'O(1)',
        explanation: 'Insertion takes log(n) because a node can only move up the height of the tree.'
    },

    code: {
        cpp: `void bubbleUp(vector<int>& heap, int i) {
    while (i > 0) {
        int p = (i - 1) / 2;
        if (heap[i] > heap[p]) {
            swap(heap[i], heap[p]);
            i = p;
        } else {
            break;
        }
    }
}

void insert(vector<int>& heap, int val) {
    heap.push_back(val);
    bubbleUp(heap, heap.size() - 1);
}`,
        java: `void insert(int val) {
    heap[size] = val;
    int curr = size++;
    while (curr > 0 && heap[curr] > heap[parent(curr)]) {
        swap(curr, parent(curr));
        curr = parent(curr);
    }
}`,
        python: `def insert(heap, val):
    heap.append(val)
    curr = len(heap) - 1
    while curr > 0:
        p = (curr - 1) // 2
        if heap[curr] > heap[p]:
            heap[curr], heap[p] = heap[p], heap[curr]
            curr = p
        else:
            break`
    }
};

export const generateHeapSteps = (initialArray) => {
    const steps = [];
    // If array is shorter than 2, we can't really show "insertion into a heap" well.
    // Use first N-1 elements as the "already valid" heap (simplified for visualization)
    // and the last element as the one to insert.
    let baseArray = initialArray.length > 2 ? initialArray.slice(0, -1) : [50, 30, 40, 10, 20];
    const newValue = initialArray.length > 1 ? initialArray[initialArray.length - 1] : 60;

    // To ensure the visualization starts with a "Valid-ish" Max-Heap for the demonstration,
    // we sort the base array descending. This isn't strictly necessary for a heap, 
    // but makes the "Bubble Up" logic intuitive for learners.
    let heap = [...baseArray].sort((a, b) => b - a);

    // Initial State
    steps.push({
        action: 'initialize',
        array: [...heap],
        states: Array(heap.length).fill('default'),
        pointers: [],
        explanation: {
            objective: 'Current Max-Heap Status',
            simple: 'This is our existing Max-Heap. Every parent is larger than its children.',
            why: 'Heaps are stored in arrays for maximum performance.',
            visual: 'Indices are mapped to tree levels internally.'
        }
    });

    // Step: Inserting
    heap.push(newValue);
    let i = heap.length - 1;
    steps.push({
        action: 'insert',
        array: [...heap],
        states: heap.map((_, idx) => idx === i ? 'comparing' : 'default'),
        pointers: [{ index: i, label: 'New Item', color: '#10b981' }],
        explanation: {
            objective: `Insert ${newValue} at Index ${i}`,
            simple: `We add ${newValue} to the first available bubble at the end of the heap.`,
            why: 'Heaps stay complete by always filling the next free slot in the array.',
            visual: 'Green highlight shows the newly injected node.'
        }
    });

    // Bubble Up
    while (i > 0) {
        let p = Math.floor((i - 1) / 2);

        // Step: Comparing with Parent
        steps.push({
            action: 'compare',
            array: [...heap],
            states: heap.map((_, idx) => (idx === i || idx === p) ? 'comparing' : 'default'),
            pointers: [
                { index: i, label: 'Child', color: '#8B5CF6' },
                { index: p, label: 'Parent', color: '#06b6d4' }
            ],
            explanation: {
                objective: 'Verify Parent Property',
                simple: `Comparing Child (${heap[i]}) with Parent (${heap[p]}).`,
                why: `In a Max-Heap, the Parent must be larger than or equal to the Child.`,
                visual: 'Is the new element larger than its manager?'
            },
            codeLineHighlight: 6
        });

        if (heap[i] > heap[p]) {
            // Step: Swapping
            steps.push({
                action: 'swap',
                array: [...heap],
                states: heap.map((_, idx) => (idx === i || idx === p) ? 'swapping' : 'default'),
                pointers: [
                    { index: i, label: 'Swap!', color: '#EF4444' },
                    { index: p, label: 'Swap!', color: '#EF4444' }
                ],
                explanation: {
                    objective: 'Perform Promotion (Bubble Up)',
                    simple: `${heap[i]} is larger than ${heap[p]}, so it gets promoted.`,
                    why: 'We swap them to restore the Max-Heap property.',
                    visual: 'Red pulsing indicates a physical swap in the array.'
                },
                codeLineHighlight: 7
            });

            [heap[i], heap[p]] = [heap[p], heap[i]];
            i = p;
        } else {
            break;
        }
    }

    // Final
    steps.push({
        action: 'complete',
        array: [...heap],
        states: Array(heap.length).fill('sorted'),
        pointers: [],
        explanation: {
            objective: 'Heap Property Restored',
            simple: `Promotion complete! ${heap[i]} has reached its correct rank.`,
            why: 'The heap is now back in a valid Max-Heap state.',
            visual: 'All nodes turn green to signify verified status.'
        }
    });

    return steps;
};
