import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '../../config/api';

/**
 * AI Chatbot - 24/7 Intelligent Tutoring System
 * 
 * Provides real-time assistance with algorithms, code explanation, and debugging
 */
const AIChatbot = ({ algorithmContext = null }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Welcome message
        if (messages.length === 0) {
            setMessages([{
                id: 1,
                type: 'bot',
                content: 'Hello! I\'m your AI tutor. I can help you understand algorithms, explain code, debug errors, and prepare for interviews. How can I assist you today?',
                timestamp: new Date()
            }]);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await axios.post(
                `${API_URL}/ai/chat`,
                {
                    message: input,
                    context: algorithmContext,
                    conversationHistory: messages.slice(-5) // Last 5 messages for context
                },
                { headers: getAuthHeaders() }
            );

            const botMessage = {
                id: messages.length + 2,
                type: 'bot',
                content: response.data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            // Fallback to mock response
            const botMessage = {
                id: messages.length + 2,
                type: 'bot',
                content: generateMockResponse(input),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const generateMockResponse = (question) => {
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('time complexity') || lowerQuestion.includes('big o')) {
            return 'Time complexity measures how the runtime of an algorithm grows with input size. For example, O(n) means linear time - doubling the input doubles the time. O(n²) is quadratic - doubling the input quadruples the time. Would you like me to explain a specific algorithm\'s complexity?';
        }

        if (lowerQuestion.includes('bubble sort')) {
            return 'Bubble Sort repeatedly compares adjacent elements and swaps them if they\'re in the wrong order. It has O(n²) time complexity in worst and average cases, making it inefficient for large datasets. However, it\'s simple to understand and implement, making it great for learning. Would you like to see a step-by-step example?';
        }

        if (lowerQuestion.includes('interview')) {
            return 'For technical interviews, focus on: 1) Understanding the problem clearly, 2) Discussing your approach before coding, 3) Analyzing time/space complexity, 4) Testing with edge cases, 5) Optimizing your solution. Practice on platforms like LeetCode and HackerRank. What specific area would you like to prepare for?';
        }

        return 'That\'s a great question! I can help you with algorithm explanations, code debugging, complexity analysis, and interview preparation. Could you provide more details about what you\'d like to learn?';
    };

    const quickQuestions = [
        'Explain time complexity',
        'How does Bubble Sort work?',
        'Interview preparation tips',
        'Difference between array and linked list'
    ];

    const handleQuickQuestion = (question) => {
        setInput(question);
    };

    if (!isOpen) {
        return (
            <button
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
                onClick={() => setIsOpen(true)}
            >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-[#1a1f2e] border border-[rgba(226,232,240,0.12)] rounded-lg shadow-2xl flex flex-col z-50 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(226,232,240,0.08)] bg-gradient-to-r from-blue-600/10 to-blue-500/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#f1f5f9]">AI Tutor</h3>
                        <p className="text-xs text-[#94a3b8]">Always here to help</p>
                    </div>
                </div>
                <button
                    className="btn-ghost p-2"
                    onClick={() => setIsOpen(false)}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-[#252b3b] text-[#e2e8f0]'
                                }`}
                        >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className="text-xs mt-1 opacity-60">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-[#252b3b] rounded-lg p-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
                <div className="px-4 pb-2">
                    <p className="text-xs text-[#94a3b8] mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((question, index) => (
                            <button
                                key={index}
                                className="text-xs px-3 py-1.5 bg-[#252b3b] hover:bg-[#2d3548] text-[#cbd5e1] rounded-full transition-colors"
                                onClick={() => handleQuickQuestion(question)}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-[rgba(226,232,240,0.08)]">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask me anything..."
                        className="input flex-1 text-sm"
                    />
                    <button
                        className="btn btn-primary px-4"
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;
