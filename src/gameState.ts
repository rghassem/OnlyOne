import { BoardEffect, BoardEffectType, MoveEffect, TransformEffect, BasicBoardEffect } from "./boardEffect";
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
                result = result.concat(fall(effect.entity, effect.toY));
                break;

            case BoardEffectType.Move:
                if (effect.toX >= 0 && effect.toX < maxX && effect.toY >= 0 && effect.toY < maxY) {
                    queuedMoves.push({ entity: effect.entity, x: effect.toX, y: effect.toY });
                }
                break;

            case BoardEffectType.Transform:
                effect.entity.letter = effect.changeTo;
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

function fall(entity: LetterEntity, toY: number): BoardEffect[] {
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

function score(entity: LetterEntity): BoardEffect[] {
    firstLetterScored = firstLetterScored || entity.letter === Letter.First;
    secondLetterScored = secondLetterScored || entity.letter === Letter.Second;
    thirdLevelScored = thirdLevelScored || entity.letter === Letter.Third;
    const results: BasicBoardEffect[] = [
        {
            entity,
            effect: BoardEffectType.ScoreDestroy
        }
    ]
    return results;
}