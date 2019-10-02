import { getLevel } from "../levels";
import { Solution } from "../solver";
import { Gameboard } from "../board";
import { Worker } from 'worker_threads';
import { LevelTypes } from "../levelTypes";

type ProgressCallback = (levelsCompleted: number) => void

const NumberOfThreads = 16;

let processedCount: number = 0;
let data: Array<Solution> = [];

export async function solveRange(start: number, end: number, levelType: keyof typeof LevelTypes, onProgress: ProgressCallback) {
    data = new Array<Solution>();
    processedCount = 0;
    const begin = process.hrtime();
    //Init worker queue
    const workerQueue = new Array<Worker>();
    for (let i = 0; i < NumberOfThreads; ++i) {
        workerQueue.push(new Worker('./out/src/levelGenerator/solverWorker.js'));
    }

    const working = new Array<Promise<Solution>>();
    for (let i = start; i < end; ++i) {
        const level = getLevel(i, LevelTypes[levelType]);
        working.push(solveWithWorkerQueue(level, workerQueue, onProgress));
    }
    await Promise.all(working);

    const finish = process.hrtime(begin);
    const time = finish[0] * 1000 + finish[1] / 1000000

    data.sort((a, b) => a.level - b.level);

    for (const worker of workerQueue) {
        worker.terminate();
    }

    console.log(`Finished, at: ${time}`);
    return data;
}

const workRequests = new Array<(worker: Worker) => void>();

async function solveWithWorkerQueue(level: Gameboard, workerQueue: Array<Worker>, updateDisplay: ProgressCallback) {

    function onWorkerDone(worker: Worker) {
        if (workRequests.length > 0) {
            const req = workRequests.pop()!
            req(worker);
        }
        else {
            workerQueue.push(worker);
        }
    }

    async function getWorker() {
        if (workerQueue.length > 0) {
            return workerQueue.pop()!;
        }
        else return new Promise<Worker>((resolve, reject) => {
            workRequests.push(worker => resolve(worker));
        });
    }
    const worker = await getWorker();
    return new Promise<Solution>((resolve, reject) => {
        worker.removeAllListeners();
        worker.on('message', (message: any) => {
            const solution = message as Solution;
            updateDisplay(++processedCount);
            onWorkerDone(worker);
            data.push(solution);
            resolve(solution);
        });
        worker.postMessage(level);
    });
}