import { BoardEffect, BoardEffectType } from "./boardEffect";
import { getLetter, setLetter, Letter } from "./board";

export function updateState(changes: Array<BoardEffect>) {
    const result = new Array<BoardEffect>();

    for (const change of changes) {
        switch (change.effect) {
            case BoardEffectType.Destroy:
                result.concat(destroy(change.x, change.y));
                break;

            case BoardEffectType.Fall:
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
    for (let i = 0; i < y; ++i) {
        result.push({
            x: x,
            y: i,
            effect: BoardEffectType.Fall
        });
    }
    return result;
}