import Graph from "../Graph";
import { JsonFileAccess } from "../JsonFileAccess";
import { Node } from "../structures/Node";
import TSPSolver from "../TSPSolver";

async function main() {

    const file = __dirname + '/content.json';
    const graph = JsonFileAccess.loadGraph(file);
    
    const new_node = new Node("F", 10, 23);
    graph.addNode(new_node);
    graph.addEdge(graph.nodes[2], new_node)

    const solver = new TSPSolver(graph);
    const path = solver.nearestNeighbour();

    console.log("negro")
    path.forEach(async (node: Node) => {
        await console.log(`id: ${node.id} x: ${node.coordX} y: ${node.coordY}`);
    })

    console.log("Total distance: " + solver.distance);
    JsonFileAccess.saveGraph(graph, file);
}

(async () => await main())();