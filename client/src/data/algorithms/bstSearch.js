/**
 * Binary Search Tree (BST) Operations
 * Visualized using the Array Representation (Memory Layout)
 */

export const bstSearchAlgorithm = {
    id: 'bst-search',
    name: 'BST Search',
    category: 'Trees & Graphs',
    difficulty: 'Intermediate',

    concept: {
        title: 'Binary Search Tree Search',
        analogy: 'Imagine a branching path. At every junction, if your destination is numbered lower than the current sign, you go Left. If higher, you go Right. You never have to visit the other path, making the search twice as fast at every step.',
        keyIdea: 'A BST is a tree where for every node: Left children are smaller, Right children are larger.',
        whenToUse: 'When you need fast lookups, insertions, and deletions in a dynamic dataset.',
        visual: 'We represent the tree in Memory order (Array). Root is index 0. Children are at 2i+1 and 2i+2.',
        simpleAlgorithm: [
            { title: 'Start at Root', description: 'Begin search at the top node (Index 0).' },
            { title: 'Compare', description: 'If target < node, move to Left Child. If target > node, move to Right Child.' },
            { title: 'Repeat', description: 'Continue branching down until you find the value or hit a null leaf.' },
            { title: 'Recursive Jump', description: 'The "Jump" in the array (e.g. 0 to 2 to 6) shows how we skip entire branches.' }
        ]
    },

    complexity: {
        time: {
            best: 'O(log n)',
            average: 'O(log n)',
            worst: 'O(n)'
        },
        space: 'O(log n)',
        explanation: 'In a balanced BST, we eliminate half the remaining tree with every comparison.'
    },

    code: {
        cpp: `struct Node {
    int val;
    Node *left, *right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

Node* search(Node* root, int target) {
    if (root == nullptr || root->val == target)
        return root;
    
    if (target < root->val)
        return search(root->left, target);
    
    return search(root->right, target);
}`,
        java: `public Node search(Node root, int target) {
    if (root==null || root.val==target) return root;
    if (root.val > target)
        return search(root.left, target);
    return search(root.right, target);
}`,
        python: `def search(root, target):
    if root is None or root.val == target:
        return root
    if root.val < target:
        return search(root.right, target)
    return search(root.left, target)`
    }
};

export const generateBSTSearchSteps = (initialArray, target = 18) => {
    const steps = [];

    // To visualize a BST correctly in a 1D array [Root, L, R, LL, LR, RL, RR],
    // we take the sorted initial array and arrange it in the specific level-order required.
    const sorted = [...new Set(initialArray)].sort((a, b) => a - b);

    // We only take 7 elements to keep the visualization clean and balanced (3 levels deep)
    const activeData = sorted.length >= 7 ? sorted.slice(0, 7) : [20, 30, 40, 50, 60, 70, 80];

    // Map sorted values to Complete BST positions:
    // Sorted: [0, 1, 2, 3, 4, 5, 6] -> index 3 is Root, index 1 is L, index 5 is R ...
    // Indices in bstArr: [3, 1, 5, 0, 2, 4, 6]
    const bstArr = [
        activeData[3], // Root
        activeData[1], // L
        activeData[5], // R
        activeData[0], // LL
        activeData[2], // LR
        activeData[4], // RL
        activeData[6]  // RR
    ];

    const n = bstArr.length;

    // Initial State
    steps.push({
        action: 'initialize',
        array: [...bstArr],
        states: Array(n).fill('default'),
        pointers: [{ index: 0, label: 'Root', color: '#10b981' }],
        explanation: {
            objective: `Start BST Search for ${target}`,
            simple: `We are searching for ${target} in our Binary Search Tree.`,
            why: 'The input array has been re-arranged into a valid Binary Search Tree structure.',
            visual: 'Green pointer marks the Root of the tree.'
        }
    });

    let currIdx = 0;
    while (currIdx < n) {
        const currVal = bstArr[currIdx];

        // Step: Highlighting current node
        steps.push({
            action: 'compare',
            array: [...bstArr],
            states: bstArr.map((_, idx) => idx === currIdx ? 'comparing' : 'default'),
            pointers: [
                { index: currIdx, label: 'curr', color: '#8B5CF6' }
            ],
            explanation: {
                objective: `Evaluate Node ${currVal}`,
                simple: `Comparing ${target} with current node ${currVal}.`,
                why: `Is ${target} less than, greater than, or equal to ${currVal}?`,
                visual: 'Yellow box is the node we are currently checking.'
            },
            codeLineHighlight: 2
        });

        if (currVal === target) {
            steps.push({
                action: 'complete',
                array: [...bstArr],
                states: bstArr.map((_, idx) => idx === currIdx ? 'sorted' : 'default'),
                pointers: [{ index: currIdx, label: 'FOUND!', color: '#10b981' }],
                explanation: {
                    objective: 'Target Authenticated',
                    simple: `Success! We found ${target} at index ${currIdx}.`,
                    why: 'The value matches our search target.',
                    visual: 'The node turns green to indicate a successful retrieval.'
                },
                codeLineHighlight: 2
            });
            return steps;
        }

        if (target < currVal) {
            const nextIdx = 2 * currIdx + 1;
            steps.push({
                action: 'move-left',
                array: [...bstArr],
                states: bstArr.map((_, idx) => idx === currIdx ? 'swapping' : 'default'),
                pointers: [
                    { index: currIdx, label: 'curr', color: '#8B5CF6' }
                ],
                explanation: {
                    objective: `Move to Left Subtree`,
                    simple: `${target} < ${currVal}, so we branch LEFT.`,
                    why: 'In a BST, all smaller values are strictly held in the left child.',
                    visual: `We will now jump to index 2i + 1 = ${nextIdx}.`
                },
                codeLineHighlight: 4
            });
            currIdx = nextIdx;
        } else {
            const nextIdx = 2 * currIdx + 2;
            steps.push({
                action: 'move-right',
                array: [...bstArr],
                states: bstArr.map((_, idx) => idx === currIdx ? 'swapping' : 'default'),
                pointers: [
                    { index: currIdx, label: 'curr', color: '#8B5CF6' }
                ],
                explanation: {
                    objective: `Move to Right Subtree`,
                    simple: `${target} > ${currVal}, so we branch RIGHT.`,
                    why: 'In a BST, all larger values are strictly held in the right child.',
                    visual: `We will now jump to index 2i + 2 = ${nextIdx}.`
                },
                codeLineHighlight: 5
            });
            currIdx = nextIdx;
        }

        if (currIdx >= n) break;
    }

    // Not Found
    steps.push({
        action: 'complete',
        array: [...bstArr],
        states: Array(n).fill('swapping'),
        pointers: [],
        explanation: {
            objective: 'Target Not Found',
            simple: `We reached a leaf node and ${target} was not found.`,
            why: 'We exhausted the logical path where the target should have been.',
            visual: 'All boxes turn red as the search fails.'
        },
        codeLineHighlight: 2
    });

    return steps;
};
