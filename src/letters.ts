import { maxY, maxX, Gameboard } from "./board";
import { BoardEffect, BoardEffectType, MoveEffect, TransformEffect } from "./boardEffect";
import { Letter, LetterEntity } from "./letterEntity";

type Position = {
    x: number,
    y: number
};

enum EffectOutcome {
    Destroy,
    Prevent,
    Chain
}

const chainingLetters = [
    Letter.C,
    Letter.X,
    Letter.Y
];

export function isBomb(letter: Letter) {
    return letter === Letter.C || letter === Letter.X || letter === Letter.Y;
}

const processedLetters = new Set<string>();

export function onLetterPressed(gameboard: Gameboard, entity: LetterEntity): Array<BoardEffect> {
    const effects: Array<BoardEffect> = [];
    doLetterEffect(gameboard, entity, effects);
    processedLetters.clear();
    return effects;
}

function attemptDestroy(entity: LetterEntity) {
    if (entity.letter === Letter.W) {
        return EffectOutcome.Prevent;
    } else if (chainingLetters.indexOf(entity.letter) > -1) {
        return EffectOutcome.Chain;
    } else {
        return EffectOutcome.Destroy;
    }
}

function filterValidLetters(board: Gameboard, positions: Array<Position>, prevent: boolean) {
    const letters = [];
    for (let position of positions) {
        const entity = board.getLetterEntity(position.x, position.y);
        if (entity) {
            const entityId = `${entity.x}_${entity.y}`;
            if (!processedLetters.has(entityId)) {
                processedLetters.add(entityId);
                letters.push(entity);
                if (prevent && entity.letter === Letter.W) {
                    break;
                }
            }
        }
    }
    return letters;
}

function destroyLetters(board: Gameboard, letters: Array<LetterEntity>, effects: Array<BoardEffect>) {
    for (let letter of letters) {
        const outcome = attemptDestroy(letter);
        if (outcome === EffectOutcome.Prevent) {
            effects.push({
                entity: letter,
                effect: BoardEffectType.BlockDestruction
            });
        } else if (outcome === EffectOutcome.Destroy) {
            effects.push({
                entity: letter,
                effect: BoardEffectType.Destroy
            });
        } else if (outcome === EffectOutcome.Chain) {
            effects.push({
                entity: letter,
                effect: BoardEffectType.Explode
            });
            doLetterEffect(board, letter, effects);
            effects.push({
                entity: letter,
                effect: BoardEffectType.Destroy
            });
        }
    }
}

export function doLetterEffect(board: Gameboard, entity: LetterEntity | undefined, effects: Array<BoardEffect>) {
    if (!entity) return;
    switch (entity.letter) {
        case Letter.L:
            return left(entity, effects);
        case Letter.R:
            return right(entity, effects);
        case Letter.U:
            return up(entity, effects);
        case Letter.D:
            return down(entity, effects);
        case Letter.I:
            return prevent(entity, effects);
        case Letter.O:
        case Letter.N:
        case Letter.E:
            return [];
        case Letter.C:
            return cross(entity, effects);
        case Letter.T:
            const rotation: BoardEffect[] = rotateAround(entity);
            const changeSelf: TransformEffect = {
                entity,
                effect: BoardEffectType.Transform,
                changeTo: Letter.I
            };
            effects.push(...rotation.concat(changeSelf));
            return effects;
        case Letter.Y:
            return ybomb(entity, effects);
        case Letter.X:
            return diagonal(entity, effects);
        default:
            return itself(entity, effects);
    }

    function itself(entity: LetterEntity, effects: Array<BoardEffect>) {
        effects.push({
            entity,
            effect: BoardEffectType.Destroy
        });
        return effects;
    }

    function prevent(entity: LetterEntity, effects: Array<BoardEffect>) {
        effects.push({
            entity,
            effect: BoardEffectType.BlockDestruction
        });
        return effects;
    }

    function ybomb(entity: LetterEntity, effects: Array<BoardEffect>) {
        const patterns = [
            {
                x: entity.x,
                y: entity.y
            },
            {
                x: entity.x - 1,
                y: entity.y - 1
            },
            {
                x: entity.x + 1,
                y: entity.y - 1,
            },
            {
                x: entity.x,
                y: entity.y + 1
            }
        ];
        const letters = filterValidLetters(board, patterns, false);
        destroyLetters(board, letters, effects);
        return effects;
    }

    function cross(entity: LetterEntity, effects: Array<BoardEffect>) {
        const cardinal = [
            {
                x: entity.x,
                y: entity.y
            },
            {
                x: entity.x,
                y: entity.y - 1
            },
            {
                x: entity.x + 1,
                y: entity.y
            },
            {
                x: entity.x,
                y: entity.y + 1
            },
            {
                x: entity.x - 1,
                y: entity.y
            }
        ];
        const letters = filterValidLetters(board, cardinal, false);
        destroyLetters(board, letters, effects);
        return effects;
    }

    function diagonal(entity: LetterEntity, effects: Array<BoardEffect>) {
        const diagonal = [
            {
                x: entity.x,
                y: entity.y
            },
            {
                x: entity.x - 1,
                y: entity.y - 1
            },
            {
                x: entity.x + 1,
                y: entity.y - 1
            },
            {
                x: entity.x - 1,
                y: entity.y + 1
            },
            {
                x: entity.x + 1,
                y: entity.y + 1
            }
        ];
        const letters = filterValidLetters(board, diagonal, false);
        destroyLetters(board, letters, effects);
        return effects;
    }

    function right(entity: LetterEntity, effects: Array<BoardEffect>) {
        let letterPositions = [];
        for (let i = entity.x; i < maxX; ++i) {
            letterPositions.push({
                x: i,
                y: entity.y
            });
        }
        const letters = filterValidLetters(board, letterPositions, true);
        destroyLetters(board, letters, effects);
        return effects;
    }

    function left(entity: LetterEntity, effects: Array<BoardEffect>) {
        let letterPositions = [];
        for (let i = entity.x; i >= 0; --i) {
            letterPositions.push({
                x: i,
                y: entity.y
            });
        }
        const letters = filterValidLetters(board, letterPositions, true);
        destroyLetters(board, letters, effects);
        return effects;
    }

    function up(entity: LetterEntity, effects: Array<BoardEffect>) {
        let letterPositions = [];
        for (let i = entity.y; i >= 0; --i) {
            letterPositions.push({
                x: entity.x,
                y: i
            });
        }
        const letters = filterValidLetters(board, letterPositions, true);
        destroyLetters(board, letters, effects);
        return effects;
    }

    function down(entity: LetterEntity, effects: Array<BoardEffect>) {
        let letterPositions = [];
        for (let i = entity.y; i < maxY; ++i) {
            letterPositions.push({
                x: entity.x,
                y: i
            });
        }
        const letters = filterValidLetters(board, letterPositions, false);
        destroyLetters(board, letters, effects);
        return effects;
    }

    function rotateAround(entity: LetterEntity) {
        let movements = new Array<{ x: number, y: number, toX: number, toY: number }>();
        let centerX = entity.x;
        let centerY = entity.y;

        for (let x = -1; x <= 1; ++x) {
            for (let y = -1; y <= 1; ++y) {
                //For each point that differes from the center by 1..
                let newX = centerX + x;
                let newY = centerY + y;

                //..ignoring the center itself
                if (x === 0 && y === 0) continue;

                //1. Move adjacent points clockwise
                if (x === 0 || y === 0) {
                    if (x === 0) newX -= y;
                    if (y === 0) newY += x;
                }
                //2. Move diagonal points clockwise
                else {
                    if (x + y === 0) newY += x;
                    else newX -= y;
                }
                movements.push({ x: centerX + x, y: centerY + y, toX: newX, toY: newY });
            }
        }

        //Do not work if there were offboard moves
        const valid = movements.every(
            result => result.x >= 0 && result.x < maxX
                && result.y >= 0 && result.y < maxY
                && result.toX >= 0 && result.toX < maxX
                && result.toY >= 0 && result.toY < maxY
        );

        if (!valid) return []

        const results: MoveEffect[] = [];
        for (const move of movements) {
            const entity = board.getLetterEntity(move.x, move.y);
            if (entity) {
                results.push(makeMove(entity, move.toX, move.toY));
            }
        }

        return results;
    }

    function makeMove(entity: LetterEntity, toX: number, toY: number): MoveEffect {
        return {
            entity,
            effect: BoardEffectType.Move,
            toX: toX,
            toY: toY
        }
    }

}