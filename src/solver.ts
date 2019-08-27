import { onLetterPressed } from "./letters";
import { updateState } from "./gameState";
import { LetterEntity, Letter, letterVisuals } from "./letterEntity";
import { Gameboard, maxY, maxX } from "./board";

const LookAhead = 3;

type Move = { moves: Array<{ x: number, y: number }>, score: number };

function solve(board: Gameboard) {
    let moves = new Array<Move>();
    // while (moves[moves.length - 1])
    //     moves = moves.concat(minimax(board, 0, []));
}

export function minimax(board: Gameboard, depth: number) {
    const moves = getMoves(board);
    let options: Array<Move> = [];
    for (let i = 0; i < moves.length; ++i) {
        let testBoard = copyBoard(board);
        let testBoardMoves = getMoves(testBoard);
        const move = testBoardMoves[i];
        //logMove(move);
        testBoard = doMove(testBoard, move);
        let score = evaluate(testBoard);
        let moves = [{ x: move.x, y: move.y }];
        if (depth < LookAhead - 1) {
            testBoard.splice(i, 1);
            const { moves: lookaheadMoves, score: lookaheadScore } = minimax(testBoard, depth + 1);
            moves.push(...lookaheadMoves);
            score += lookaheadScore;
        }
        options.push({ moves, score });
    }
    const best = options.reduce((a, b) => a.score > b.score ? a : b);
    if (best.score === -Infinity) {
        return { moves: [], score: -Infinity };
    }
    return { moves: best.moves, score: best.score };
}

function getMoves(board: Gameboard) {
    return board.filter(entity => canClick(entity.letter));
}

function doMove(board: Gameboard, clickedEntity: LetterEntity) {
    let effects = onLetterPressed(board, clickedEntity);
    while (effects.length !== 0) {
        effects = updateState(board, effects);
    }
    return board; //transformed in updateState
}

function evaluate(board: Gameboard): number {
    const scored = (board.firstLetterScored ? 1 : 0) + (board.secondLetterScored ? 1 : 0) + (board.thirdLetterScored ? 1 : 0);
    if (scored === 3) return Infinity; //Won
    const points = board.filter(state => state.letter === Letter.First || state.letter === Letter.Second || state.letter === Letter.Third);

    const invisibles = board.filter(state => state.letter === Letter.I).length;
    const invisiblesRemoved = (maxY * maxX) - invisibles;

    if (points.length === 0) return -Infinity; //Lost
    const heights = points.map(point => normalizedDistanceFromTop010(point.y));

    const heightComponent = heights.length > 1 ? heights.reduce((y1, y2) => y1 + y2) : normalizedDistanceFromTop010(points[0].y);
    const scoreComponent = 100 * scored;
    const invisComponent = 0.1 * invisiblesRemoved;

    return heightComponent + scoreComponent + invisComponent;

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

function copyBoard(board: Gameboard) {
    const copy: any = board.map(entity => new LetterEntity(entity.letter, entity.x, entity.y));
    copy.firstLetterScored = board.firstLetterScored;
    copy.secondLetterScored = board.secondLetterScored;
    copy.thirdLetterScored = board.thirdLetterScored;
    return copy as Gameboard;
}

function logMove(move: LetterEntity) {
    const letter = letterVisuals.get(move.letter)!;
    console.log(`Test move: Letter: ${letter.char} (${move.x}, ${move.y})`);
}