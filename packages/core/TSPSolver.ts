import Graph from "./Graph";
import { Edge } from "./structures/Edge";
import { Node } from "./structures/Node";

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

    public get distance() {
        return this._distance;
    }

    public get graph() {
        return this._graph;
    }

}