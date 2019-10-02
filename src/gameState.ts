import { BoardEffect, BoardEffectType, MoveEffect, TransformEffect, BasicBoardEffect } from "./boardEffect";
import { maxY, Gameboard } from "./board";
import { fillGaps, Gap } from "./gapFill";
import { LetterEntity, Letter } from "./letterEntity";
import { isOutOfBounds } from "./letters";

type QueuedMove = { entity: LetterEntity, x: number, y: number };

export function checkWin(gameboard: Gameboard) {
    return gameboard.firstLetterScored
        && gameboard.secondLetterScored
        && gameboard.thirdLetterScored;
}

export function checkLose(gameboard: Gameboard) {
    return gameboard.lost;
}

export function resetScore(gameboard: Gameboard) {
    gameboard.firstLetterScored = false;
    gameboard.secondLetterScored = false;
    gameboard.thirdLetterScored = false;
}

export function updateState(gameboard: Gameboard, changes: Array<BoardEffect>) {
    let result = new Array<BoardEffect>();

    //Seperate some operations from main loop.
    let gaps = new Array<Gap>();
    const possibleGaps = new Array<Gap>();
    const queuedMoves = new Array<QueuedMove>();

    for (let i = 0; i < changes.length; ++i) {
        const effect = changes[i];
        switch (effect.effect) {
            case BoardEffectType.Destroy:
                //Check lose condition before destroying
                const letter = effect.entity.letter;
                if (letter === Letter.First ||
                    letter === Letter.Second ||
                    letter === Letter.Third) {
                    gameboard.lost = true;
                }
            case BoardEffectType.ScoreDestroy:
                gaps.push(new Gap(effect.entity.x, effect.entity.y));
                destroy(effect.entity);
                break;

            case BoardEffectType.Fall:
                result = result.concat(fall(effect.entity, effect.toY));
                break;

            case BoardEffectType.Move:
                queuedMoves.push({ entity: effect.entity, x: effect.toX, y: effect.toY });
                //Mark places moved from as possibly now being a gap.
                possibleGaps.push(new Gap(effect.entity.x, effect.entity.y));
                //Also everything below destinations, because you could move over an empty column
                let y = effect.toY;
                const test = maxY;
                for (let i = y; i <= test; ++i) {
                    possibleGaps.push(new Gap(effect.toX, i));
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
    const outOfBoundsDestroys = new Array<BoardEffect>();
    queuedMoves.forEach(qm => move(qm, outOfBoundsDestroys));

    //Process fall effects (starting by removing non-gaps from the possible gap list)
    gaps = gaps.concat(possibleGaps.filter(gap => !gameboard.getLetterEntity(gap.x, gap.y)));
    const fallEffects = fillGaps(gameboard, gaps);
    result = result.concat(fallEffects).concat(outOfBoundsDestroys);

    return result;

    function move(queuedMove: QueuedMove, results: BoardEffect[] = []) {
        const entity = queuedMove.entity;
        entity.x = queuedMove.x;
        entity.y = queuedMove.y;
        if (isOutOfBounds(entity)) {
            results.push({ effect: BoardEffectType.Destroy, entity })
        }
        return results;
    }

    function destroy(entity: LetterEntity) {
        gameboard.removeLetterEntity(entity);
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