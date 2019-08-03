import { Letter, getLetterEntity, maxY, maxX } from "./board";
import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";

type LetterEffect = (x: number, y: number) => Array<BoardEffect>;

export function onLetterPressed(x: number, y: number): Array<BoardEffect> {
	const entity = getLetterEntity(x, y);
	if (!entity) return [];
	switch (entity.letter) {
		case Letter.L:
			return left(x, y);
		case Letter.R:
			return right(x, y);
		case Letter.U:
			return up(x, y);
		case Letter.D:
			return down(x, y);
		case Letter.T:
			return twist(x, y);
		default:
			return itself(x, y);
	}
	return [];
}

function itself(x: number, y: number) {
	return [{
		x,
		y,
		effect: BoardEffectType.Destroy
	}];
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
		effects.push({
			x,
			y: i,
			effect: BoardEffectType.Destroy
		});
	}
	return effects;
}

function neighbors(x: number, y: number): Array<Position> {
	return [
		// Top Left
		{
			x: x - 1,
			y: y - 1
		},
		// Top
		{
			x: x,
			y: y - 1
		},
		// Top Right
		{
			x: x + 1,
			y: y - 1
		},
		// Right
		{
			x: x + 1,
			y
		},
		// Bottom Right
		{
			x: x + 1,
			y: y + 1
		},
		// Bottom
		{
			x,
			y: y + 1
		},
		// Bottom Left
		{
			x: x - 1,
			y: y + 1
		},
		// Left
		{
			x: x - 1,
			y
		},
	];
}

type Position = { x: number, y: number };

function twist(x: number, y: number) {
	const letters = neighbors(x, y);
	const effects = [];

	for (let i = 0; i < letters.length; ++i) {
		const letter = letters[i];
		const newPosition = i + 1 < letters.length ? letters[i + 1] : letters[0];

		effects.push({
			x: letter.x,
			y: letter.y,
			effect: BoardEffectType.Move,
			toX: newPosition.x,
			toY: newPosition.y
		} as MoveEffect);
	}

	return effects;
}