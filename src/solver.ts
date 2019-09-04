import { onLetterPressed } from "./letters";
import { updateState } from "./gameState";
import { LetterEntity, Letter } from "./letterEntity";
import { Gameboard, maxY, maxX } from "./board";
import { TypedPriorityQueue } from "../libs/TypedPriorityQueue";
import { getLevel } from "./levels";
import { Strategy, strategyList } from "./strategy";

const StepsPerRun = 250;

type Move = { x: number, y: number };
type Path = { moves: Array<Move>, score: number, state: Gameboard };

interface Run {
    strategy: string,
    steps: number,
    numberOfSolutions: number,
    firstSolutionTime: number,
    firstSolutionSteps: number,
    bestPath: Path,
    bestScore: number,
    shortestPathLength: number
}

interface Solution {
    solved: boolean
    runs: Run[]
    shortestPathLength: number,
    bestPath: Path,
}


export function solveMany(start: number, end: number) {
    const data = new Array<Solution>();
    for (let i = start; i < end; ++i) {
        const level = getLevel(i);
        const solution = solve(level);
        data.push(solution);
        console.count("Processed");
    }
    const csv = formatCSV(data, start);
    download('levels.csv', csv);
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

export function solve(board: Gameboard): Solution {

    let pathQueue: TypedPriorityQueue<Path>;

    let solved = false;
    let currentRun = 0;
    const runs = new Array<Run>();

    do {
        //start new run
        pathQueue = new TypedPriorityQueue<Path>(comparePathByScore);
        pathQueue.add({ moves: [], score: 0, state: board });
        const runWins = new Array<Path>();
        const runStart = performance.now();
        let runTime = 0;
        let steps = 0;
        let firstSolutionSteps = -1;
        let firstSolutionTime = 0;
        let runSolved = false;

        while (steps < StepsPerRun && !pathQueue.isEmpty()) {
            step(pathQueue.poll()!, strategyList[currentRun], runWins);
            ++steps;

            const end = performance.now();
            runTime = end - runStart;

            if (!runSolved && runWins.length > 0) {
                solved = true;
                runSolved = true;
                firstSolutionTime = runTime;
                firstSolutionSteps = steps;
            }
        }

        //Post-run
        const numberOfSolutions = runWins.length;
        let shortestPathLength;
        let bestPath: Path;
        if (runSolved) {
            bestPath = (runWins.length === 1)
                ? runWins.pop()!
                : runWins.reduce((a, b) => a.moves.length < b.moves.length ? a : b);
            shortestPathLength = bestPath.moves.length;
        }
        else {
            shortestPathLength = -1;
            bestPath = pathQueue.peek()!;
        }
        const bestScore = bestPath.score;

        runs.push({
            strategy: strategyList[currentRun].name,
            steps, numberOfSolutions,
            firstSolutionTime, firstSolutionSteps,
            bestPath, shortestPathLength, bestScore
        });
        currentRun++;

    } while (currentRun < strategyList.length && !pathQueue.isEmpty())

    const solvedRuns = runs.filter(run => run.numberOfSolutions > 0);
    let bestRun: Run;
    if (solvedRuns.length > 0) {
        bestRun = solvedRuns.reduce((a, b) => a.shortestPathLength < b.shortestPathLength ? a : b);
    }
    else {
        bestRun = runs.reduce((a, b) => a.bestScore > b.bestScore ? a : b);
    }

    return {
        solved,
        runs,
        shortestPathLength: bestRun.shortestPathLength,
        bestPath: bestRun.bestPath
    };

    function step(path: Path, weights: Strategy, wins: Array<Path>) {
        const availableMoves = getMoves(path.state);
        if (availableMoves.length === 0) { return }

        for (let i = 0; i < availableMoves.length; ++i) {
            let testBoard = path.state.clone();
            let testBoardMoves = getMoves(testBoard);
            const letter = testBoardMoves[i];
            testBoard = doMove(testBoard, letter);
            let score = evaluate(testBoard, path.moves.length, weights);
            if (score === -Infinity) continue; //Drop losing paths 
            let move = { x: letter.x, y: letter.y };
            const newPath = {
                moves: path.moves.concat(move),
                score: score,
                state: testBoard
            };
            if (score == Infinity) {
                wins.push(newPath);
            }
            else {
                pathQueue.add(newPath);
            }
        }
    }
}


function getMoves(board: Gameboard) {
    return board.entities.filter(entity => canClick(entity.letter));
}

function doMove(board: Gameboard, clickedEntity: LetterEntity) {
    let effects = onLetterPressed(board, clickedEntity);
    while (effects.length !== 0) {
        effects = updateState(board, effects);
    }
    return board; //transformed in updateState
}

function evaluate(board: Gameboard, moveCount: number, weights: Strategy): number {
    const scored = (board.firstLetterScored ? 1 : 0) + (board.secondLetterScored ? 1 : 0) + (board.thirdLetterScored ? 1 : 0);
    if (scored === 3) return Infinity; //Won

    const first = board.entities.find(state => state.letter === Letter.First);
    const second = board.entities.find(state => state.letter === Letter.Second);
    const third = board.entities.find(state => state.letter === Letter.Third);

    if ((!first && !board.firstLetterScored)
        || (!second && !board.secondLetterScored)
        || (!third && !board.thirdLetterScored)
    ) return -Infinity; //Lost

    const firstHeight = !first ? 0 : normalizedDistanceFromTop010(first.y);
    const secondHeight = !second ? 0 : normalizedDistanceFromTop010(second.y);
    const thirdHeight = !third ? 0 : normalizedDistanceFromTop010(third.y);

    const invisibles = board.entities.filter(state => state.letter === Letter.I).length;
    const invisiblesRemoved = (maxY * maxX) - invisibles;

    const scoreComponent = weights.score * scored;
    const heightComponent = weights.allLetter * (firstHeight + secondHeight + thirdHeight);
    const firstHeightComponent = weights.firstLetter * firstHeight;
    const secondHeightComponent = weights.secondLetter * secondHeight;
    const thirdHeightComponent = weights.thirdLetter * thirdHeight;
    const invisComponent = weights.invisibles * invisiblesRemoved;
    const letterCountComponent = weights.letterCount * board.entities.length;

    const pathLengthComponent = -0.01 * moveCount; //between two equal paths, the one with fewer steps is better

    return heightComponent + firstHeightComponent + secondHeightComponent + thirdHeightComponent +
        scoreComponent + invisComponent + pathLengthComponent + letterCountComponent;

    //distance from top (y) normalized and multiplied to 1-10 range
    function normalizedDistanceFromTop010(y: number) {
        const bottom = (maxY - 1);
        return (y / bottom) * 10
    }
}

function canClick(letter: Letter) {
    switch (letter) {
        case Letter.I:
        case Letter.First:
        case Letter.Second:
        case Letter.Third:
            return false;
        default:
            return true;
    }
}

function comparePathByScore(a: Path, b: Path) {
    return a.score > b.score;
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