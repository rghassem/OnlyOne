import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";
import { getLetter, setLetter, Letter, cols, rows } from "./board";

export function updateState(changes: Array<BoardEffect>) {
    let result = new Array<BoardEffect>();

    for (const change of changes) {
        switch (change.effect) {
            case BoardEffectType.Destroy:
                result = result.concat(destroy(change.x, change.y));
                break;

            case BoardEffectType.Fall:
                break;
            
            case BoardEffectType.Move:
                const e = change as MoveEffect;
                move(e.x, e.y, e.toX, e.toY);
                break;
        }
    }
    return result;
}

function move(x: number, y: number, toX: number, toY: number) {
    if (toX >= 0 && toX < cols && toY >= 0 && toY > rows) {
        const letter = getLetter(x, y);
        setLetter(toX, toY, letter);
        console.log(`Setting letter at x=${toX} y=${toY} to ${letter}`)
    }
    return [];
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