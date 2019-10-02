import { solveRange } from "./multithreadedSolver"
import { writeFileSync, readFileSync } from "fs";
import { Solution } from "../solver";
import * as ProgressBar from 'progress'
import { MaxLevels, LevelSequenceLength } from "../levels";
import { LevelTypes } from "../levelTypes";
import { chooseLevels } from "./levelChooser";


const numSequences = Math.ceil(MaxLevels / LevelSequenceLength);
const levelTypes = Object.values(LevelTypes);
const levelTypeNames: (keyof typeof LevelTypes)[] = Object.keys(LevelTypes) as any;
const levelsPerLevelType = Math.ceil(MaxLevels / levelTypes.length);
const skipSolver = true;

(async () => {
    const output = new Array<string>();

    for (let i = 0; i < levelTypes.length; ++i) {
        const location = `levels/${levelTypeNames[i]}.levels.json`;

        if (!skipSolver) {
            const data = await bulkSolve({ start: i, end: levelsPerLevelType * 10, type: levelTypeNames[i] });
            const json = formatJSONLevels(data, 0);

            console.log(`Writing results to levels.csv`);
            writeFileSync(location, json);
        }

        output.push(location);
    }

    const generatedLevels = new Map<keyof typeof LevelTypes, Array<number>>();;

    for (let i = 0; i < levelTypes.length; ++i) {
        //We do this serialize unserialize step to ensure intermediate data is backed up in case of failure.
        const levelData = output[i];
        const dataJSON = readFileSync(levelData, 'utf-8');
        const data = JSON.parse(dataJSON);
        const levels = chooseLevels(data);
        generatedLevels.set(levelTypeNames[i], levels);
    }

    let finalOutput = '';
    for (let i = 0; i < numSequences; ++i) {
        const type = levelTypeNames[i % levelTypeNames.length];
        const levels = generatedLevels.get(type)!.splice(0, LevelSequenceLength);
        finalOutput +=
            `{frequencies: "${type}", levels: ${JSON.stringify(levels)}}`
        if (i !== numSequences - 1) finalOutput += ',\n'
    }
    finalOutput = `levelSequences = [${finalOutput}]`;

    console.log("Writing generatedLevels.json");
    writeFileSync('../../libs/generatedLevels.js', finalOutput);

})()

async function bulkSolve(config: { start: number, end: number, type: keyof typeof LevelTypes }) {
    const start = config.start;
    const end = config.end;
    console.log(`Solving levels ${start} - ${end}`);
    const progressBar = new ProgressBar(':bar: :percent', { total: end });

    const data = await solveRange(start, end, config.type, () => {
        progressBar.tick();
    });

    return data;
}

function avg(population: Array<number>) {
    const sum = population.reduce((a, b) => a + b, 0);
    return sum / population.length;
}

function formatLevels(data: Array<Solution>, startLevel: number) {
    const rows = new Array<Array<number>>();
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
        rows.push(rowValues);
    }
    return rows;
}

function formatCSVLevels(data: Array<Solution>, startLevel: number) {
    let headers = `Level,Sucessful Strategies,Moves,Average Search Steps,Average Number of Solutions `
    const rows = formatLevels(data, startLevel);
    const csvRows = rows.map(row => row.join(','));
    return headers + '\n' + csvRows.join('\n');
}

function formatJSONLevels(data: Array<Solution>, startLevel: number) {
    const rows = formatLevels(data, startLevel);
    return JSON.stringify(rows);
}

/**Used for evaluating stategies.  */
// function formatCSVStratEval(data: Array<Solution>, startLevel: number) {
//     let headers = `Level,Solved,,`
//     strategyList
//         .map(set => set.name)
//         .forEach(name => {
//             //headers += `${name}-First Solve Step,${name}-Shortest,${name}-Total Steps,,`;
//             headers += `${name},`;
//         })

//     const rows = new Array<string>();
//     for (let i = 0; i < data.length; ++i) {
//         const solution = data[i];
//         let row = `${startLevel + i},${solution.solved},,`;
//         for (const run of solution.runs) {
//             row += `${run.shortestPathLength},`
//             //row += `${run.firstSolutionSteps},${run.shortestPathLength},${run.steps},,`
//         }
//         rows.push(row);
//     }

//     return headers + '\n' + rows.join('\n');
// }

