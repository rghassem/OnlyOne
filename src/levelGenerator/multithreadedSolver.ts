import { getLevel } from "../levels";
import { strategyList } from "../strategy";
import { Solution } from "../solver";
import { Gameboard } from "../board";

const NumberOfThreads = 12;

let processedCount: number = 0;
let data: Array<Solution> = [];
let display: HTMLDivElement;

export async function solveRange(start: number, end: number) {
    initDisplay();
    data = new Array<Solution>();
    processedCount = 0;
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
    await Promise.all(working);

    const finish = performance.now();
    data.sort((a, b) => a.level - b.level);
    console.log(`Finished, at: ${finish - begin}`);

    const csv = formatCSVLevels(data, start);
    download('levels.csv', csv);
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
            updateDisplay(++processedCount);
            onWorkerDone(worker);
            data.push(solution);
            resolve(solution);
        }
        worker.postMessage(level);
    });
}

function initDisplay() {
    display = document.createElement("div");
    display.setAttribute('style', 'position: absolute;font-size:20px;color:white;margin:auto');
    document.body.appendChild(display);
}

function updateDisplay(count: number) {
    if (display) {
        display.innerHTML = `${count}`
    }
}

function formatCSVLevels(data: Array<Solution>, startLevel: number) {
    let headers = `Level,Sucessful Strategies,Moves,Average Search Steps,Average Number of Solutions `

    const rows = new Array<string>();
    for (let i = 0; i < data.length; ++i) {
        const solution = data[i];
        if (solution.solved === false) continue;

        const winningRuns = solution.runs.filter(run => run.numberOfSolutions > 0);
        const avgSteps = avg(winningRuns.map(run => run.firstSolutionSteps));
        const avgNumSolution = avg(winningRuns.map(run => run.numberOfSolutions));
        let rowValues = [
            startLevel + i,
            solution.sucessfulStrategies.length,
            solution.shortestPathLength,
            avgSteps,
            avgNumSolution
        ]
        let row = rowValues.join(',');
        rows.push(row);
    }

    return headers + '\n' + rows.join('\n');
}

function avg(population: Array<number>) {
    const sum = population.reduce((a, b) => a + b, 0);
    return sum / population.length;
}

function formatCSVStratEval(data: Array<Solution>, startLevel: number) {
    let headers = `Level,Solved,,`
    strategyList
        .map(set => set.name)
        .forEach(name => {
            //headers += `${name}-First Solve Step,${name}-Shortest,${name}-Total Steps,,`;
            headers += `${name},`;
        })

    const rows = new Array<string>();
    for (let i = 0; i < data.length; ++i) {
        const solution = data[i];
        let row = `${startLevel + i},${solution.solved},,`;
        for (const run of solution.runs) {
            row += `${run.shortestPathLength},`
            //row += `${run.firstSolutionSteps},${run.shortestPathLength},${run.steps},,`
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