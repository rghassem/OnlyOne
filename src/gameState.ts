import { BoardEffect, BoardEffectType, MoveEffect, TransformEffect, BasicBoardEffect } from "./boardEffect";
import { getLetterEntity, maxX, maxY, removeLetterEntity, Gameboard } from "./board";
import { fillGaps, Gap } from "./gapFill";
import { LetterEntity, Letter } from "./letterEntity";

type QueuedMove = { entity: LetterEntity, x: number, y: number };

export function checkWin(gameboard: Gameboard) {
    return gameboard.firstLetterScored
        && gameboard.secondLetterScored
        && gameboard.thirdLetterScored;
}

export function resetScore(gameboard: Gameboard) {
    gameboard.firstLetterScored = false;
    gameboard.secondLetterScored = false;
    gameboard.thirdLetterScored = false;
}

export function updateState(gameboard: Gameboard, changes: Array<BoardEffect>) {
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
                result = result.concat(score(gameboard, effect.entity));
                break;
        }
    }

    //Finalize all moves
    queuedMoves.forEach(qm => move(qm));

    //Process fall effects
    const fallEffects = fillGaps(gameboard, gaps);
    result = result.concat(fallEffects);

    return result;

    function move(queuedMove: QueuedMove) {
        queuedMove.entity.x = queuedMove.x;
        queuedMove.entity.y = queuedMove.y;
    }

    function destroy(entity: LetterEntity) {
        //Destroy the letter
        removeLetterEntity(gameboard, entity);
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

    function score(gameboard: Gameboard, entity: LetterEntity): BoardEffect[] {
        gameboard.firstLetterScored = gameboard.firstLetterScored || entity.letter === Letter.First;
        gameboard.secondLetterScored = gameboard.secondLetterScored || entity.letter === Letter.Second;
        gameboard.thirdLetterScored = gameboard.thirdLetterScored || entity.letter === Letter.Third;
        const results: BasicBoardEffect[] = [
            {
                entity,
                effect: BoardEffectType.ScoreDestroy
            }
        ]
        return results;
    }

}