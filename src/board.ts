export enum Letter {
    Blank,
    O,
    N,
    E,
    L,
    R,
    U,
    D,
    // T,
    W,
    I,
    C,
    X,
    Length
}

class LetterVisual {
    constructor(
        public char: string,
        public name = '',
        public color = "#ffffff"
    ) { }
}
export const letterVisuals = new Map<Letter, LetterVisual>();
letterVisuals.set(Letter.Blank, new LetterVisual(' '));
letterVisuals.set(Letter.O, new LetterVisual('O', undefined, '#FFFF00'));
letterVisuals.set(Letter.N, new LetterVisual('N', undefined, '#FFFF00'));
letterVisuals.set(Letter.E, new LetterVisual('E', undefined, '#FFFF00'));
letterVisuals.set(Letter.L, new LetterVisual('L', 'Left'));
letterVisuals.set(Letter.R, new LetterVisual('R', 'Right'));
letterVisuals.set(Letter.U, new LetterVisual('U', 'Up '));
letterVisuals.set(Letter.D, new LetterVisual('D', 'Down'));
letterVisuals.set(Letter.W, new LetterVisual('W', 'Wall'));
letterVisuals.set(Letter.I, new LetterVisual('I', 'Invisible'));
letterVisuals.set(Letter.C, new LetterVisual('C', 'Cross'));
letterVisuals.set(Letter.X, new LetterVisual('X', 'X'));
// letterVisuals.set(Letter.T, new LetterVisual('T', 'Twist'));


export class LetterEntity {
    constructor(
        public letter: Letter,
        public x: number,
        public y: number
    ) { }
}

export const maxY = 18;
export const maxX = 10;
export const gameboard = new Array<LetterEntity>();

for (let y = 0; y < maxY; ++y) {
    for (let x = 0; x < maxX; ++x) {
        addLetter(randomLetter(), x, y);
    }
}

function randomLetter() {
    return Math.floor(Math.random() * (Letter.Length - 1)) + 1;
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