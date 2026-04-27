import React, { useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';

/**
 * MonacoEditor Component
 * 
 * VS Code-like editor for algorithm code with syntax highlighting,
 * line highlighting synced to visualization, and editable code.
 * 
 * Props:
 * - code: Object with language keys (cpp, java, python, javascript)
 * - language: Current language to display
 * - highlightLine: Line number to highlight (1-indexed)
 * - onLanguageChange: Function to change language
 * - onCodeChange: Callback when user edits code
 * - readOnly: Whether the editor is read-only
 */

const LANG_MAP = {
    cpp: 'cpp',
    java: 'java',
    python: 'python',
    javascript: 'javascript',
};

const LANG_LABELS = {
    cpp: 'C++',
    java: 'Java',
    python: 'Python',
    javascript: 'JavaScript',
};

const MonacoEditor = ({
    code = {},
    language = 'javascript',
    highlightLine = null,
    onLanguageChange,
    onCodeChange,
    readOnly = false,
}) => {
    const editorRef = useRef(null);
    const decorationsRef = useRef([]);

    const currentCode = code[language] || '';
    const availableLanguages = Object.keys(code);

    const handleEditorDidMount = useCallback((editor) => {
        editorRef.current = editor;
        // Apply initial highlight
        if (highlightLine) {
            applyHighlight(editor, highlightLine);
        }
    }, [highlightLine]);

    const applyHighlight = useCallback((editor, line) => {
        if (!editor || !line) {
            if (editor && decorationsRef.current.length) {
                decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
            }
            return;
        }
        decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
            {
                range: {
                    startLineNumber: line,
                    startColumn: 1,
                    endLineNumber: line,
                    endColumn: 1,
                },
                options: {
                    isWholeLine: true,
                    className: 'monaco-highlight-line',
                    glyphMarginClassName: 'monaco-highlight-glyph',
                    linesDecorationsClassName: 'monaco-highlight-line-decoration',
                },
            },
        ]);
        editor.revealLineInCenter(line);
    }, []);

    // Update highlight when step changes
    React.useEffect(() => {
        if (editorRef.current) {
            applyHighlight(editorRef.current, highlightLine);
        }
    }, [highlightLine, applyHighlight]);

    const handleChange = useCallback((value) => {
        if (onCodeChange) {
            onCodeChange(value, language);
        }
    }, [onCodeChange, language]);

    return (
        <div className="monaco-editor-container">
            {/* Header */}
            <div className="monaco-editor-header">
                <div className="flex items-center space-x-3">
                    <div className="flex space-x-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-300 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Code Editor
                    </h3>
                </div>

                {/* Language Tabs */}
                <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-lg border border-white/5">
                    {availableLanguages.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => onLanguageChange && onLanguageChange(lang)}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${
                                language === lang
                                    ? 'bg-[#10b981] text-black shadow-lg shadow-[#10b981]/20'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            {LANG_LABELS[lang] || lang}
                        </button>
                    ))}
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="monaco-editor-body">
                <Editor
                    height="100%"
                    language={LANG_MAP[language] || language}
                    value={currentCode}
                    theme="vs-dark"
                    onChange={handleChange}
                    onMount={handleEditorDidMount}
                    options={{
                        readOnly,
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                        fontLigatures: true,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 12, bottom: 12 },
                        wordWrap: 'on',
                        renderLineHighlight: 'all',
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        smoothScrolling: true,
                        bracketPairColorization: { enabled: true },
                        guides: { bracketPairs: true },
                        glyphMargin: true,
                        folding: true,
                        lineDecorationsWidth: 4,
                        contextmenu: true,
                        quickSuggestions: false,
                        parameterHints: { enabled: false },
                        suggestOnTriggerCharacters: false,
                    }}
                />
            </div>

            {/* Status Bar */}
            <div className="monaco-editor-statusbar">
                <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-mono text-gray-500">
                        {LANG_LABELS[language] || language}
                    </span>
                    {highlightLine && (
                        <span className="text-[10px] font-mono text-[#10b981]">
                            ● Line {highlightLine} executing
                        </span>
                    )}
                </div>
                <span className="text-[10px] font-mono text-gray-600">
                    {readOnly ? '🔒 Read Only' : '✏️ Editable'}
                </span>
            </div>
        </div>
    );
};

export default MonacoEditor;
