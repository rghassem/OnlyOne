type LetterChar = 'O' | 'N' | 'E' | 'L' | 'R' | 'U' | 'D' | 'W' | 'I' | 'C' | 'Y' | 'Blank' | ' ';

export enum Letter {
    Blank,
    O,
    N,
    E,
    R, //lol
    L,
    U,
    D,
    W,
    I,
    C,
    // X,
    Y,
    B,
    M,
    Z,
    A,
    K,
    S,
    P,
    T,
    G,
    Length
}

class LetterVisual {
    constructor(
        public char: string,
        public name = '',
        public description = "We didn't implement this one yet!",
        public color = "#ffffff",
    ) { }
}
export const letterVisuals = new Map<Letter, LetterVisual>();
letterVisuals.set(Letter.Blank, new LetterVisual(' '));
letterVisuals.set(Letter.O, new LetterVisual('O', 'Get to the bottom!', 'Get this to the bottom row!', '#FFFF00'));
letterVisuals.set(Letter.N, new LetterVisual('N', 'Get to the bottom!', 'Get this to the bottom row!', '#FFFF00'));
letterVisuals.set(Letter.E, new LetterVisual('E', 'Get to the bottom!', 'Get this to the bottom row!', '#FFFF00'));
letterVisuals.set(Letter.R, new LetterVisual('R', 'Right', 'Destroys all letters to the right. Blocked by walls.'));
letterVisuals.set(Letter.L, new LetterVisual('L', 'Left', 'Destroys all letters to the left. Blocked by walls.'));
letterVisuals.set(Letter.U, new LetterVisual('U', 'Up', 'Destroys all letters above it. Blocked by walls.'));
letterVisuals.set(Letter.D, new LetterVisual('D', 'Down', 'Destroys all letters below it. Blocked by walls.'));
letterVisuals.set(Letter.W, new LetterVisual('W', 'Wall', 'Blocks all letter destruction effects. Can be destroyed normally.', '#55B560'));
letterVisuals.set(Letter.I, new LetterVisual('I', 'Invisible', 'Can only be destroyed by letter abilities.', '#4FA4E4'));
letterVisuals.set(Letter.C, new LetterVisual('C', 'Cross', 'Destroys one block in each cardinal direction.'));
letterVisuals.set(Letter.Y, new LetterVisual('Y', 'Yttrium Bomb', 'We kinda just liked the pattern.', '#99041D'));
letterVisuals.set(Letter.B, new LetterVisual('B', 'B'));
letterVisuals.set(Letter.M, new LetterVisual('M', 'M'));
letterVisuals.set(Letter.Z, new LetterVisual('Z', 'Z'));
letterVisuals.set(Letter.A, new LetterVisual('A', 'A'));
letterVisuals.set(Letter.K, new LetterVisual('K', 'K'));
letterVisuals.set(Letter.S, new LetterVisual('S', 'S'));
letterVisuals.set(Letter.P, new LetterVisual('P', 'P'));
letterVisuals.set(Letter.T, new LetterVisual('T', 'T'));
letterVisuals.set(Letter.G, new LetterVisual('G', 'G'));

export const letterFrequency = new Map<Letter, number>();
letterFrequency.set(Letter.L, 15);
letterFrequency.set(Letter.R, 15);
letterFrequency.set(Letter.U, 10);
letterFrequency.set(Letter.D, 5);
letterFrequency.set(Letter.W, 14);
letterFrequency.set(Letter.I, 14);
letterFrequency.set(Letter.C, 14);
letterFrequency.set(Letter.Y, 13);

export function getRandomLetter() {
    let rand = Math.random() * 100;
    let sum = 0;
    for (let key of letterFrequency.keys()) {
        sum += letterFrequency.get(key)!;
        if (rand <= sum) {
            return key;
        }
    }
    return Letter.Blank;
}

export class LetterEntity {
    constructor(
        public letter: Letter,
        public x: number,
        public y: number
    ) { }
}

export const maxY = 13;
export const maxX = 10;
export let gameboard: Array<LetterEntity>;

export function resetBoard(preset?: string) {
    gameboard = [];

    for (let y = 0; y < maxY; ++y) {
        for (let x = 0; x < maxX; ++x) {
            const index2d = x + (maxX * y);
            if (preset && preset.length >= index2d && preset.charAt(index2d) !== '*') {
                let letterStr = preset.charAt(index2d) as LetterChar;
                if (letterStr === ' ') letterStr = 'Blank';
                const letter = Letter[letterStr];
                addLetter(letter, x, y);
            }
            else {
                addLetter(getRandomLetter(), x, y);
            }

        }
    }

    if (!preset) {
        const topArea = 50;
        const used: Array<number> = [Math.floor(Math.random() * topArea)];
        for (let i = 0; i <= 3; ++i) {
            let idx = Math.floor(Math.random() * topArea);
            while (used.indexOf(idx) >= 0) {
                idx = Math.floor(Math.random() * topArea);
            }
            used.push(idx);
        }

        gameboard[used[0]].letter = Letter.O;
        gameboard[used[1]].letter = Letter.N;
        gameboard[used[2]].letter = Letter.E;
    }
}

export function addLetter(letter: Letter, x: number, y: number) {
    gameboard.push(new LetterEntity(letter, x, y));
}

export function removeLetterEntity(entity: LetterEntity) {
    gameboard.splice(gameboard.indexOf(entity), 1);
}

export function getLetterEntity(x: number, y: number) {
    return gameboard.find(entity => entity.x === x && entity.y === y);
}