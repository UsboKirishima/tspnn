import { expect } from "chai";
import Graph from "core/Graph";
import Node from "core/structures/Node";
import Edge from "core/structures/Edge";

describe("Graph", () => {
    let graph: Graph;
    let node1: Node;
    let node2: Node;
    let node3: Node;

    beforeEach(() => {
        graph = new Graph();
        node1 = new Node("1", 0, 0);
        node2 = new Node("2", 1, 1);
        node3 = new Node("3", 2, 2);
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
    });

    describe("addNode", () => {
        it("should add a node to the graph", () => {
            expect(graph.nodes).to.include(node1);
            expect(graph.nodes).to.include(node2);
            expect(graph.nodes).to.include(node3);
        });
    });

    describe("addEdge", () => {
        it("should add an edge between two nodes", () => {
            graph.addEdge(node1, node2);
            const edge = graph.getEdge(node1, node2);
            expect(edge).to.not.be.null;
            expect(edge?.to).to.equal(node2);
        });

        it("should add bidirectional edges", () => {
            graph.addEdge(node1, node2);
            const edge1 = graph.getEdge(node1, node2);
            const edge2 = graph.getEdge(node2, node1);
            expect(edge1).to.not.be.null;
            expect(edge2).to.not.be.null;
            expect(edge1?.to).to.equal(node2);
            expect(edge2?.to).to.equal(node1);
        });
    });

    describe("getNeighbors", () => {
        it("should return the neighbors of a node", () => {
            graph.addEdge(node1, node2);
            const neighbors = graph.getNeighbors(node1);
            expect(neighbors).to.have.lengthOf(1);
            expect(neighbors[0].to).to.equal(node2);
        });

        it("should return an empty array if no neighbors exist", () => {
            const neighbors = graph.getNeighbors(node3);
            expect(neighbors).to.have.lengthOf(0);
        });
    });

});
