import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";
import { getLetterEntity, Letter, maxX, maxY, removeLetterEntity } from "./board";
import { fillGaps, Gap } from "./gapFill";

export let letterOScored = false;
export let letterNScored = false;
export let letterEScored = false;



export function updateState(changes: Array<BoardEffect>) {
    let result = new Array<BoardEffect>();
    const gaps = new Array<Gap>();
    for (let i = 0; i < changes.length; ++i) {
        const change = changes[i];
        switch (change.effect) {
            case BoardEffectType.Destroy:
            case BoardEffectType.ScoreDestroy:
                gaps.push(new Gap(change.x, change.y));
                destroy(change.x, change.y);
                break;

            case BoardEffectType.Fall:
                const fallEffect = change as MoveEffect;
                result = result.concat(fall(fallEffect.x, fallEffect.y, fallEffect.toY));
                break;

            case BoardEffectType.Move:
                const e = change as MoveEffect;
                move(e.x, e.y, e.toX, e.toY);
                break;

            case BoardEffectType.Score:
                result = result.concat(score(change.x, change.y));
                break;
        }
    }

    //Process fall effects
    const fallEffects = fillGaps(gaps);
    result = result.concat(fallEffects);

    return result;
}

export function checkWin() {
    return letterOScored && letterNScored && letterEScored;
}

export function resetScore() {
    letterOScored = false;
    letterNScored = false;
    letterEScored = false;
}

function move(x: number, y: number, toX: number, toY: number) {
    if (toX >= 0 && toX < maxX && toY >= 0 && toY < maxY) {
        const letter = getLetterEntity(x, y);
        if (letter) {
            letter.x = toX;
            letter.y = toY;
        }
    }
    return [];
}

function destroy(x: number, y: number) {
    //Destroy the letter
    const entity = getLetterEntity(x, y);
    if (entity) {
        removeLetterEntity(entity);
    }
}

function fall(x: number, y: number, toY: number) {
    const letter = getLetterEntity(x, y);
    if (letter) {
        letter.x = x;
        letter.y = toY;
    }
    if (letter && (letter.letter === Letter.O || letter.letter === Letter.N || letter.letter === Letter.E) && toY === maxY - 1) {
        return [
            {
                x: letter.x,
                y: letter.y,
                effect: BoardEffectType.Score
            }
        ]
    }
    return [];
}

function score(x: number, y: number) {
    const entity = getLetterEntity(x, y)!;
    letterOScored = letterOScored || entity.letter === Letter.O;
    letterNScored = letterNScored || entity.letter === Letter.N;
    letterEScored = letterEScored || entity.letter === Letter.E;
    const results = [
        {
            x,
            y,
            effect: BoardEffectType.ScoreDestroy
        }
    ]
    if (letterOScored && letterNScored && letterEScored) {
        // results.push({
        //     x,
        //     y,
        //     effect: BoardEffectType.Victory
        // })
    }
    return results;
}