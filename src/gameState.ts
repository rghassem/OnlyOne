import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";
import { getLetterEntity, Letter, maxX, maxY, removeLetterEntity, LetterEntity, letterVisuals, resetBoard } from "./board";

export let letterOScored = false;
export let letterNScored = false;
export let letterEScored = false;


export function updateState(changes: Array<BoardEffect>) {
    let result = new Array<BoardEffect>();
    const gaps = new Array<{ x: number, y: number }>();
    for (let i = 0; i < changes.length; ++i) {
        const change = changes[i];
        switch (change.effect) {
            case BoardEffectType.Destroy:
            case BoardEffectType.ScoreDestroy:
                gaps.push(change);
                destroy(change.x, change.y);
                break;

            case BoardEffectType.Fall:
                const fallEffect = change as MoveEffect;
                console.log(`changes.length=${changes.length}`)
                result = result.concat(fall(fallEffect.x, fallEffect.y, fallEffect.toY));
                console.log(`changes.length=${changes.length}`)
                break;

            case BoardEffectType.Move:
                const e = change as MoveEffect;
                move(e.x, e.y, e.toX, e.toY);
                break;

            case BoardEffectType.Score:
                console.log("Score Event")
                result = result.concat(score(change.x, change.y));
                break;
        }
    }

    result = result.concat(fillGaps(gaps));
    return result;
}

export function checkWinAndResetOneScore() {
    if (letterOScored && letterNScored && letterEScored) {
        letterOScored = false;
        letterNScored = false;
        letterEScored = false;
        return true;
    }
    else return false;
}

function move(x: number, y: number, toX: number, toY: number) {
    if (toX >= 0 && toX < maxX && toY >= 0 && toY < maxY) {
        const letter = getLetterEntity(x, y);
        if (letter) {
            letter.x = toX;
            letter.y = toY;
        }
        console.log(`Setting letter at x=${toX} y=${toY} to ${letter}`)
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
        console.log("Score")
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

function fillGaps(gaps: Array<{ x: number, y: number }>) {
    let results = new Array<MoveEffect>();
    while (gaps.length > 0) {
        const gap = gaps.pop()!;
        const extended = gaps.filter(other => other.x === gap.x && other.y !== gap.y);
        extended.forEach(piece => gaps.splice(gaps.indexOf(piece), 1));
        const minY = extended.concat(gap).reduce((pieceA, pieceB) => pieceA.y > pieceB.y ? pieceA : pieceB);
        const coelescedGap = { x: gap.x, y: minY.y, distance: 1 + extended.length };
        results = results.concat(fillGap(coelescedGap));
    }
    return results;
}

function fillGap(gap: { x: number, y: number, distance: number }) {
    //Find nearest vertical neighbor
    const results = new Array<MoveEffect>();
    const nearestY = gap.y - gap.distance;
    for (let y = nearestY; y >= 0; --y) {
        const above = getLetterEntity(gap.x, y);
        if (above) {
            results.push({
                x: above.x, y: above.y,
                toX: gap.x, toY: above.y + gap.distance,
                effect: BoardEffectType.Fall
            });
        }
    }
    return results;
    //gap.x, y = (0 - gap.distance) will be empty, and will need gap.distance new letters
}