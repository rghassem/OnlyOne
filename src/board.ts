import { LetterEntity, Letter, getRandomLetter } from "./letterEntity";

type LetterChar = 'O' | 'N' | 'E' | 'L' | 'R' | 'U' | 'D' | 'W' | 'I' | 'C' | 'X' | 'Y' | '0' | '1' | '2' | 'First' | 'Second' | 'Third' | ' ';

export interface Gameboard extends Array<LetterEntity> {
    firstLetterScored: boolean;
    secondLetterScored: boolean;
    thirdLetterScored: boolean;
}

export const maxY = 13;
export const maxX = 8;

export function newBoard(input: string | number) {
    const preset = typeof input === 'string' ? input : null;
    const seed = typeof input !== 'string' ? input : 13; //Use 13 as seed for preset wildcards.
    const rng = new RandomGenerator(seed);

    const partialGameboard = new Array<LetterEntity>();
    (partialGameboard as Gameboard).firstLetterScored = false;
    (partialGameboard as Gameboard).secondLetterScored = false;
    (partialGameboard as Gameboard).thirdLetterScored = false;
    const gameboard: Gameboard = partialGameboard as Gameboard;

    for (let y = 0; y < maxY; ++y) {
        for (let x = 0; x < maxX; ++x) {
            const index2d = x + (maxX * y);
            if (preset && preset.length >= index2d && preset.charAt(index2d) !== '*') {
                let letterStr = preset.charAt(index2d) as LetterChar;
                if (letterStr === ' ') continue;
                if (letterStr === '0') letterStr = 'First';
                if (letterStr === '1') letterStr = 'Second';
                if (letterStr === '2') letterStr = 'Third';
                const letter = Letter[letterStr];
                addLetter(gameboard, letter, x, y);
            }
            else {
                addLetter(gameboard, getRandomLetter(rng.get()), x, y);
            }

        }
    }

    if (!preset) {
        const topArea = 50;
        const used: Array<number> = [Math.floor(rng.get() * topArea)];
        for (let i = 0; i <= 3; ++i) {
            let idx = Math.floor(rng.get() * topArea);
            while (used.indexOf(idx) >= 0) {
                idx = Math.floor(rng.get() * topArea);
            }
            used.push(idx);
        }

        gameboard[used[0]].letter = Letter.First;
        gameboard[used[1]].letter = Letter.Second;
        gameboard[used[2]].letter = Letter.Third;
    }

    return gameboard;
}

export function addLetter(gameboard: Gameboard, letter: Letter, x: number, y: number) {
    gameboard.push(new LetterEntity(letter, x, y));
}

export function removeLetterEntity(gameboard: Gameboard, entity: LetterEntity) {
    const target = gameboard.indexOf(entity);
    gameboard.splice(target, 1);
}

export function getLetterEntity(gameboard: Gameboard, x: number, y: number) {
    return gameboard.find(entity => entity.x === x && entity.y === y);
}

class RandomGenerator {
    constructor(public seed: number) { }
    get = function () {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280;
        return rnd;
    }
}