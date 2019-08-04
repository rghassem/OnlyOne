import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";
import { getLetterEntity, Letter, maxX, maxY, removeLetterEntity, LetterEntity } from "./board";

export function updateState(changes: Array<BoardEffect>) {
    const gaps = new Array<{ x: number, y: number }>();
    for (const change of changes) {
        switch (change.effect) {
            case BoardEffectType.Destroy:
                gaps.push(change);
                destroy(change.x, change.y);
                break;

            case BoardEffectType.Fall:
                const fallEffect = change as MoveEffect;
                fall(fallEffect.x, fallEffect.y, fallEffect.toY);
                break;

            case BoardEffectType.Move:
                const e = change as MoveEffect;
                move(e.x, e.y, e.toX, e.toY);
                break;
        }
    }

    let result = fillGaps(gaps);
    return result;
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
    return [];
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