import { Gameboard } from "../board";
import { solve } from "../solver";
import { parentPort, isMainThread } from "worker_threads";

if (!isMainThread && parentPort) {
    parentPort.on('message', (message) => {
        const board = message as Gameboard;
        Object.setPrototypeOf(board, Gameboard.prototype);
        const solution = solve(board);
        if (parentPort) parentPort.postMessage(solution);
    });
}
else {
    throw new Error("SolverWorker must be run in a nodejs worker");
}