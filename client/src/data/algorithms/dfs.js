/**
 * Depth-First Search (DFS) for Graphs/Trees
 * Visualized using a Visited Map and path highlighting.
 */

export const dfsAlgorithm = {
    id: 'dfs',
    name: 'DFS Traversal',
    category: 'Trees & Graphs',
    difficulty: 'Intermediate',

    concept: {
        title: 'Depth-First Search (DFS)',
        analogy: 'Imagine exploring a maze. You keep walking down a path until you hit a dead end, then you backtrack to the last intersection and try a different branch. You go deep before you go wide.',
        keyIdea: 'Explore as far as possible along each branch before backtracking using a Stack (LIFO) or Recursion.',
        whenToUse: 'Pathfinding in mazes, topological sorting, or solving puzzles like Sudoku.',
        visual: 'Nodes turn Green when visited. The Red pointer shows the backtrack "Unwinding" of the stack.',
        simpleAlgorithm: [
            { title: 'Start at Root', description: 'Push the starting node to a Stack.' },
            { title: 'Go Deep', description: 'Visit a neighbor, mark it visited, and immediately move to its child.' },
            { title: 'Backtrack', description: 'If a node has no unvisited neighbors, pop it and return to the parent.' },
            { title: 'Repeat', description: 'Continue until the stack is empty.' }
        ]
    },

    complexity: {
        time: {
            best: 'O(V + E)',
            average: 'O(V + E)',
            worst: 'O(V + E)'
        },
        space: 'O(V)',
        explanation: 'The memory used depends on the depth of the tree (recursion stack). In the worst case, this is O(V).'
    },

    code: {
        cpp: `#include <vector>
#include <iostream>
using namespace std;

void dfs(int u, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " ";
    
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}`,
        java: `void dfs(int n) {
    visited[n] = true;
    for (int adj : graph[n]) {
        if (!visited[adj]) {
            dfs(adj);
        }
    }
}`,
        python: `def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)`
    }
};

export const generateDFSSteps = (initialArray) => {
    const steps = [];
    // Use values from initialArray as node names. Default if too small.
    const nodes = initialArray.length >= 7 ? initialArray.slice(0, 7) : [100, 200, 300, 400, 500, 600, 700];
    const adj = {
        0: [1, 2],
        1: [3, 4],
        2: [5, 6],
        3: [], 4: [], 5: [], 6: []
    };

    let visited = Array(nodes.length).fill(false);

    const traverse = (currIdx) => {
        visited[currIdx] = true;

        // Step: Visiting Node
        steps.push({
            action: 'visiting',
            array: nodes,
            states: visited.map((v, i) => i === currIdx ? 'comparing' : (v ? 'sorted' : 'default')),
            pointers: [{ index: currIdx, label: 'DFS Path', color: '#EF4444' }],
            explanation: {
                objective: `Explore Node ${nodes[currIdx]}`,
                simple: `Visiting Node ${nodes[currIdx]}. We will now try to go even deeper.`,
                why: 'DFS explores the full depth of a branch before looking at sibling branches.',
                visual: 'Red pointer shows our current "Recursion Depth".'
            }
        });

        for (let neighborIdx of adj[currIdx]) {
            if (!visited[neighborIdx]) {
                traverse(neighborIdx);
            }
        }

        // Step: Backtracking
        steps.push({
            action: 'backtrack',
            array: nodes,
            states: visited.map((v, i) => i === currIdx ? 'swapping' : (v ? 'sorted' : 'default')),
            pointers: [{ index: currIdx, label: 'Backtracking', color: '#F59E0B' }],
            explanation: {
                objective: `Backtrack from Node ${nodes[currIdx]}`,
                simple: `Finished with Node ${nodes[currIdx]} and its children. Returning to parent.`,
                why: 'Backtracking is the "Unwinding" phase of DFS recursion.',
                visual: 'Orange pointer shows the return path to the previous node.'
            }
        });
    };

    traverse(0);

    // Final
    steps.push({
        action: 'complete',
        array: nodes,
        states: Array(nodes.length).fill('sorted'),
        pointers: [],
        explanation: {
            objective: 'DFS Traversal Complete',
            simple: 'We have explored every reachable node in the graph.',
            why: 'The recursion stack is now empty.',
            visual: 'All nodes have been visited and verified.'
        }
    });

    return steps;
};
