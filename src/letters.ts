import { Letter, getLetterEntity, maxY, maxX } from "./board";
import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";

type LetterEffect = (x: number, y: number) => Array<BoardEffect>;

export function onLetterPressed(x: number, y: number): Array<BoardEffect> {
	const entity = getLetterEntity(x, y);
	if (!entity) return [];
	switch (entity.letter) {
		case Letter.Blank:
			return [];
		case Letter.L:
			return left(x, y);
		case Letter.R:
			return right(x, y);
		case Letter.U:
			return up(x, y);
		case Letter.D:
			return down(x, y);
		case Letter.I:
		case Letter.O:
		case Letter.N:
		case Letter.E:
			return [];
		case Letter.C:
			return cross(x, y);

		case Letter.Y:
			return ybomb(x, y);
		case Letter.X:
			return diagonal(x, y);
		default:
			return itself(x, y);
	}
}

function itself(x: number, y: number) {
	return [{
		x,
		y,
		effect: BoardEffectType.Destroy
	}];
}

function ybomb(x: number, y: number) {
	const effects = itself(x, y);
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
		if (!entity || entity.letter === Letter.W) {
			continue;
		} else {
			effects.push({
				x: pattern.x,
				y: pattern.y,
				effect: BoardEffectType.Destroy
			});
		}
	}
	return effects;
}

function cross(x: number, y: number) {
	const effects = itself(x, y);

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
		if (!entity || entity.letter === Letter.W) {
			continue;
		} else {
			effects.push({
				x: position.x,
				y: position.y,
				effect: BoardEffectType.Destroy
			});
		}
	}
	return effects;
}

function diagonal(x: number, y: number) {
	const effects = [
		{
			x,
			y,
			effect: BoardEffectType.Destroy
		}
	];

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
		if (!entity || entity.letter === Letter.W) {
			continue;
		} else {
			effects.push({
				x: position.x,
				y: position.y,
				effect: BoardEffectType.Destroy
			});
		}
	}

	return effects;
}

function right(x: number, y: number) {
	const effects = [
		{
			x,
			y,
			effect: BoardEffectType.Destroy
		}
	];
	for (let i = x + 1; i < maxX; ++i) {
		const entity = getLetterEntity(i, y);
		if (entity && entity.letter === Letter.W) {
			break;
		}
		effects.push({
			x: i,
			y,
			effect: BoardEffectType.Destroy
		});
	}
	return effects;
}

function left(x: number, y: number) {
	const effects = [
		{
			x,
			y,
			effect: BoardEffectType.Destroy
		}
	];
	for (let i = x - 1; i >= 0; --i) {
		const entity = getLetterEntity(i, y);
		if (entity && entity.letter === Letter.W) {
			break;
		}
		effects.push({
			x: i,
			y,
			effect: BoardEffectType.Destroy
		});
	}
	return effects;
}

function up(x: number, y: number) {
	const effects = [
		{
			x,
			y,
			effect: BoardEffectType.Destroy
		}
	];
	for (let i = y - 1; i >= 0; --i) {
		const entity = getLetterEntity(x, i);
		if (entity && entity.letter === Letter.W) {
			break;
		}
		effects.push({
			x,
			y: i,
			effect: BoardEffectType.Destroy
		});
	}
	return effects;
}

function down(x: number, y: number) {
	const effects = [
		{
			x,
			y,
			effect: BoardEffectType.Destroy
		}
	];
	for (let i = y + 1; i < maxY; ++i) {
		const entity = getLetterEntity(x, i);
		if (entity && entity.letter === Letter.W) {
			break;
		}
		effects.push({
			x,
			y: i,
			effect: BoardEffectType.Destroy
		});
	}
	return effects;
}