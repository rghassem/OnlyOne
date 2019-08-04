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
		// case Letter.T:
		// 	return twist(x, y);
		case Letter.I:
		case Letter.O:
		case Letter.N:
		case Letter.E:
			return [];
		case Letter.C:
			return cross(x, y);
		case Letter.Y:
			return ybomb(x, y);
		case Letter.F:
			return fbomb(x, y);
		// case Letter.X:
		// 	return diagonal(x, y);
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

function fbomb(x: number, y: number) {
	const effects = [];
	const patterns = [
		{
			x: x - 1,
			y: y - 1
		},
		{
			x: x,
			y: y - 1,
		},
		{
			x: x + 1,
			y: y - 1,
		},
		{
			x: x - 1,
			y: y,
		},
		{
			x: x,
			y: y,
		},
		{
			x: x - 1,
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
	const effects = itself(x, y);

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