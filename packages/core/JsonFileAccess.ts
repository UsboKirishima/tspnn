import { Edge } from "./structures/Edge";
import { Node } from "./structures/Node";
import Graph from "./Graph";
import * as fs from 'fs';

export class JsonFileAccess {
    static saveGraph(graph: Graph, path: string): void {
        const json = {
            nodes: graph.nodes.map(n => ({
                id: n.id,
                x: n.coordX,
                y: n.coordY
            })),
            edges: Array.from(graph.adjList.entries()).flatMap(([from, edges]) =>
                edges.map(e => ({
                    from: e.from.id,
                    to: e.to.id
                }))
            )
        };

        fs.writeFileSync(path, JSON.stringify(json, null, 2), 'utf-8');
    }

    static loadGraph(path: string): Graph {
        const data = fs.readFileSync(path, 'utf-8');
        const json = JSON.parse(data);

        const graph = new Graph();
        graph.loadFromJSON(json);
        return graph;
    }
}