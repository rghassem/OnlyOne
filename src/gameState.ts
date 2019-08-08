import { BoardEffect, BoardEffectType, MoveEffect, ChangeEffect } from "./boardEffect";
import { getLetterEntity, Letter, maxX, maxY, removeLetterEntity, LetterEntity } from "./board";
import { fillGaps, Gap } from "./gapFill";

export let letterOScored = false;
export let letterNScored = false;
export let letterEScored = false;

type QueuedMove = { letter: LetterEntity, x: number, y: number };

export function updateState(changes: Array<BoardEffect>) {
    let result = new Array<BoardEffect>();

    //Seperate some operations from main loop.
    const gaps = new Array<Gap>();
    const queuedMoves = new Array<QueuedMove>();

    for (let i = 0; i < changes.length; ++i) {
        const effect = changes[i];
        switch (effect.effect) {
            case BoardEffectType.Destroy:
            case BoardEffectType.ScoreDestroy:
                gaps.push(new Gap(effect.x, effect.y));
                destroy(effect.x, effect.y);
                break;

            case BoardEffectType.Fall:
                const fallEffect = effect as MoveEffect;
                result = result.concat(fall(fallEffect.x, fallEffect.y, fallEffect.toY));
                break;

            case BoardEffectType.Move:
                const e = effect as MoveEffect;
                if (e.toX >= 0 && e.toX < maxX && e.toY >= 0 && e.toY < maxY) {
                    const letter = getLetterEntity(effect.x, effect.y);
                    if (letter) {
                        queuedMoves.push({ letter, x: e.toX, y: e.toY });
                    }
                }
                break;

            case BoardEffectType.Change:
                const changeEffect = effect as ChangeEffect;
                const target = getLetterEntity(changeEffect.x, changeEffect.y);
                if (target) {
                    target.letter = changeEffect.changeTo;
                }
                break;

            case BoardEffectType.Score:
                result = result.concat(score(effect.x, effect.y));
                break;
        }
    }

    //Finalize all moves
    queuedMoves.forEach(qm => move(qm));

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

function move(queuedMove: QueuedMove) {
    queuedMove.letter.x = queuedMove.x;
    queuedMove.letter.y = queuedMove.y;
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