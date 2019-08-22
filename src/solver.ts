import { onLetterPressed } from "./letters";
import { updateState } from "./gameState";
import { LetterEntity, Letter, letterVisuals } from "./letterEntity";
import { Gameboard } from "./board";

type Move = { moveIndex: number, resultingBoard: Gameboard, score: number };

function solve(board: Gameboard) {
    let moves = new Array<Move>();
    // while (moves[moves.length - 1])
    //     moves = moves.concat(minimax(board, 0, []));
}

export function minimax(board: Gameboard, depth: number, movesSoFar: Array<Move>) {
    const moves = getMoves(board);
    let options: Array<Move> = [];
    for (let i = 0; i < moves.length; ++i) {
        let testBoard = copyBoard(board);
        let testBoardMoves = getMoves(testBoard);
        const move = testBoardMoves[i];
        logMove(move);
        testBoard = doMove(testBoard, move);
        let score = evaluate(testBoard);
        //score += minimax(nextBoard, depth - 1);
        options.push({ moveIndex: i, resultingBoard: testBoard, score });
    }
    const best = options.reduce((a, b) => a.score < b.score ? a : b);
    const move = moves[best.moveIndex];
    return [move];
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

//Smaller number better
function evaluate(board: Gameboard): number {
    const scored = (board.firstLetterScored ? 1 : 0) + (board.secondLetterScored ? 1 : 0) + (board.thirdLetterScored ? 1 : 0);
    if (scored === 3) return -Infinity;
    const points = board.filter(state => state.letter === Letter.First || state.letter === Letter.Second || state.letter === Letter.Third);
    if (points.length < 3 - scored) return Infinity;
    const heights = points
        .map(point => point.y)
        .reduce((y1, y2) => y1 + y2, points[0].y);

    return heights - (100 * scored);
}

function canClick(letter: Letter) {
    switch (letter) {
        case Letter.I:
            return false;
        default:
            return true;
    }
}

function copyBoard(board: Gameboard) {
    const copy: any = board.map(entity => new LetterEntity(entity.letter, entity.x, entity.y));
    copy.firstLetterScored = board.firstLetterScored;
    copy.secondLetterScored = board.firstLetterScored;
    copy.thirdLetterScored = board.firstLetterScored;
    return copy as Gameboard;
}

function logMove(move: LetterEntity) {
    const letter = letterVisuals.get(move.letter)!;
    console.log(`Test move: Letter: ${letter.char} (${move.x}, ${move.y})`);
}