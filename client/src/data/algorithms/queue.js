/**
 * Queue Data Structure Implementation (FIFO)
 */

export const queueAlgorithm = {
    id: 'queue',
    name: 'Queue',
    category: 'Data Structures',
    difficulty: 'Beginner',

    concept: {
        title: 'What is a Queue?',
        analogy: 'Imagine standing in line at a movie theater ticket counter. The first person to join the line is the first person to get their ticket and leave. This is why it\'s called First-In, First-Out.',
        keyIdea: 'FIFO (First-In, First-Out). Elements are added at the "Rear" and removed from the "Front".',
        whenToUse: 'Task scheduling, print spooling, handling asynchronous requests where order of arrival matters.',
        visual: 'We use two pointers: Front (for removals) and Rear (for additions).',
        simpleAlgorithm: [
            { title: 'Enqueue', description: 'Add an element to the back (Rear) of the queue.' },
            { title: 'Dequeue', description: 'Remove the element from the front (Front) of the queue.' },
            { title: 'Peek/Front', description: 'Look at the front element without removing it.' },
            { title: 'IsFull/IsEmpty', description: 'Check if the structure has reached its capacity or is vacant.' }
        ]
    },

    complexity: {
        time: {
            best: 'O(1)',
            average: 'O(1)',
            worst: 'O(1)'
        },
        space: 'O(n)',
        explanation: 'Adding and removing from a queue are constant time operations because we keep track of both the head and tail.'
    },

    code: {
        cpp: `#include <queue>
using namespace std;

class Queue {
    queue<int> q;
public:
    void enqueue(int x) {
        q.push(x);
    }
    void dequeue() {
        if (!q.empty()) q.pop();
    }
    int front() {
        if (!q.empty()) return q.front();
        return -1;
    }
    bool isEmpty() {
        return q.empty();
    }
};`,
        java: `class Queue {
    int size = 10;
    int[] arr = new int[size];
    int front = 0;
    int rear = -1;

    void enqueue(int value) {
        if (rear == size - 1) return;
        arr[++rear] = value;
    }

    int dequeue() {
        if (front > rear) return -1;
        return arr[front++];
    }

    int peek() {
        if (front > rear) return -1;
        return arr[front];
    }

    public static void main(String[] args) {
        Queue q = new Queue();
        q.enqueue(5);
        q.dequeue();
    }
}`,
        python: `from collections import deque
q = deque()
q.append(10) # Enqueue
item = q.popleft() # Dequeue`
    }
};

export const generateQueueSteps = (inputArray) => {
    const steps = [];
    let currentQueue = [...inputArray];
    const n = currentQueue.length;

    // Initial State
    steps.push({
        action: 'initialize',
        array: [...currentQueue],
        states: Array(n).fill('default'),
        pointers: [
            { index: 0, label: 'Front', color: '#EF4444' },
            { index: n - 1, label: 'Rear', color: '#06b6d4' }
        ],
        explanation: {
            simple: 'Our current Queue. Items enter at the Rear and leave from the Front.',
            why: 'Order of arrival is strictly maintained.',
            visual: 'Red pointer is Front, Cyan pointer is Rear.'
        },
        codeLineHighlight: 1
    });

    // Enqueue
    const newValue = 88;
    steps.push({
        action: 'enqueue-prep',
        array: [...currentQueue],
        states: Array(n).fill('default'),
        pointers: [
            { index: 0, label: 'Front', color: '#EF4444' },
            { index: n - 1, label: 'Rear', color: '#06b6d4' }
        ],
        explanation: {
            simple: `Ready to Enqueue ${newValue} at the back.`,
            why: 'Enqueue operations always happen at the Rear index.',
            visual: 'We will witness the queue structure grow to the right.'
        },
        codeLineHighlight: 5
    });

    currentQueue.push(newValue);
    steps.push({
        action: 'enqueue',
        array: [...currentQueue],
        states: currentQueue.map((_, idx) => idx === currentQueue.length - 1 ? 'sorted' : 'default'),
        pointers: [
            { index: 0, label: 'Front', color: '#EF4444' },
            { index: currentQueue.length - 1, label: 'New Rear', color: '#10b981' }
        ],
        explanation: {
            simple: `${newValue} added! The Rear pointer has moved to the new last element.`,
            why: 'The Rear pointer always marks the entry point.',
            visual: 'The green box is our freshly enqueued element.'
        },
        codeLineHighlight: 7
    });

    // Dequeue
    steps.push({
        action: 'dequeue-prep',
        array: [...currentQueue],
        states: currentQueue.map((_, idx) => idx === 0 ? 'swapping' : 'default'),
        pointers: [
            { index: 0, label: 'Dequeue Target', color: '#EF4444' },
            { index: currentQueue.length - 1, label: 'Rear', color: '#06b6d4' }
        ],
        explanation: {
            simple: 'Selecting the Front item for removal (Dequeue).',
            why: 'In FIFO, the person who arrives first leaves first.',
            visual: 'The pulsing red box is about to be removed.'
        },
        codeLineHighlight: 9
    });

    const dequeuedValue = currentQueue.shift();
    steps.push({
        action: 'dequeue',
        array: [...currentQueue],
        states: Array(currentQueue.length).fill('default'),
        pointers: [
            { index: 0, label: 'New Front', color: '#EF4444' },
            { index: currentQueue.length - 1, label: 'Rear', color: '#06b6d4' }
        ],
        explanation: {
            simple: `Dequeued ${dequeuedValue}! The next item in line has automatically become the New Front.`,
            why: 'Removing from the front shifts the queue focus forward.',
            visual: 'Individual positions shift left as the front is cleared.'
        },
        codeLineHighlight: 11
    });

    return steps;
};
