import { Letter, getLetter, rows, cols } from "./board";
import { BoardEffect, BoardEffectType } from "./boardEffect";

type LetterEffect = (x: number, y: number) => Array<BoardEffect>;

export function onLetterPressed(x: number, y: number): Array<BoardEffect> {
	const letter = getLetter(x, y);
	switch (letter) {
		case Letter.L:
			return left(x, y);
		case Letter.R:
			return right(x, y);
		case Letter.U:
			return up(x, y);
		case Letter.D:
            return down(x, y);
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
	for (let i = x + 1; x <= rows; ++i) {
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
	for (let i = x - 1; x > 0; --i) {
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
	for (let i = y - 1; y >= 0; --i) {
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
	for (let i = y + 1; y <= rows; ++i) {
		effects.push({
            x,
			y: i,
			effect: BoardEffectType.Destroy
		});
	}
	return effects;
}
