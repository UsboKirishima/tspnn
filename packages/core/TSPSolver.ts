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
     * Algoritmo 2-opt
     * Complessità: O(n^2)
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
