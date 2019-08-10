import { Letter, getLetterEntity, maxY, maxX, LetterEntity } from "./board";
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
		case Letter.T:
			const rotation = rotateAround(x, y);
			const changeSelf = { x, y, effect: BoardEffectType.Transform, changeTo: Letter.I };
			return rotation.concat(changeSelf);
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
		if (!entity) continue;
		const effect = destroy(entity);
		effects.push(effect);
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
		if (!entity) continue;
		const effect = destroy(entity);
		effects.push(effect);
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
		if (!entity) continue;
		const effect = destroy(entity);
		effects.push(effect);
		if (effect.effect === BoardEffectType.BlockDestruction) {
			break;
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
		if (!entity) continue;
		const effect = destroy(entity);
		effects.push(effect);
		if (effect.effect === BoardEffectType.BlockDestruction) {
			break;
		}
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
		if (!entity) continue;
		const effect = destroy(entity);
		effects.push(effect);
		if (effect.effect === BoardEffectType.BlockDestruction) {
			break;
		}
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
		if (!entity) continue;
		const effect = destroy(entity);
		effects.push(effect);
		if (effect.effect === BoardEffectType.BlockDestruction) {
			break;
		}
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
		if (!entity) continue;
		const effect = destroy(entity);
		effects.push(effect);
		if (effect.effect === BoardEffectType.BlockDestruction) {
			break;
		}
	}
	return effects;
}

function rotateAround(centerX: number, centerY: number): BoardEffect[] {
	let results = new Array<MoveEffect>();

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
			results.push(makeMove(centerX + x, centerY + y, newX, newY));
		}
	}

	//Do not work if there were offboard moves
	const valid = results.every(
		result => result.x > 0 && result.x < maxX
			&& result.y > 0 && result.y < maxY
			&& result.toX > 0 && result.toX < maxX
			&& result.toY > 0 && result.toY < maxY
	);

	if (!valid) return []

	return results;
}

function makeMove(x: number, y: number, toX: number, toY: number) {
	return {
		x, y,
		effect: BoardEffectType.Move,
		toX: toX,
		toY: toY
	}
}

function destroy(entity: LetterEntity) {
	if (entity.letter === Letter.W) {
		return {
			x: entity.x,
			y: entity.y,
			effect: BoardEffectType.BlockDestruction
		};
	}
	return {
		x: entity.x,
		y: entity.y,
		effect: BoardEffectType.Destroy
	};
}