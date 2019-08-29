import { onLetterPressed } from "./letters";
import { updateState } from "./gameState";
import { LetterEntity, Letter } from "./letterEntity";
import { Gameboard, maxY, maxX } from "./board";
import { TypedPriorityQueue } from "../libs/TypedPriorityQueue";

const DecisionBudgetMS = 1 * 1000; //ms

type Move = { x: number, y: number };
type Path = { moves: Array<Move>, score: number, state: Gameboard };

export function solve(board: Gameboard) {

    const pathQueue = new TypedPriorityQueue<Path>(comparePathByScore);
    const winningPaths = new Array<Path>();
    pathQueue.add({ moves: [], score: 0, state: board });
    let remainingBudget = DecisionBudgetMS;

    const start = performance.now();

    //For logging
    let solved = false;
    let steps = 0;
    let bigSteps = 0;

    while (remainingBudget > 0 && !pathQueue.isEmpty()) {
        step(pathQueue.poll()!);
        ++steps;

        const end = performance.now();
        const time = end - start;
        remainingBudget = DecisionBudgetMS - time;

        //Logging
        if (!solved && winningPaths.length > 0) {
            solved = true;
            console.log(`First solution at: ${DecisionBudgetMS - remainingBudget}ms`);
        }

        if (DecisionBudgetMS - remainingBudget > bigSteps * 1000) {
            console.log(`Steps: ${steps} at ${DecisionBudgetMS - remainingBudget}`);
            ++bigSteps;
        }
    }

    console.log(`Solver complete, total time ${DecisionBudgetMS - remainingBudget}`);
    console.log(`Steps considered ${steps}`);
    console.log(`Solutions: ${winningPaths.length}`);

    if (winningPaths.length > 0) {
        if (winningPaths.length === 1) return { solved: true, solution: winningPaths.pop()! };
        const best = winningPaths.reduce((a, b) => a.moves.length < b.moves.length ? a : b);
        console.log(`Shortest path length: ${best.moves.length}`);
        return { solved: true, solution: best };
    }
    else {
        const best = pathQueue.peek()!;
        console.log(`No solution found`);
        return { solved: false, solution: best };
    }

    function step(path: Path) {
        const availableMoves = getMoves(path.state);
        if (availableMoves.length === 0) { return }

        for (let i = 0; i < availableMoves.length; ++i) {
            let testBoard = path.state.clone();
            let testBoardMoves = getMoves(testBoard);
            const letter = testBoardMoves[i];
            testBoard = doMove(testBoard, letter);
            let score = evaluate(testBoard, path.moves.length);
            if (score === -Infinity) continue; //Drop losing paths 
            let move = { x: letter.x, y: letter.y };
            const newPath = {
                moves: path.moves.concat(move),
                score: score,
                state: testBoard
            };
            if (score == Infinity) {
                winningPaths.push(newPath);
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

function evaluate(board: Gameboard, moveCount: number): number {
    const scored = (board.firstLetterScored ? 1 : 0) + (board.secondLetterScored ? 1 : 0) + (board.thirdLetterScored ? 1 : 0);
    if (scored === 3) return Infinity; //Won
    const points = board.entities.filter(state => state.letter === Letter.First || state.letter === Letter.Second || state.letter === Letter.Third);

    const invisibles = board.entities.filter(state => state.letter === Letter.I).length;
    const invisiblesRemoved = (maxY * maxX) - invisibles;

    if (points.length === 0) return -Infinity; //Lost
    const heights = points.map(point => normalizedDistanceFromTop010(point.y));

    const scoreComponent = 100 * scored;
    const heightComponent = heights.length > 1 ? heights.reduce((y1, y2) => y1 + y2) : normalizedDistanceFromTop010(points[0].y);
    const invisComponent = 0.1 * invisiblesRemoved;
    const pathLengthComponent = -0.01 * moveCount; //between two equal paths, the one with fewer steps is better

    return heightComponent + scoreComponent + invisComponent + pathLengthComponent;

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