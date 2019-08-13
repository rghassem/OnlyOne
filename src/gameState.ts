import { BoardEffect, BoardEffectType, MoveEffect, ChangeEffect } from "./boardEffect";
import { getLetterEntity, Letter, maxX, maxY, removeLetterEntity, LetterEntity } from "./board";
import { fillGaps, Gap } from "./gapFill";

export let firstLetterScored = false;
export let secondLetterScored = false;
export let thirdLevelScored = false;

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

            case BoardEffectType.Transform:
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
    return firstLetterScored && secondLetterScored && thirdLevelScored;
}

export function resetScore() {
    firstLetterScored = false;
    secondLetterScored = false;
    thirdLevelScored = false;
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
    if (letter && hasReachedBottomRow(letter)) {
        return [
            {
                x: letter.x,
                y: letter.y,
                effect: BoardEffectType.Score
            }
        ];
    }
    return [];
}

function hasReachedBottomRow(letter: LetterEntity) {
    return (letter.letter === Letter.First || letter.letter === Letter.Second || letter.letter === Letter.Third) && letter.y === maxY - 1
}

function score(x: number, y: number) {
    const entity = getLetterEntity(x, y)!;
    firstLetterScored = firstLetterScored || entity.letter === Letter.First;
    secondLetterScored = secondLetterScored || entity.letter === Letter.Second;
    thirdLevelScored = thirdLevelScored || entity.letter === Letter.Third;
    const results = [
        {
            x,
            y,
            effect: BoardEffectType.ScoreDestroy
        }
    ]
    return results;
}