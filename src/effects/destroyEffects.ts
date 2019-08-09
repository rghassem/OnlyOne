import { Letter, LetterEntity, getLetterEntity, maxX, maxY } from "../board";
import { BoardEffect, BoardEffectType } from "./boardEffect";
import { doLetterEffect } from "./letters";

const chainingLetters = [
    Letter.C,
    Letter.X,
    Letter.Y
];


export function canDestroy(entity: LetterEntity, effects: Array<BoardEffect>) {
    const alreadyDestroyed = effects.find(effect => effect.x === entity.x && effect.y === entity.y);
    console.log(alreadyDestroyed);
	return !alreadyDestroyed && entity.letter !== Letter.W;
}

export function canChain(entity: LetterEntity) {
	return chainingLetters.indexOf(entity.letter) > -1;
}

export function attemptDestroy(entity: LetterEntity, effects: Array<BoardEffect>) {
    const destroyEffect = {
        x: entity.x,
        y: entity.y,
        effect: BoardEffectType.Destroy
    };
    if (canDestroy(entity, effects)) {
        effects.push(destroyEffect);
        if (canChain(entity)) {
            doLetterEffect(entity, effects);
        }
    }
}

export function destroyItself(x: number, y: number, effects: Array<BoardEffect>) {
    if (!effects.find(effect => effect.x === y && effect.y === y)) {
        effects.push({
            x,
            y,
            effect: BoardEffectType.Destroy
        });
    }
}

export function ybomb(x: number, y: number, effects: Array<BoardEffect>) {
	destroyItself(x, y, effects);
	const patterns = [
		{
			x: x - 1,
			y: y - 1
		},
		{
			x: x + 1,
			y: y - 1,
		},
		{
			x: x,
			y: y + 1
		}
	];
	for (let pattern of patterns) {
		const entity = getLetterEntity(pattern.x, pattern.y);
		if (entity) {
			attemptDestroy(entity, effects);
		}
	}
}

export function cross(x: number, y: number, effects:Array<BoardEffect>) {
	destroyItself(x, y, effects);
	const cardinal = [
		{
			x,
			y: y - 1
		},
		{
			x: x + 1,
			y
		},
		{
			x,
			y: y + 1
		},
		{
			x: x - 1,
			y
		}
	];

	for (let position of cardinal) {
		const entity = getLetterEntity(position.x, position.y);
		if (entity) {
            attemptDestroy(entity, effects);
        }
    }
    
	return effects;
}

export function diagonal(x: number, y: number, effects:Array<BoardEffect>) {
	destroyItself(x, y, effects);
	const diagonal = [
		{
			x: x - 1,
			y: y - 1
		},
		{
			x: x + 1,
			y: y - 1
		},
		{
			x: x - 1,
			y: y + 1
		},
		{
			x: x + 1,
			y: y + 1
		}
	];

	for (let position of diagonal) {
		const entity = getLetterEntity(position.x, position.y);
		if (entity) {
            attemptDestroy(entity, effects);
        }
	}

	return effects;
}

export function right(x: number, y: number, effects: Array<BoardEffect>) {
	destroyItself(x, y, effects);
	for (let i = x + 1; i < maxX; ++i) {
		const entity = getLetterEntity(i, y);
		if (entity) {
            attemptDestroy(entity, effects);
        }
	}
	return effects;
}

export function left(x: number, y: number, effects: Array<BoardEffect>) {
	destroyItself(x, y, effects);
	for (let i = x - 1; i >= 0; --i) {
		const entity = getLetterEntity(i, y);
		if (entity) {
            attemptDestroy(entity, effects);
        }
	}
	return effects;
}

export function up(x: number, y: number, effects: Array<BoardEffect>) {
	destroyItself(x, y, effects);
	for (let i = y - 1; i >= 0; --i) {
		const entity = getLetterEntity(x, i);
        if (entity) {
            attemptDestroy(entity, effects);
        }
	}
	return effects;
}

export function down(x: number, y: number, effects: Array<BoardEffect>) {
	destroyItself(x, y, effects);
	for (let i = y + 1; i < maxY; ++i) {
		const entity = getLetterEntity(x, i);
        if (entity) {
            attemptDestroy(entity, effects);
        }
	}
	return effects;
}