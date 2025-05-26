import Graph from "./Graph";
import Edge from "./structures/Edge";
import Node from "./structures/Node";

interface NodeWrap {
    node: Node;
    visited: boolean;
}

export default class TSPSolver {
    private _graph: Graph;
    private _distance: number = 0;

    public constructor(graph: Graph) {
        this._graph = graph;
    }

    public nearestNeighbour(start: Node = this.graph.nodes[0]): Node[] {
        if (this.graph.nodes.length === 0) return [];

        const nodeWraps: NodeWrap[] = this.graph.nodes.map(n => ({
            node: n,
            visited: false
        }));

        const path: Node[] = [];
        let currentWrap = nodeWraps.find(w => w.node === start)!;
        currentWrap.visited = true;
        path.push(currentWrap.node);

        while (path.length < this.graph.nodes.length) {
            const nearestWrap = this.findNearestUnvisited(currentWrap, nodeWraps);
            if (!nearestWrap) break;
            nearestWrap.visited = true;
            path.push(nearestWrap.node);
            currentWrap = nearestWrap;
        }

        path.push(start);
        return path;
    }

    private findNearestUnvisited(nodeWrap: NodeWrap, wraps: NodeWrap[]): NodeWrap | null {
        const neighbors = this.graph.getNeighbors(nodeWrap.node);

        let minEdge: Edge | null = null;
        let nearestWrap: NodeWrap | null = null;

        for (const edge of neighbors) {
            const targetWrap = wraps.find(w => w.node === edge.to && !w.visited);
            if (targetWrap) {
                if (!minEdge || edge.weight() < minEdge.weight()) {
                    minEdge = edge;
                    nearestWrap = targetWrap;
                }
            }
        }

        this._distance += minEdge?.weight() ?? 0;
        return nearestWrap;
    }

    /**
     * 2-opt Algorithm (used for route optimization in TSP)
     * 
     * The 2-opt algorithm is a simple local search method to improve a given path 
     * by iteratively removing two edges and reconnecting the nodes in a different way 
     * to reduce the total path length.
     * 
     * How it works:
     * 1. Start with an initial route (e.g., from nearest neighbour).
     * 2. For every pair of non-adjacent edges (i, i+1) and (k, k+1):
     *    - Reverse the order of the nodes between i+1 and k.
     *    - This creates a new route with the same nodes but possibly shorter.
     * 3. If the new route is shorter than the current one, accept it.
     * 4. Repeat until no further improvement is found (local minimum).
     * 
     * Pros:
     * - Simple to implement.
     * - Often greatly improves greedy solutions like Nearest Neighbour.
     * 
     * Cons:
     * - Might get stuck in local minima.
     * - Slower than greedy methods for large inputs.
     */
    public twoOpt(start: Node = this.graph.nodes[0]): Node[] {
        // Inizializzo il tour con il Nearest Neighbour
        let tour = this.nearestNeighbour(start);
        let improved = true;

        let bestDistance = this.totalDistance(tour); // Distanza iniziale
        this._distance = bestDistance; // Imposto la distanza iniziale

        while (improved) {
            improved = false;

            for (let i = 1; i < tour.length - 2; i++) {
                for (let j = i + 1; j < tour.length - 1; j++) {
                    this.reverseSegment(tour, i, j); // Inversione del segmento

                    const newDistance = this.totalDistance(tour); // Nuova distanza del tour
                    if (newDistance < bestDistance) {
                        bestDistance = newDistance;
                        improved = true; // Se la distanza migliora, continuare a ottimizzare
                    } else {
                        this.reverseSegment(tour, i, j); // Annullo lo swap se non migliora
                    }
                }
            }
        }

        return tour;
    }

    private reverseSegment(tour: Node[], i: number, j: number): void {
        while (i < j) {
            [tour[i], tour[j]] = [tour[j], tour[i]]; // Scambio degli indici
            i++;
            j--;
        }
    }

    private totalDistance(tour: Node[]): number {
        let total = 0;
        for (let i = 0; i < tour.length - 1; i++) {
            total += this.graph.getEdge(tour[i], tour[i + 1])?.weight() ?? 0;
        }
        total += this.graph.getEdge(tour[tour.length - 1], tour[0])?.weight() ?? 0;
        return total;
    }

    public get distance() {
        return this._distance;
    }

    public get graph() {
        return this._graph;
    }
}
