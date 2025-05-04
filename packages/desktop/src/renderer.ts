/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import Graph from 'core/Graph';
import './index.css';
import TSPSolver from 'core/TSPSolver';
import { Node } from 'core/structures/Node';


interface Point {
    id?: string;
    x: number;
    y: number;
}

interface CanvasOptions {
    connectPoints: boolean;
    fillShape: boolean;
    pointColor: string;
    lineColor: string;
}

const global = {
    graph: new Graph()
}

// Funzione principale per disegnare il canvas
function drawCanvas(): void {
    const canvas: HTMLCanvasElement | null = document.getElementById('pointCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    const pointsInput: string = (document.getElementById('coordinates') as HTMLTextAreaElement).value;

    const options: CanvasOptions = {
        connectPoints: false,
        fillShape: false,
        pointColor: '#f00',
        lineColor: '#00f'
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const points: Point[] = parseCoordinates(pointsInput);

    if (points.length === 0) {
        alert('No valid node found!');
        return;
    }

    global.graph.generateAllEdges();

    drawPointsWithIds(ctx, points, options);

    const tsp = new TSPSolver(global.graph);
    const nodes = tsp.nearestNeighbour(global.graph.nodes[0]);
    document.getElementById('distance').innerText = tsp.distance.toFixed(2);
    drawConnectedShape(ctx, nodes, options);
}

function parseCoordinates(input: string): Point[] {
    const lines: string[] = input.trim().split('\n');
    const points: Point[] = [];

    for (const line of lines) {
        const parts: string[] = line.trim().split(',');

        if (parts.length >= 2) {
            let id: string;
            let x: number;
            let y: number;


            if (parts.length === 3) {
                // Formato "id,x,y"
                id = parts[0].trim();
                x = parseFloat(parts[1]);
                y = parseFloat(parts[2]);
                global.graph.addNode(new Node(id, x, y));
            }

            if (!isNaN(x) && !isNaN(y)) {
                points.push({ id, x, y });
            }
        }
    }

    return points;
}

function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number,
    toX: number, toY: number, arrowSize: number): void {

    ctx.fillStyle = '#00f';
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.fillStyle = '#0f0';

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6),
        toY - arrowSize * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6),
        toY - arrowSize * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

// Disegna i punti collegati
function drawConnectedShape(ctx: CanvasRenderingContext2D, nodes: Node[], options: CanvasOptions): void {
    
    if (nodes.length >= 2) {
        ctx.strokeStyle = options.lineColor;
        ctx.fillStyle = options.lineColor;
        ctx.lineWidth = 2;

        for (let i = 0; i < nodes.length - 1; i++) {
            drawArrow(ctx, nodes[i].coordX, nodes[i].coordY,
                nodes[i + 1].coordX, nodes[i + 1].coordY,
                13);
        }

        if (options.fillShape && nodes.length > 2) {
            drawArrow(ctx, nodes[nodes.length - 1].coordX, nodes[nodes.length - 1].coordY,
                nodes[0].coordX, nodes[0].coordY, 13);
        }
    } else {
        ctx.beginPath();
        ctx.moveTo(nodes[0].coordX, nodes[0].coordY);

        for (let i = 1; i < nodes.length; i++) {
            ctx.lineTo(nodes[i].coordX, nodes[i].coordY);
        }

        if (options.fillShape && nodes.length > 2) {
            ctx.closePath();
            ctx.fillStyle = options.lineColor;
            ctx.fill();
        }

        ctx.strokeStyle = options.lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Disegna i punti e i loro ID
function drawPointsWithIds(ctx: CanvasRenderingContext2D, points: Point[], options: CanvasOptions): void {
    for (let i = 0; i < points.length; i++) {
        const point = points[i];

        // Disegna il punto
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = options.pointColor;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Disegna l'ID del punto
        ctx.font = '12px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(point.id || (i + 1).toString(), point.x, point.y - 10);
    }
}

// Imposta gli event listener
document.addEventListener('DOMContentLoaded', () => {
    const drawButton = document.getElementById('drawButton');

    if (drawButton) {
        drawButton.addEventListener('click', drawCanvas);
    }

    // Disegna il canvas con i valori predefiniti all'avvio
    drawCanvas();
});