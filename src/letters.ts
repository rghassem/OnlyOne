import { Letter, getLetter } from "./board";
import { BoardEffect } from "./boardEffect";

type LetterEffect = (x: number, y: number) => Array<BoardEffect>;

export function onLetterPressed(x: number, y: number): Array<BoardEffect> {
    const letter = getLetter(x, y);
    switch (letter) {
        case Letter.L:
            break;
        case Letter.R:
            return letterR(x, y);
            break;
        case Letter.U:
            break;
        case Letter.D:
            break;
    }

    return [];
}

function letterR(x: number, y: number) {
    //Get characters to the right of me
    //Return a Destroy BoardEffect for each
    return [];
}