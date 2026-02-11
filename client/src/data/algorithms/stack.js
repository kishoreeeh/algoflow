/**
 * Stack Data Structure Implementation (LIFO)
 */

export const stackAlgorithm = {
    id: 'stack',
    name: 'Stack',
    category: 'Data Structures',
    difficulty: 'Beginner',

    concept: {
        title: 'What is a Stack?',
        analogy: 'Think of a stack of plates in a cafeteria. You can only add a new plate to the top (Push), and when you need one, you take it from the top (Pop). The plate that was put on last is the first one to be taken off.',
        keyIdea: 'Last-In, First-Out (LIFO). Elements are added and removed from the same end.',
        whenToUse: 'Excellent for backtracking (like the Back button in a browser), function call management (Execution Stack), and undo mechanisms in software.',
        visual: 'The first element is at the "Bottom". New elements are stacked on top. The "Top" pointer always points to the most recently added item.',
        simpleAlgorithm: [
            { title: 'Push', description: 'Add a new element to the top of the stack.' },
            { title: 'Pop', description: 'Remove the element currently at the top.' },
            { title: 'Peek', description: 'Look at the top element without removing it.' },
            { title: 'Check Empty', description: 'Ensure the stack isn\'t empty before popping (avoid Underflow).' }
        ]
    },

    complexity: {
        time: {
            best: 'O(1)',
            average: 'O(1)',
            worst: 'O(1)'
        },
        space: 'O(n)',
        explanation: 'Stack operations (Push/Pop) are extremely fast because we only ever touch the top element.'
    },

    code: {
        cpp: `#include <stack>
using namespace std;

class Stack {
    stack<int> s;
public:
    void push(int x) {
        s.push(x);
    }
    void pop() {
        if (!s.empty()) s.pop();
    }
    int peek() {
        if (!s.empty()) return s.top();
        return -1;
    }
    bool isEmpty() {
        return s.empty();
    }
};`,
        java: `class Stack {
    int size = 10;
    int[] arr = new int[size];
    int top = -1;

    void push(int value) {
        if (top == size - 1) return;
        arr[++top] = value;
    }

    int pop() {
        if (top == -1) return -1;
        return arr[top--];
    }

    int peek() {
        if (top == -1) return -1;
        return arr[top];
    }

    public static void main(String[] args) {
        Stack s = new Stack();
        s.push(10);
        s.pop();
    }
}`,
        python: `class Stack:
    def __init__(self):
        self.items = []
    def push(self, item):
        self.items.append(item)
    def pop(self):
        return self.items.pop()
    def peek(self):
        return self.items[-1]`
    }
};

/**
 * Generate step-by-step visualization for Stack Operations (Simulating Push and Pop)
 */
export const generateStackSteps = (inputArray) => {
    const steps = [];
    let currentStack = [...inputArray];
    const n = currentStack.length;

    // Initial State
    steps.push({
        action: 'initialize',
        array: [...currentStack],
        states: Array(currentStack.length).fill('default'),
        pointers: [{ index: currentStack.length - 1, label: 'Top', color: '#06b6d4' }],
        explanation: {
            simple: 'This is our current Stack. The most recently added item is at the Top.',
            why: 'Stacks prioritize the last item added.',
            visual: 'Indices go from 0 (Bottom) to n-1 (Top).'
        },
        codeLineHighlight: 1
    });

    // Step: Preparing to Push
    const newValue = 77;
    steps.push({
        action: 'preparing-push',
        array: [...currentStack],
        states: Array(currentStack.length).fill('default'),
        pointers: [{ index: currentStack.length - 1, label: 'Top', color: '#06b6d4' }],
        explanation: {
            simple: `Ready to Push ${newValue} onto the Stack.`,
            why: 'New items always go vertically above the current Top.',
            visual: 'We are about to expand the structure.'
        },
        codeLineHighlight: 6
    });

    // Step: Pushed
    currentStack.push(newValue);
    steps.push({
        action: 'push',
        array: [...currentStack],
        states: currentStack.map((_, idx) => idx === currentStack.length - 1 ? 'sorted' : 'default'),
        pointers: [{ index: currentStack.length - 1, label: 'New Top', color: '#10b981' }],
        explanation: {
            simple: `Pushed ${newValue}! It is now the new Top of the stack.`,
            why: 'Push adds the element and increments the top pointer.',
            visual: 'The green box shows the latest addition to the LIFO structure.'
        },
        codeLineHighlight: 8
    });

    // Step: Preparing to Pop
    steps.push({
        action: 'preparing-pop',
        array: [...currentStack],
        states: currentStack.map((_, idx) => idx === currentStack.length - 1 ? 'swapping' : 'default'),
        pointers: [{ index: currentStack.length - 1, label: 'Pop Target', color: '#EF4444' }],
        explanation: {
            simple: 'Selecting the Top item for removal (Pop).',
            why: 'In a Stack, we can only remove the item that is at the Top.',
            visual: 'The red highlight indicates which item is leaving.'
        },
        codeLineHighlight: 11
    });

    // Step: Popped
    const poppedValue = currentStack.pop();
    steps.push({
        action: 'pop',
        array: [...currentStack],
        states: Array(currentStack.length).fill('default'),
        pointers: [{ index: currentStack.length - 1, label: 'Top', color: '#06b6d4' }],
        explanation: {
            simple: `Popped ${poppedValue}! The item below it is now the new Top.`,
            why: 'Pop removes the last-added item and moves the pointer down.',
            visual: 'The stack has shrunk, following LIFO logic.'
        },
        codeLineHighlight: 13
    });

    return steps;
};
