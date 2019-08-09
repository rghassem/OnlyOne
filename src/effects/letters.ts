import { Letter, getLetterEntity, maxY, maxX, LetterEntity } from "../board";
import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";
import { destroyItself, left, right, up, down, cross, ybomb, diagonal } from "./destroyEffects";

type LetterEffect = (x: number, y: number) => Array<BoardEffect>;

export function onLetterPressed(x: number, y: number): Array<BoardEffect> {
	const entity = getLetterEntity(x, y);
	const effects: Array<BoardEffect> = [];
	doLetterEffect(entity, effects);
	return effects;
}

export function doLetterEffect(entity: LetterEntity | undefined, effects: Array<BoardEffect>) {
	if (!entity) {
		return;
	}
	switch (entity.letter) {
		case Letter.Blank:
			return [];
		case Letter.L:
			return left(entity.x, entity.y, effects);
		case Letter.R:
			return right(entity.x, entity.y, effects);
		case Letter.U:
			return up(entity.x, entity.y, effects);
		case Letter.D:
			return down(entity.x, entity.y, effects);
		case Letter.I:
		case Letter.O:
		case Letter.N:
		case Letter.E:
			return [];
		case Letter.C:
			return cross(entity.x, entity.y, effects);
		case Letter.T:
			const rotation = rotateAround(entity.x, entity.y);
			const changeSelf = { x: entity.x, y: entity.y, effect: BoardEffectType.Change, changeTo: Letter.I };
			return rotation.concat(changeSelf);
		case Letter.Y:
			return ybomb(entity.x, entity.y, effects);
		case Letter.X:
			return diagonal(entity.x, entity.y, effects);
		default:
			return destroyItself(entity.x, entity.y, effects);
	}
}

function rotateAround(centerX: number, centerY: number) {
	const results = new Array<BoardEffect>();

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

	//Remove offboard moves
	results.filter(result => result.x < 0 || result.x >= maxX
		|| result.y < 0 || result.y >= maxY);

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