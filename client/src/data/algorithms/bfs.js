/**
 * Breadth-First Search (BFS) for Graphs/Trees
 * Visualized using a Visited Status Array and a Queue Pointer.
 */

export const bfsAlgorithm = {
    id: 'bfs',
    name: 'BFS Traversal',
    category: 'Trees & Graphs',
    difficulty: 'Intermediate',

    concept: {
        title: 'Breadth-First Search (BFS)',
        analogy: 'Imagine dropping a stone in a calm pond. The ripples spread outward level by level. BFS does the same—it visits all neighbors at distance 1, then all neighbors at distance 2, and so on.',
        keyIdea: 'Explore nodes level-by-level using a Queue (FIFO).',
        whenToUse: 'Finding the shortest path in an unweighted graph, or broadcasting information across a network.',
        visual: 'The array represents our "Visited Map". Green boxes are nodes we have finished processing.',
        simpleAlgorithm: [
            { title: 'Initialize Queue', description: 'Start by adding the source node to a Queue.' },
            { title: 'Dequeue & Visit', description: 'Take a node from the front, visit it, and mark it as Visited.' },
            { title: 'Enqueue Neighbors', description: 'Add all unvisited neighbors of the current node to the back of the Queue.' },
            { title: 'Repeat', description: 'Keep going until the Queue is empty.' }
        ]
    },

    complexity: {
        time: {
            best: 'O(V + E)',
            average: 'O(V + E)',
            worst: 'O(V + E)'
        },
        space: 'O(V)',
        explanation: 'We visit every vertex (V) and every edge (E) exactly once. The queue can grow up to the width of the graph (V).'
    },

    code: {
        cpp: `#include <queue>
#include <vector>
using namespace std;

void bfs(vector<vector<int>>& adj, int start) {
    int n = adj.size();
    vector<bool> visited(n, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
        java: `void bfs(int startNode) {
    Queue<Integer> q = new LinkedList<>();
    q.add(startNode);
    visited[startNode] = true;

    while (!q.isEmpty()) {
        int n = q.poll();
        for (int adj : graph[n]) {
            if (!visited[adj]) {
                visited[adj] = true;
                q.add(adj);
            }
        }
    }
}`,
        python: `def bfs(graph, start):
    visited = {start}
    queue = deque([start])

    while queue:
        vertex = queue.popleft()
        print(vertex)

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`
    }
};

export const generateBFSSteps = (initialArray) => {
    const steps = [];
    // Use values from initialArray as node names. Default to 0-6 if too small.
    const nodes = initialArray.length >= 7 ? initialArray.slice(0, 7) : [100, 200, 300, 400, 500, 600, 700];
    const adj = {
        0: [1, 2],
        1: [3, 4],
        2: [5, 6],
        3: [], 4: [], 5: [], 6: []
    };

    let visited = Array(nodes.length).fill(false);
    let queue = [0];
    visited[0] = true;

    // Initial State
    steps.push({
        action: 'initialize',
        array: nodes,
        states: visited.map(v => v ? 'comparing' : 'default'),
        pointers: [{ index: 0, label: `Start (${nodes[0]})`, color: '#06b6d4' }],
        explanation: {
            objective: 'Initialize BFS Queue',
            simple: `Starting BFS at Node ${nodes[0]}. It is added to the Queue.`,
            why: 'BFS uses a FIFO queue to track which nodes to explore next.',
            visual: 'Cyan pointer shows the current node in the Queue.'
        }
    });

    while (queue.length > 0) {
        let currIdx = queue.shift();

        // Step: Processing Current
        steps.push({
            action: 'processing',
            array: nodes,
            states: visited.map((v, i) => i === currIdx ? 'comparing' : (v ? 'sorted' : 'default')),
            pointers: [{ index: currIdx, label: 'Processing', color: '#8B5CF6' }],
            explanation: {
                objective: `Process Node ${nodes[currIdx]}`,
                simple: `De-queueing Node ${nodes[currIdx]} and checking its neighbors.`,
                why: 'We visit nodes in the exact order they were enqueued.',
                visual: 'Purple pointer identifies the node currently being explored.'
            }
        });

        const neighbors = adj[currIdx];
        for (let neighborIdx of neighbors) {
            if (!visited[neighborIdx]) {
                visited[neighborIdx] = true;
                queue.push(neighborIdx);

                // Step: Enqueue Neighbor
                steps.push({
                    action: 'enqueue',
                    array: nodes,
                    states: visited.map((v, i) => i === neighborIdx ? 'swapping' : (i === currIdx ? 'comparing' : (v ? 'sorted' : 'default'))),
                    pointers: [
                        { index: currIdx, label: 'Parent', color: '#8B5CF6' },
                        { index: neighborIdx, label: 'Enqueue', color: '#10b981' }
                    ],
                    explanation: {
                        objective: `Discover Neighbor ${nodes[neighborIdx]}`,
                        simple: `Node ${nodes[neighborIdx]} is a neighbor of ${nodes[currIdx]}. Adding to Queue.`,
                        why: 'Nodes at distance d+1 are enqueued as we process nodes at distance d.',
                        visual: 'Green highlight shows the newly discovered frontier node.'
                    }
                });
            }
        }

        // Step: Finish Processing
        steps.push({
            action: 'finished',
            array: nodes,
            states: visited.map((v, i) => v && !queue.includes(i) ? 'sorted' : (v ? 'comparing' : 'default')),
            pointers: [],
            explanation: {
                objective: `Complete Node ${nodes[currIdx]}`,
                simple: `Node ${nodes[currIdx]} and its direct links have been analyzed.`,
                why: 'This node is now fully explored.',
                visual: 'The node turns green, indicating traversal completion.'
            }
        });
    }

    return steps;
};
