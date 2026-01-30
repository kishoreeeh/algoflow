import React from 'react';

/**
 * ArrayVisualizer Component
 * 
 * Visualizes an array with different states for each element.
 * 
 * Element States:
 * - default: Normal state (gray)
 * - comparing: Being compared (yellow)
 * - swapping: Being swapped (red, pulsing)
 * - sorted: In final position (green)
 * 
 * Props:
 * - array: Array of numbers to visualize
 * - states: Array of state strings ('default', 'comparing', 'swapping', 'sorted')
 * - pointers: Array of pointer objects { index, label, color }
 * - highlightIndices: Array of indices to highlight
 */
const ArrayVisualizer = ({
    array = [],
    states = [],
    pointers = [],
    highlightIndices = []
}) => {
    // Get state class for an element
    const getElementClass = (index) => {
        const state = states[index] || 'default';

        const stateClasses = {
            default: 'array-element-default',
            comparing: 'array-element-comparing',
            swapping: 'array-element-swapping',
            sorted: 'array-element-sorted',
        };

        return stateClasses[state] || stateClasses.default;
    };

    // Check if index has a pointer
    const getPointersAtIndex = (index) => {
        return pointers.filter(p => p.index === index);
    };

    return (
        <div className="w-full">
            {/* Array Container */}
            <div className="flex items-center justify-center gap-3 flex-wrap p-8 bg-gray-50 rounded-xl min-h-[200px]">
                {array.map((value, index) => (
                    <div key={index} className="relative">
                        {/* Array Element */}
                        <div
                            className={`
                ${getElementClass(index)}
                ${highlightIndices.includes(index) ? 'highlight-pulse' : ''}
              `}
                        >
                            <span className="select-none">{value}</span>
                        </div>

                        {/* Index Label (below element) */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">
                            {index}
                        </div>

                        {/* Pointers (if any) */}
                        {getPointersAtIndex(index).map((pointer, pIndex) => (
                            <div
                                key={pIndex}
                                className="pointer"
                                style={{
                                    bottom: `-${40 + (pIndex * 20)}px`,
                                    color: pointer.color || '#8B5CF6'
                                }}
                            >
                                {/* Arrow */}
                                <div className="pointer-arrow" style={{ borderBottomColor: pointer.color || '#8B5CF6' }} />
                                {/* Label */}
                                <span className="font-bold">{pointer.label}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
                <LegendItem color="bg-array-default" label="Not Checked" />
                <LegendItem color="bg-array-comparing" label="Comparing" />
                <LegendItem color="bg-array-swapping" label="Swapping" />
                <LegendItem color="bg-array-sorted" label="Sorted" />
            </div>
        </div>
    );
};

/**
 * LegendItem Component
 * 
 * Individual legend item showing color and label
 */
const LegendItem = ({ color, label }) => {
    return (
        <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded ${color} border-2 border-gray-300`} />
            <span className="text-sm text-gray-600">{label}</span>
        </div>
    );
};

export default ArrayVisualizer;
