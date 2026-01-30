/**
 * Linked List (Singly Linked List) Implementation
 */

export const linkedListAlgorithm = {
    id: 'linked-list',
    name: 'Linked List',
    category: 'Data Structures',
    difficulty: 'Beginner',

    concept: {
        title: 'What is a Linked List?',
        analogy: `Imagine a scavenger hunt. To find the treasure, you start at the first location (Head). At each location, you find the item you're looking for, plus a note telling you exactly where the next location is. You keep following the notes until you reach a location with no more notes (Null).`,
        keyIdea: 'A collection of nodes where each node contains data and a pointer to the next node in the sequence.',
        whenToUse: 'Use when you need frequent insertions and deletions at the beginning or middle of a list, as unlike arrays, you don\'t need to shift all other elements.',
        visual: 'Each box represents a "Node". Arrows at the bottom represent the "Next" pointers leading to the following node.',
        simpleAlgorithm: [
            { title: 'Create Node', description: 'Create a new node with the value you want to insert.' },
            { title: 'Traverse', description: 'Start from Head and move through nodes until you find the insertion point.' },
            { title: 'Link Up', description: 'Update the Next pointer of the previous node to point to the new node.' },
            { title: 'Finalize', description: 'The new node now points to the original next node in line.' }
        ]
    },

    complexity: {
        time: {
            best: 'O(1)',
            average: 'O(n)',
            worst: 'O(n)'
        },
        space: 'O(n)',
        explanation: 'Searching or inserting in the middle takes O(n) because you must traverse from the Head. Inserting at the Head is O(1).'
    },

    code: {
        cpp: `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* insertAtPosition(Node* head, int data, int pos) {
    Node* newNode = new Node(data);
    if (pos == 0) {
        newNode->next = head;
        return newNode;
    }
    Node* curr = head;
    for (int i = 0; i < pos - 1 && curr != nullptr; i++) {
        curr = curr->next;
    }
    if (curr != nullptr) {
        newNode->next = curr->next;
        curr->next = newNode;
    }
    return head;
}`,
        java: `class Node {
    int data;
    Node next;
    Node(int d) { data = d; next = null; }
}

public Node insert(Node head, int data, int pos) {
    Node newNode = new Node(data);
    if (pos == 0) {
        newNode.next = head;
        return newNode;
    }
    Node curr = head;
    for (int i = 0; i < pos - 1; i++) {
        curr = curr.next;
    }
    newNode.next = curr.next;
    curr.next = newNode;
    return head;
}`,
        python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

def insert(head, data, pos):
    new_node = Node(data)
    if pos == 0:
        new_node.next = head
        return new_node
    curr = head
    for _ in range(pos - 1):
        curr = curr.next
    new_node.next = curr.next
    curr.next = new_node
    return head`
    }
};

/**
 * Generate step-by-step visualization for Linked List Insertion
 */
export const generateLinkedListSteps = (inputArray, targetIndex = 2) => {
    // Validate targetIndex - cap it to array length to prevent out-of-bounds traversal
    const maxPos = inputArray.length;
    let pos = typeof targetIndex === 'number' ? targetIndex : 2;
    if (isNaN(pos) || pos < 0) pos = 0;
    if (pos > maxPos) pos = maxPos;

    const steps = [];
    let currentArray = [...inputArray];
    const n = currentArray.length;
    const newValue = 99; // Value to insert

    // Initial State
    steps.push({
        action: 'initialize',
        array: [...currentArray],
        states: Array(n).fill('default'),
        pointers: [{ index: 0, label: 'Head', color: '#10b981' }],
        explanation: {
            objective: 'Linked List Entry',
            simple: 'This is our existing Linked List. We have access to the Head.',
            why: 'Linked lists always require a Head reference to begin traversal.',
            visual: 'The list is laid out in sequence, connected by memory pointers.'
        },
        codeLineHighlight: 8
    });

    // Step: Create New Node
    steps.push({
        action: 'create-node',
        array: [...currentArray],
        states: Array(n).fill('default'),
        pointers: [{ index: 0, label: 'Head', color: '#10b981' }],
        explanation: {
            objective: 'Allocate New Node',
            simple: `Creating a new node in memory with the data: ${newValue}.`,
            why: 'The first step of insertion is creating the container for the new data.',
            visual: 'A new node is mentally prepared for the insertion.'
        },
        codeLineHighlight: 9
    });

    // Handle pos === 0
    if (pos === 0) {
        steps.push({
            action: 'insert-head',
            array: [newValue, ...currentArray],
            states: ['sorted', ...Array(n).fill('default')],
            pointers: [{ index: 0, label: 'New Head', color: '#10b981' }],
            explanation: {
                objective: 'Update Head Pointer',
                simple: `The new node points to the current head, and becomes the new head.`,
                why: 'Inserting at index 0 is an O(1) operation.',
                visual: 'The new green node is now at the front.'
            },
            codeLineHighlight: 11
        });
        return steps;
    }

    // Step: Start Traversal
    steps.push({
        action: 'traversal-start',
        array: [...currentArray],
        states: currentArray.map((_, idx) => idx === 0 ? 'comparing' : 'default'),
        pointers: [
            { index: 0, label: 'Head & curr', color: '#8B5CF6' }
        ],
        explanation: {
            objective: 'Initialize Traversal',
            simple: `Setting our search pointer 'curr' to the Head node.`,
            why: 'To insert in the middle, we must traverse from the start.',
            visual: 'The purple pointer marks our starting position.'
        },
        codeLineHighlight: 14
    });

    let currPos = 0;
    // Step: Traversing
    for (let i = 0; i < pos - 1; i++) {
        // Highlighting the loop check
        steps.push({
            action: 'traversing-loop',
            array: [...currentArray],
            states: currentArray.map((_, idx) => idx === currPos ? 'comparing' : 'default'),
            pointers: [
                { index: 0, label: 'Head', color: '#10b981' },
                { index: currPos, label: 'curr', color: '#8B5CF6' }
            ],
            explanation: {
                objective: `Traversal Loop (Step ${i + 1})`,
                simple: `Position ${currPos} is not yet ${pos - 1}. Continuing...`,
                why: `We must reach position ${pos - 1} to insert at position ${pos}.`,
                visual: 'The loop continues its search.'
            },
            codeLineHighlight: 15
        });

        currPos++;

        // Moving to next
        steps.push({
            action: 'traversing-next',
            array: [...currentArray],
            states: currentArray.map((_, idx) => idx === currPos ? 'comparing' : 'default'),
            pointers: [
                { index: 0, label: 'Head', color: '#10b981' },
                { index: currPos, label: 'curr', color: '#8B5CF6' }
            ],
            explanation: {
                objective: 'Move Pointer',
                simple: `Advancing 'curr' to node ${currentArray[currPos]} at index ${currPos}.`,
                why: 'curr = curr.next moves us one link down the chain.',
                visual: 'The pointer moves to the next box.'
            },
            codeLineHighlight: 16
        });
    }

    // Step: Prep Insertion
    const prepPointers = [{ index: currPos, label: 'curr', color: '#8B5CF6' }];
    if (currPos + 1 < currentArray.length) {
        prepPointers.push({ index: currPos + 1, label: 'curr.next', color: '#EF4444' });
    }

    steps.push({
        action: 'preparing',
        array: [...currentArray],
        states: currentArray.map((_, idx) => {
            if (idx === currPos) return 'comparing';
            if (idx === currPos + 1 && idx < currentArray.length) return 'swapping';
            return 'default';
        }),
        pointers: prepPointers,
        explanation: {
            objective: 'Link Redirection',
            simple: `We've reached position ${currPos}. Setting new node's next to curr's current next.`,
            why: 'We must first ensure the new node points to the rest of the list.',
            visual: 'The red highlight shows the existing link we are about to intercept.'
        },
        codeLineHighlight: 18
    });

    // Step: Final Insertion
    const finalArray = [...currentArray];
    finalArray.splice(pos, 0, newValue);

    steps.push({
        action: 'complete',
        array: finalArray,
        states: finalArray.map((_, idx) => idx === pos ? 'sorted' : 'default'),
        pointers: [
            { index: pos, label: 'New Node', color: '#10b981' }
        ],
        explanation: {
            objective: 'Insertion Complete',
            simple: `Re-linked 'curr.next' to our new node. Insertion success!`,
            why: 'The chain is now updated to include the new node.',
            visual: 'A new node has been injected into the structure.'
        },
        codeLineHighlight: 19
    });

    return steps;
};
