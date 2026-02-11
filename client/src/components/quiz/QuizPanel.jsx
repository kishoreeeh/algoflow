import React, { useState, useEffect } from 'react';

/**
 * Quiz Panel - Interactive quiz after algorithm completion
 */
const QuizPanel = ({ algorithm, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [quizStarted, setQuizStarted] = useState(false);

    const questions = getQuestions(algorithm.id);

    useEffect(() => {
        if (quizStarted && timeLeft > 0 && !showResult) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showResult) {
            finishQuiz();
        }
    }, [timeLeft, quizStarted, showResult]);

    const startQuiz = () => {
        setQuizStarted(true);
        setTimeLeft(300);
    };

    const handleAnswer = (answerIndex) => {
        setSelectedAnswer(answerIndex);
    };

    const submitAnswer = () => {
        const question = questions[currentQuestion];
        const isCorrect = selectedAnswer === question.correctAnswer;

        setAnswers([...answers, {
            question: question.question,
            selected: selectedAnswer,
            correct: question.correctAnswer,
            isCorrect
        }]);

        if (isCorrect) {
            setScore(score + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        setShowResult(true);
        if (onComplete) {
            onComplete({
                score,
                total: questions.length,
                percentage: Math.round((score / questions.length) * 100),
                timeSpent: 300 - timeLeft
            });
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!quizStarted) {
        return (
            <div className="card-elevated p-8 text-center">
                <div className="mb-6">
                    <svg className="w-20 h-20 mx-auto text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#f1f5f9] mb-4">
                    Test Your Knowledge
                </h2>
                <p className="text-[#cbd5e1] mb-6 max-w-md mx-auto">
                    Complete this quiz to test your understanding of {algorithm.name}.
                    You have 5 minutes to answer {questions.length} questions.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                    <div className="card p-4">
                        <div className="text-2xl font-bold text-blue-400">{questions.length}</div>
                        <div className="text-sm text-[#94a3b8]">Questions</div>
                    </div>
                    <div className="card p-4">
                        <div className="text-2xl font-bold text-blue-400">5:00</div>
                        <div className="text-sm text-[#94a3b8]">Time Limit</div>
                    </div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={startQuiz}>
                    Start Quiz
                </button>
            </div>
        );
    }

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;

        return (
            <div className="card-elevated p-8">
                <div className="text-center mb-8">
                    <div className="mb-6">
                        {passed ? (
                            <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-20 h-20 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                    </div>
                    <h2 className="text-3xl font-bold text-[#f1f5f9] mb-2">
                        {passed ? 'Excellent Work!' : 'Keep Practicing!'}
                    </h2>
                    <p className="text-[#cbd5e1] mb-6">
                        {passed ? 'You have a strong understanding of this algorithm.' : 'Review the material and try again.'}
                    </p>

                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-600/10 border-4 border-blue-600/20 mb-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-400">{percentage}%</div>
                            <div className="text-xs text-[#94a3b8]">Score</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                        <div className="card p-4">
                            <div className="text-2xl font-bold text-green-400">{score}</div>
                            <div className="text-xs text-[#94a3b8]">Correct</div>
                        </div>
                        <div className="card p-4">
                            <div className="text-2xl font-bold text-red-400">{questions.length - score}</div>
                            <div className="text-xs text-[#94a3b8]">Incorrect</div>
                        </div>
                        <div className="card p-4">
                            <div className="text-2xl font-bold text-[#f1f5f9]">{formatTime(300 - timeLeft)}</div>
                            <div className="text-xs text-[#94a3b8]">Time</div>
                        </div>
                    </div>
                </div>

                {/* Review Answers */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#f1f5f9] mb-4">Review Your Answers</h3>
                    {answers.map((answer, index) => (
                        <div key={index} className={`card p-4 ${answer.isCorrect ? 'bg-green-600/5 border-green-600/20' : 'bg-red-600/5 border-red-600/20'
                            }`}>
                            <div className="flex items-start gap-3">
                                {answer.isCorrect ? (
                                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                                <div className="flex-1">
                                    <div className="font-medium text-[#f1f5f9] mb-2">
                                        Question {index + 1}: {answer.question}
                                    </div>
                                    {!answer.isCorrect && (
                                        <div className="text-sm text-[#cbd5e1]">
                                            <span className="text-red-400">Your answer: {questions[index].options[answer.selected]}</span>
                                            <br />
                                            <span className="text-green-400">Correct answer: {questions[index].options[answer.correct]}</span>
                                        </div>
                                    )}
                                    {questions[index].explanation && (
                                        <div className="mt-2 text-sm text-[#94a3b8] italic">
                                            {questions[index].explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 justify-center mt-8">
                    <button className="btn btn-outline" onClick={() => window.location.reload()}>
                        Retake Quiz
                    </button>
                    <button className="btn btn-primary" onClick={() => window.history.back()}>
                        Continue Learning
                    </button>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-[#f1f5f9]">
                            Question {currentQuestion + 1} of {questions.length}
                        </h3>
                        <p className="text-sm text-[#94a3b8]">{algorithm.name} Quiz</p>
                    </div>
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-blue-400'}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="text-xs text-[#94a3b8]">Time Left</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-[#1a1f2e] rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="card-elevated p-8">
                <h4 className="text-xl font-semibold text-[#f1f5f9] mb-6">
                    {question.question}
                </h4>

                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedAnswer === index
                                    ? 'border-blue-500 bg-blue-600/10'
                                    : 'border-[rgba(226,232,240,0.08)] bg-[#1a1f2e] hover:border-blue-500/50'
                                }`}
                            onClick={() => handleAnswer(index)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === index
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-[#94a3b8]'
                                    }`}>
                                    {selectedAnswer === index && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-[#f1f5f9]">{option}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    className="btn btn-primary w-full mt-6"
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                >
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
            </div>
        </div>
    );
};

// Question bank generator
const getQuestions = (algorithmId) => {
    const questionBank = {
        'bubble-sort': [
            {
                question: 'What is the time complexity of Bubble Sort in the worst case?',
                options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
                correctAnswer: 2,
                explanation: 'Bubble Sort has O(n²) time complexity in the worst case because it uses nested loops.'
            },
            {
                question: 'What is the space complexity of Bubble Sort?',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correctAnswer: 0,
                explanation: 'Bubble Sort is an in-place sorting algorithm with O(1) space complexity.'
            },
            {
                question: 'When is Bubble Sort most efficient?',
                options: ['When the array is already sorted', 'When the array is reverse sorted', 'When the array is random', 'Never efficient'],
                correctAnswer: 0,
                explanation: 'Bubble Sort performs best on nearly sorted arrays with O(n) time complexity.'
            },
            {
                question: 'What does Bubble Sort do in each pass?',
                options: ['Finds the minimum element', 'Swaps adjacent elements if they are in wrong order', 'Divides the array', 'Merges subarrays'],
                correctAnswer: 1,
                explanation: 'Bubble Sort compares and swaps adjacent elements in each pass.'
            },
            {
                question: 'Is Bubble Sort a stable sorting algorithm?',
                options: ['Yes', 'No', 'Sometimes', 'Depends on implementation'],
                correctAnswer: 0,
                explanation: 'Bubble Sort is stable as it maintains the relative order of equal elements.'
            }
        ],
        // Add more algorithms...
        'default': [
            {
                question: 'What is an algorithm?',
                options: ['A programming language', 'A step-by-step procedure to solve a problem', 'A data structure', 'A compiler'],
                correctAnswer: 1,
                explanation: 'An algorithm is a well-defined sequence of steps to solve a problem.'
            }
        ]
    };

    return questionBank[algorithmId] || questionBank['default'];
};

export default QuizPanel;
