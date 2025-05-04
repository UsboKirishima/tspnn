import { Node } from "./Node";

export class Edge {
    private _from: Node;
    private _to: Node;

    public constructor(from: Node, to: Node) {
        this._from = from;
        this._to = to;
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
            this.to.coordX - this.from.coordX,
            this.to.coordY - this.from.coordY
        );
    }

    public get from() {
        return this._from;
    }

    public get to() {
        return this._to;
    }
}