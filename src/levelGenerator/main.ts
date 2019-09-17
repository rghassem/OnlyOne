import { solveRange } from "./multithreadedSolver"
import { writeFileSync } from "fs";
import { Solution } from "../solver";
import { strategyList } from "../strategy";
import * as ProgressBar from 'progress'

const RangeStart = 0;
const RangeEnd = 200;

bulkSolve({ start: RangeStart, end: RangeEnd });

async function bulkSolve(config: { start: number, end: number }) {
    const start = config.start;
    const end = config.end;
    console.log(`Solving levels ${start} - ${end}`);
    const progressBar = new ProgressBar(':bar: :percent', { total: end });

    const data = await solveRange(start, end, () => {
        progressBar.tick();
    });

    console.log(`Writing results to levels.csv`);
    const csv = formatCSVLevels(data, 0);
    writeFileSync('levels.csv', csv);
}

export function formatCSVLevels(data: Array<Solution>, startLevel: number) {
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

export function formatCSVStratEval(data: Array<Solution>, startLevel: number) {
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