import React, { useState } from 'react';
import Card from '../common/Card';

/**
 * CodePanel Component
 * 
 * Displays algorithm code with syntax highlighting and line highlighting.
 * 
 * Props:
 * - code: Object with language keys (java, python, javascript)
 * - language: Current language to display
 * - highlightLine: Line number to highlight (1-indexed)
 * - onLanguageChange: Function to change language
 */
const CodePanel = ({
    code = {},
    language = 'javascript',
    highlightLine = null,
    onLanguageChange
}) => {
    const [selectedLanguage, setSelectedLanguage] = useState(language);

    // Get code for selected language
    const currentCode = code[selectedLanguage] || '';
    const codeLines = currentCode.split('\n');

    // Handle language change
    const handleLanguageChange = (lang) => {
        setSelectedLanguage(lang);
        if (onLanguageChange) {
            onLanguageChange(lang);
        }
    };

    // Available languages
    const availableLanguages = Object.keys(code);

    return (
        <Card className="h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Code
                </h3>

                {/* Language Selector */}
                {availableLanguages.length > 1 && (
                    <div className="flex space-x-2">
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className={`
                  px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
                  ${selectedLanguage === lang
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }
                `}
                            >
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Code Display */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="custom-scrollbar overflow-x-auto">
                    <pre className="p-4 text-sm leading-relaxed">
                        {codeLines.map((line, index) => {
                            const lineNumber = index + 1;
                            const isHighlighted = lineNumber === highlightLine;

                            return (
                                <div
                                    key={index}
                                    className={`
                    flex
                    ${isHighlighted ? 'code-line-highlight' : ''}
                  `}
                                >
                                    {/* Line Number */}
                                    <span className="inline-block w-10 text-right mr-4 text-gray-500 select-none flex-shrink-0">
                                        {lineNumber}
                                    </span>

                                    {/* Code Line */}
                                    <code className="text-gray-100 flex-1">
                                        {line || ' '}
                                    </code>

                                    {/* Active Indicator */}
                                    {isHighlighted && (
                                        <span className="ml-2 text-yellow-400 text-xs flex items-center">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </pre>
                </div>
            </div>

            {/* Info Note */}
            <div className="mt-4 text-xs text-gray-500 flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                    The highlighted line shows which part of the code is currently executing in the visualization.
                </span>
            </div>
        </Card>
    );
};

export default CodePanel;
