import { BoardEffect, BoardEffectType } from "./boardEffect";
import { getLetter, setLetter, Letter, randomLetter, rows } from "./board";

export function updateState(changes: Array<BoardEffect>) {
    let result = new Array<BoardEffect>();

    for (const change of changes) {
        switch (change.effect) {
            case BoardEffectType.Destroy:
                result = result.concat(destroy(change.x, change.y));
                break;

            case BoardEffectType.Fall:
                result = result.concat(fall(change.x, change.y));
                break;
        }
    }
    return result;
}

function destroy(x: number, y: number) {
    //Destroy the letter
    setLetter(x, y, Letter.Blank);

    //Everything above it falls
    const result = new Array<BoardEffect>();
    for (let i = y - 1; i > 0; --i) {
        result.push({
            x: x,
            y: i,
            effect: BoardEffectType.Fall
        });
    }
    return result;
}

function fall(x: number, y: number) {
    const letter = getLetter(x, y);
    setLetter(x, y + 1, letter);
    return [];
}