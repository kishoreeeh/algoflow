const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/ai/chat
 * @desc    AI chatbot endpoint for algorithm tutoring
 * @access  Private
 */
router.post('/chat', protect, async (req, res) => {
    try {
        const { message, context, conversationHistory } = req.body;

        // In production, integrate with OpenAI, Google Gemini, or custom AI model
        // For now, using intelligent pattern matching

        const response = generateAIResponse(message, context, conversationHistory);

        res.json({
            success: true,
            response: response,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing your question'
        });
    }
});

/**
 * @route   POST /api/ai/explain-code
 * @desc    Explain code line by line
 * @access  Private
 */
router.post('/explain-code', protect, async (req, res) => {
    try {
        const { code, language } = req.body;

        const explanation = explainCode(code, language);

        res.json({
            success: true,
            explanation
        });
    } catch (error) {
        console.error('Error explaining code:', error);
        res.status(500).json({
            success: false,
            message: 'Error explaining code'
        });
    }
});

/**
 * @route   POST /api/ai/analyze-error
 * @desc    Analyze and explain code errors
 * @access  Private
 */
router.post('/analyze-error', protect, async (req, res) => {
    try {
        const { error, code, language } = req.body;

        const analysis = analyzeError(error, code, language);

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('Error analyzing error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing error'
        });
    }
});

// AI Response Generator (Enhanced pattern matching)
function generateAIResponse(message, context, history) {
    const lowerMessage = message.toLowerCase();

    // Time Complexity Questions
    if (lowerMessage.includes('time complexity') || lowerMessage.includes('big o')) {
        if (context && context.algorithm) {
            return `The time complexity of ${context.algorithm} is:\n\n` +
                `• Best Case: O(n) - when the array is already sorted\n` +
                `• Average Case: O(n²) - typical random data\n` +
                `• Worst Case: O(n²) - when array is reverse sorted\n\n` +
                `This means that if you double the input size, the time taken roughly quadruples. ` +
                `Would you like me to explain why this is the case?`;
        }
        return `Time complexity describes how an algorithm's runtime grows with input size:\n\n` +
            `• O(1) - Constant: Same time regardless of input\n` +
            `• O(log n) - Logarithmic: Very efficient, doubles input adds one step\n` +
            `• O(n) - Linear: Time grows proportionally with input\n` +
            `• O(n log n) - Linearithmic: Efficient sorting algorithms\n` +
            `• O(n²) - Quadratic: Nested loops, less efficient\n` +
            `• O(2ⁿ) - Exponential: Very slow, avoid if possible\n\n` +
            `Which complexity would you like to understand better?`;
    }

    // Space Complexity
    if (lowerMessage.includes('space complexity')) {
        return `Space complexity measures the memory an algorithm uses:\n\n` +
            `• O(1) - Constant space: Uses fixed memory (in-place algorithms)\n` +
            `• O(n) - Linear space: Memory grows with input size\n` +
            `• O(n²) - Quadratic space: 2D arrays or matrices\n\n` +
            `Most sorting algorithms aim for O(1) space complexity by sorting in-place. ` +
            `Merge Sort uses O(n) space for the temporary arrays.`;
    }

    // Sorting Algorithms
    if (lowerMessage.includes('bubble sort')) {
        return `Bubble Sort is a simple sorting algorithm that:\n\n` +
            `1. Compares adjacent elements\n` +
            `2. Swaps them if they're in wrong order\n` +
            `3. Repeats until the array is sorted\n\n` +
            `**Pros:**\n• Simple to understand and implement\n• Stable (maintains order of equal elements)\n• In-place (O(1) space)\n\n` +
            `**Cons:**\n• Slow for large datasets (O(n²))\n• Not used in production\n\n` +
            `It's called "Bubble" because larger elements "bubble up" to the end. Would you like to see it in action?`;
    }

    if (lowerMessage.includes('quick sort')) {
        return `Quick Sort is an efficient divide-and-conquer algorithm:\n\n` +
            `1. Pick a pivot element\n` +
            `2. Partition array: smaller left, larger right\n` +
            `3. Recursively sort both partitions\n\n` +
            `**Time Complexity:**\n• Average: O(n log n)\n• Worst: O(n²) (rare with good pivot selection)\n\n` +
            `**Why it's fast:**\n• In-place sorting\n• Cache-friendly\n• Good average performance\n\n` +
            `Used in many standard libraries! Want to learn about pivot selection strategies?`;
    }

    // Data Structures
    if (lowerMessage.includes('array') && lowerMessage.includes('linked list')) {
        return `**Arrays vs Linked Lists:**\n\n` +
            `**Arrays:**\n• Contiguous memory\n• O(1) random access\n• O(n) insertion/deletion\n• Fixed size (in some languages)\n\n` +
            `**Linked Lists:**\n• Non-contiguous memory\n• O(n) random access\n• O(1) insertion/deletion (at known position)\n• Dynamic size\n\n` +
            `**Use Arrays when:** You need fast random access\n` +
            `**Use Linked Lists when:** You need frequent insertions/deletions\n\n` +
            `Which one would you like to explore further?`;
    }

    // Interview Preparation
    if (lowerMessage.includes('interview')) {
        return `**Technical Interview Tips:**\n\n` +
            `**Before Coding:**\n` +
            `1. Clarify the problem - ask questions!\n` +
            `2. Discuss your approach\n` +
            `3. Consider edge cases\n` +
            `4. Mention time/space complexity\n\n` +
            `**While Coding:**\n` +
            `5. Think out loud\n` +
            `6. Write clean, readable code\n` +
            `7. Test with examples\n\n` +
            `**After Coding:**\n` +
            `8. Walk through your solution\n` +
            `9. Discuss optimizations\n` +
            `10. Handle feedback gracefully\n\n` +
            `**Practice on:** LeetCode, HackerRank, AlgoExpert\n\n` +
            `What specific area would you like to prepare for?`;
    }

    // Recursion
    if (lowerMessage.includes('recursion')) {
        return `**Recursion** is when a function calls itself:\n\n` +
            `**Key Components:**\n` +
            `1. Base case - when to stop\n` +
            `2. Recursive case - calling itself with smaller input\n\n` +
            `**Example (Factorial):**\n` +
            `\`\`\`\nfactorial(5) = 5 * factorial(4)\n             = 5 * 4 * factorial(3)\n             = 5 * 4 * 3 * factorial(2)\n             = 5 * 4 * 3 * 2 * factorial(1)\n             = 5 * 4 * 3 * 2 * 1 = 120\n\`\`\`\n\n` +
            `**Tips:**\n• Always have a base case\n• Make progress toward base case\n• Consider stack overflow for deep recursion\n\n` +
            `Would you like to see more examples?`;
    }

    // Default helpful response
    return `I'm here to help you master DSA! I can assist with:\n\n` +
        `• **Algorithm explanations** - How they work and when to use them\n` +
        `• **Complexity analysis** - Time and space complexity\n` +
        `• **Code debugging** - Find and fix errors\n` +
        `• **Interview prep** - Tips and common questions\n` +
        `• **Concept clarification** - Arrays, trees, graphs, etc.\n\n` +
        `What would you like to learn about?`;
}

// Code Explanation Function
function explainCode(code, language) {
    // Simplified code explanation - in production, use AI model
    const lines = code.split('\n');
    const explanations = lines.map((line, index) => {
        let explanation = '';

        if (line.includes('for') || line.includes('while')) {
            explanation = 'Loop iteration - repeats the following code block';
        } else if (line.includes('if')) {
            explanation = 'Conditional check - executes if condition is true';
        } else if (line.includes('return')) {
            explanation = 'Returns the value and exits the function';
        } else if (line.includes('function') || line.includes('def')) {
            explanation = 'Function definition - reusable code block';
        } else if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
            explanation = 'Comment - documentation for humans';
        } else {
            explanation = 'Code statement';
        }

        return {
            lineNumber: index + 1,
            code: line,
            explanation
        };
    });

    return {
        language,
        lineByLine: explanations,
        summary: `This ${language} code implements an algorithm with ${lines.length} lines.`
    };
}

// Error Analysis Function
function analyzeError(error, code, language) {
    const errorLower = error.toLowerCase();

    let analysis = {
        errorType: 'Unknown Error',
        explanation: '',
        solution: '',
        prevention: ''
    };

    if (errorLower.includes('undefined') || errorLower.includes('null')) {
        analysis = {
            errorType: 'Null/Undefined Reference',
            explanation: 'You\'re trying to access a property or method on a variable that is null or undefined.',
            solution: 'Check if the variable exists before using it:\n```\nif (variable !== null && variable !== undefined) {\n    // use variable\n}\n```',
            prevention: 'Always initialize variables and validate input data.'
        };
    } else if (errorLower.includes('index') || errorLower.includes('bounds')) {
        analysis = {
            errorType: 'Index Out of Bounds',
            explanation: 'You\'re trying to access an array index that doesn\'t exist.',
            solution: 'Check array length before accessing:\n```\nif (index >= 0 && index < array.length) {\n    // access array[index]\n}\n```',
            prevention: 'Always validate array indices and use array.length in loops.'
        };
    } else if (errorLower.includes('syntax')) {
        analysis = {
            errorType: 'Syntax Error',
            explanation: 'There\'s a mistake in your code structure - missing bracket, semicolon, or incorrect keyword.',
            solution: 'Check for:\n• Missing or extra brackets\n• Missing semicolons\n• Misspelled keywords\n• Unclosed strings',
            prevention: 'Use a code editor with syntax highlighting and linting.'
        };
    }

    return analysis;
}

module.exports = router;
