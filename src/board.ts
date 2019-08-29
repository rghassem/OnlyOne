import { LetterEntity, Letter, getRandomLetter } from "./letterEntity";

type LetterChar = 'O' | 'N' | 'E' | 'L' | 'R' | 'U' | 'D' | 'W' | 'I' | 'C' | 'X' | 'Y' | '0' | '1' | '2' | 'First' | 'Second' | 'Third' | ' ';

export const maxY = 13;
export const maxX = 8;

export class Gameboard extends Array<LetterEntity> {
    firstLetterScored: boolean;
    secondLetterScored: boolean;
    thirdLetterScored: boolean;

    constructor(input: string | number) {
        super();
        const preset = typeof input === 'string' ? input : null;
        const seed = typeof input !== 'string' ? input : 13; //Use 13 as seed for preset wildcards.
        const rng = new RandomGenerator(seed);

        this.firstLetterScored = false;
        this.secondLetterScored = false;
        this.thirdLetterScored = false;

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
                    this.addLetter(letter, x, y);
                }
                else {
                    this.addLetter(getRandomLetter(rng.get()), x, y);
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

            this[used[0]].letter = Letter.First;
            this[used[1]].letter = Letter.Second;
            this[used[2]].letter = Letter.Third;
        }

        return this;
    }

    addLetter(letter: Letter, x: number, y: number) {
        this.push(new LetterEntity(letter, x, y));
    }

    removeLetterEntity(entity: LetterEntity) {
        const target = this.indexOf(entity);
        this.splice(target, 1);
    }

    getLetterEntity(x: number, y: number) {
        return this.find(entity => entity.x === x && entity.y === y);
    }
}

class RandomGenerator {
    constructor(public seed: number) { }
    get = function () {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280;
        return rnd;
    }
}