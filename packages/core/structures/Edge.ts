import Node from "./Node";

interface OrientedEdge {
    type: 'oriented';
    from: Node;
    to: Node;
}

interface UnorientedEdge {
    type: 'unoriented',
    node1: Node;
    node2: Node;
}

type EdgeOrientation = 'oriented' | 'unoriented';

export default class Edge {
    private _from?: Node;
    private _to?: Node;

    private _node1: Node;
    private _node2: Node;

    private readonly _type: EdgeOrientation;

    /**
     * Edge constructor accepts (from, to, type) if
     * the edge is oriented, otherwise accepts
     * (node1, node2, type) for unoriented edges.
     * @param endpoints OrientedEdge | UnorientedEdge
     */
    public constructor(endpoints: OrientedEdge | UnorientedEdge) {
        this._type = endpoints.type;

        if (endpoints.type === 'oriented') {
            this._from = endpoints.from;
            this._to = endpoints.to;

            this._node1 = this._from;
            this._node2 = this._to;
        } else {
            this._node1 = endpoints.node1;
            this._node2 = endpoints.node2;
        }
    }

    /**
     * Calculates the Euclidean distance between two points
     *
     * Uses the formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]
     * 
     * @example 
     *  For points A(3,4) and B(6,8):
     *  distance = √[(6-3)² + (8-4)²] = √[9 + 16] = √25 = 5
     * 
     * @returns {number} The Euclidean distance between the source and destination points
     */
    public weight(): number {
        return Math.hypot(
            this._node2.coordX - this._node1.coordX,
            this._node2.coordY - this._node1.coordY
        );
    }

    public get type(): EdgeOrientation {
        return this._type;
    }

    public get from(): Node | undefined {
        return this._from;
    }

    public get to(): Node | undefined {
        return this._to;
    }

    public get endpoints(): [Node, Node] {
        return [this._node1, this._node2];
    }

    public isOriented(): boolean {
        return this._type === "oriented";
    }
}