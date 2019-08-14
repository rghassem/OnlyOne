import { BoardEffect, BoardEffectType, MoveEffect, ChangeEffect } from "./boardEffect";
import { getLetterEntity, Letter, maxX, maxY, removeLetterEntity, LetterEntity } from "./board";
import { fillGaps, Gap } from "./gapFill";

export let firstLetterScored = false;
export let secondLetterScored = false;
export let thirdLevelScored = false;

type QueuedMove = { entity: LetterEntity, x: number, y: number };

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
                gaps.push(new Gap(effect.entity.x, effect.entity.y));
                destroy(effect.entity);
                break;

            case BoardEffectType.Fall:
                const fallEffect = effect as MoveEffect;
                result = result.concat(fall(effect.entity, fallEffect.toY));
                break;

            case BoardEffectType.Move:
                const e = effect as MoveEffect;
                if (e.toX >= 0 && e.toX < maxX && e.toY >= 0 && e.toY < maxY) {
                    queuedMoves.push({ entity: effect.entity, x: e.toX, y: e.toY });
                }
                break;

            case BoardEffectType.Transform:
                const changeEffect = effect as ChangeEffect;
                changeEffect.entity.letter = changeEffect.changeTo;
                break;

            case BoardEffectType.Score:
                result = result.concat(score(effect.entity));
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
    queuedMove.entity.x = queuedMove.x;
    queuedMove.entity.y = queuedMove.y;
}

function destroy(entity: LetterEntity) {
    //Destroy the letter
    removeLetterEntity(entity);
}

function fall(entity: LetterEntity, toY: number) {
    entity.y = toY;
    if (hasReachedBottomRow(entity)) {
        return [
            {
                entity,
                effect: BoardEffectType.Score
            }
        ];
    }
    return [];
}

function hasReachedBottomRow(letter: LetterEntity) {
    return (letter.letter === Letter.First || letter.letter === Letter.Second || letter.letter === Letter.Third) && letter.y === maxY - 1
}

function score(entity: LetterEntity) {
    firstLetterScored = firstLetterScored || entity.letter === Letter.First;
    secondLetterScored = secondLetterScored || entity.letter === Letter.Second;
    thirdLevelScored = thirdLevelScored || entity.letter === Letter.Third;
    const results = [
        {
            entity,
            effect: BoardEffectType.ScoreDestroy
        }
    ]
    return results;
}