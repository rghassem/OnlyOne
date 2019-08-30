import { LetterEntity, Letter, getRandomLetter } from "./letterEntity";
import { RandomNumberGenerator } from "./randomNumberGenerator";

type LetterChar = 'O' | 'N' | 'E' | 'L' | 'R' | 'U' | 'D' | 'W' | 'I' | 'C' | 'X' | 'Y' | '0' | '1' | '2' | 'First' | 'Second' | 'Third' | ' ';

export const maxY = 13;
export const maxX = 8;

export class Gameboard {
    firstLetterScored: boolean = false;
    secondLetterScored: boolean = false;
    thirdLetterScored: boolean = false;

    readonly entities: Array<LetterEntity>;

    constructor(entities?: Array<LetterEntity>) {
        if (entities) {
            this.entities = entities;
        }
        else {
            this.entities = new Array<LetterEntity>();
        }
    }

    static fromString(preset: string) {
        const result = new Gameboard();
        const rng = new RandomNumberGenerator(13);

        for (let y = 0; y < maxY; ++y) {
            for (let x = 0; x < maxX; ++x) {
                const index2d = x + (maxX * y);
                if (preset.length >= index2d && preset.charAt(index2d) !== '*') {
                    let letterStr = preset.charAt(index2d) as LetterChar;
                    if (letterStr === ' ') continue;
                    if (letterStr === '0') letterStr = 'First';
                    if (letterStr === '1') letterStr = 'Second';
                    if (letterStr === '2') letterStr = 'Third';
                    const letter = Letter[letterStr];
                    result.addLetter(letter, x, y);
                }
                else {
                    result.addLetter(getRandomLetter(rng.get()), x, y);
                }

            }
        }

        return result;
    }

    static fromSeed(seed: number) {
        const result = new Gameboard();
        const rng = new RandomNumberGenerator(seed);

        for (let y = 0; y < maxY; ++y) {
            for (let x = 0; x < maxX; ++x) {
                result.addLetter(getRandomLetter(rng.get()), x, y);
            }
        }

        const topArea = 50;
        const used: Array<number> = [Math.floor(rng.get() * topArea)];
        for (let i = 0; i <= 3; ++i) {
            let idx = Math.floor(rng.get() * topArea);
            while (used.indexOf(idx) >= 0) {
                idx = Math.floor(rng.get() * topArea);
            }
            used.push(idx);
        }

        result.entities[used[0]].letter = Letter.First;
        result.entities[used[1]].letter = Letter.Second;
        result.entities[used[2]].letter = Letter.Third;

        return result;
    }

    addLetter(letter: Letter, x: number, y: number) {
        this.entities.push(new LetterEntity(letter, x, y));
    }

    removeLetterEntity(entity: LetterEntity) {
        const target = this.entities.indexOf(entity);
        this.entities.splice(target, 1);
    }

    getLetterEntity(x: number, y: number) {
        return this.entities.find(entity => entity.x === x && entity.y === y);
    }

    clone() {
        const entities: Array<LetterEntity> = this.entities.map(entity => new LetterEntity(entity.letter, entity.x, entity.y));
        const copy = new Gameboard(entities);
        copy.firstLetterScored = this.firstLetterScored;
        copy.secondLetterScored = this.secondLetterScored;
        copy.thirdLetterScored = this.thirdLetterScored;
        return copy;
    }
}