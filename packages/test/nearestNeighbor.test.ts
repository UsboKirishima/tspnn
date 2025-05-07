import { expect } from "chai";

import Graph from "core/Graph";
import TSPSolver from "core/TSPSolver";
import Node from "core/structures/Node";

describe('NearestNeighbor Algorithm', () => {
    it('should find the nearest point', () => {
        const graph = new Graph();
        const startNode = new Node('A', 0, 0);
        
        graph.addNode(startNode);
        graph.addNode(new Node('B', 2, 4));
        graph.addNode(new Node('C', 3, 1));
        graph.addNode(new Node('D', 5, 2));
        graph.addNode(new Node('E', 6, 5));

        graph.generateAllEdges();
        const nn = new TSPSolver(graph);

        const path = nn.nearestNeighbour(startNode);
        const ids = path.map(n => n.id).join("-");

        const expectedPath = 'A-C-D-E-B-A';
        expect(ids).to.equal(expectedPath);
    });

    it('returns empty array if no points', () => {
        const graph = new Graph();
        const nn = new TSPSolver(graph);

        expect(nn.nearestNeighbour()).to.deep.equal([]);
    });

    it('if start node is not specified use the node with index 0', () => {
        const graph = new Graph();
        const nn = new TSPSolver(graph);

        graph.addNode(new Node('1', -2, -4));
        graph.addNode(new Node('A', 0, 0));
        graph.addNode(new Node('B', 2, 4));
        graph.addNode(new Node('C', 3, 1));
        graph.addNode(new Node('D', 5, 2));
        graph.addNode(new Node('E', 6, 5));

        expect(nn.nearestNeighbour()[0].id).to.deep.equal('1');
    });

    it("should return the only point if there is just one point", () => {
        const graph = new Graph();
        const nn = new TSPSolver(graph);

        const node = new Node('one', -2, -Infinity)
        graph.addNode(node);

        expect(nn.nearestNeighbour()[0]).to.deep.equal(node);
    })
});
