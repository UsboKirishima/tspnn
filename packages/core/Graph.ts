import Edge from "./structures/Edge";
import Node from "./structures/Node";

export default class Graph {
    private _nodes: Node[] = [];
    private _adjList: Map<Node, Edge[]> = new Map();

    public constructor() { }

    public addNode(node: Node): void {
        this.nodes.push(node);
        this.adjList.set(node, []);
    }

    public addEdge(from: Node, to: Node): void {
        const edge = new Edge({ from, to, type: 'oriented' });
        this.adjList.get(from)?.push(edge);

        const reverse = new Edge({ from: to, to: from, type: 'oriented' });
        this.adjList.get(to)?.push(reverse);
    }

    public getNeighbors(node: Node): Edge[] {
        return this.adjList.get(node) || [];
    }

    loadFromJSON(json: any): void {
        this.nodes = [];
        this.adjList = new Map();

        const idToNode: Record<string, Node> = {};

        for (const n of json.nodes) {
            const node = new Node(n.id, n.x, n.y);
            this.addNode(node);
            idToNode[n.id] = node;
        }

        this.generateAllEdges();
    }

    public generateAllEdges(): void {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const a = this.nodes[i];
                const b = this.nodes[j];

                this.adjList.get(a)!.push(new Edge({ from: a, to: b, type: 'oriented' }));
                this.adjList.get(b)!.push(new Edge({ from: b, to: a, type: 'oriented' }));
            }
        }
    }

    public getEdge(node1: Node, node2: Node): Edge | null {
        const edgesFromNode1 = this.adjList.get(node1) || [];
        for (const edge of edgesFromNode1) {
            if (edge.to === node2) {
                return edge;
            }
        }
        return null;
    }

    public get nodes() {
        return this._nodes;
    }

    public set nodes(nodes: Node[]) {
        this._nodes = nodes;
    }

    public get adjList() {
        return this._adjList;
    }

    public set adjList(adjList: Map<Node, Edge[]>) {
        this._adjList = adjList;
    }
}