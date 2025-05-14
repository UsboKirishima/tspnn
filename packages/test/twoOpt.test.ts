import { expect } from "chai";
import Graph from "core/Graph";
import Node from "core/structures/Node";
import TSPSolver from "core/TSPSolver";

describe("twoOpt", () => {
    let graph: Graph;
    let solver: TSPSolver;

    beforeEach(() => {
        graph = new Graph();

        // Costruzione di 4 nodi che formano un quadrato (tour ottimo noto)
        const n1 = new Node("A", 0, 0);
        const n2 = new Node("B", 0, 1);
        const n3 = new Node("C", 1, 1);
        const n4 = new Node("D", 1, 0);

        graph.addNode(n1);
        graph.addNode(n2);
        graph.addNode(n3);
        graph.addNode(n4);

        graph.generateAllEdges(); // Completa il grafo

        solver = new TSPSolver(graph);
    });

    it("should return a valid TSP tour with 2-opt", () => {
        const tour = solver.twoOpt();
        const tourIds = tour.map(n => n.id);

        // Il tour deve tornare al nodo iniziale
        expect(tour[0]).to.equal(tour[tour.length - 1]);

        // Deve visitare tutti i nodi (escluso il ritorno)
        const uniqueIds = new Set(tourIds.slice(0, -1));
        expect(uniqueIds.size).to.equal(4);

        // Controllo che il tour non abbia duplicati intermedi
        const sortedIds = [...uniqueIds].sort();
        expect(sortedIds).to.deep.equal(["A", "B", "C", "D"].sort());
    });

});
