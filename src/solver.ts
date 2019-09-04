import { getLevel } from "./levels";
import { strategyList } from "./strategy";
import { Solution } from "./solverWorker";
import { Gameboard } from "./board";

const NumberOfThreads = 24;

export async function solveMany(start: number, end: number) {
    const begin = performance.now();
    //Init worker queue
    const workerQueue = new Array<Worker>();
    for (let i = 0; i < NumberOfThreads; ++i) {
        workerQueue.push(new Worker('solverWorker.js'));
    }

    const working = new Array<Promise<Solution>>();
    for (let i = start; i < end; ++i) {
        const level = getLevel(i);
        working.push(solveWithWorkerQueue(level, workerQueue));
    }
    const data = await Promise.all(working);

    const finish = performance.now();
    data.sort((a, b) => a.level - b.level);
    console.log(`Finished, at: ${finish - begin}`);

    const csv = formatCSV(data, start);
    download('levels.csv', csv);
}

export async function solve(gameboard: Gameboard) {
    const worker = new Worker('solverWorker.js');
    const solution = await solveWithWorkerQueue(gameboard, [worker]);
    return solution;
}

export function printSolution(solution: Solution) {
    if (solution.solved) {
        console.log(`
        -------- Solved --------
            Shortest Path: ${solution.shortestPathLength}
            Solved Runs: ${solution.runs.filter(run => run.numberOfSolutions > 0).map(run => run.strategy)}
        ------------------------
        `);
    }
    else {
        console.log(`
        ------- Unsolved -------`)
    }
}

const workRequests = new Array<(worker: Worker) => void>();

async function solveWithWorkerQueue(level: Gameboard, workerQueue: Array<Worker>) {

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
        worker.onmessage = (message: any) => {
            const solution = message.data as Solution;
            console.count(`Processed ${level}`);
            onWorkerDone(worker);
            resolve(solution);
        }
        worker.postMessage(level);
    });
}

function formatCSV(data: Array<Solution>, startLevel: number) {
    let headers = `Level,Solved,,`
    strategyList
        .map(set => set.name)
        .forEach(name => {
            headers += `${name}-First Solve Step,${name}-Shortest,${name}-Total Steps,,`;
        })

    const rows = new Array<string>();
    for (let i = 0; i < data.length; ++i) {
        const solution = data[i];
        let row = `${startLevel + i},${solution.solved},,`;
        for (const run of solution.runs) {
            row += `${run.firstSolutionSteps},${run.shortestPathLength},${run.steps},,`
        }
        rows.push(row);
    }

    return headers + '\n' + rows.join('\n');
}

function download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}