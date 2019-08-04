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
    // X,
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
letterVisuals.set(Letter.O, new LetterVisual('O', 'Get this to the bottom row!', '#FFFF00'));
letterVisuals.set(Letter.N, new LetterVisual('N', 'Get this to the bottom row!', '#FFFF00'));
letterVisuals.set(Letter.E, new LetterVisual('E', 'Get this to the bottom row!', '#FFFF00'));
letterVisuals.set(Letter.L, new LetterVisual('L', 'Left'));
letterVisuals.set(Letter.R, new LetterVisual('R', 'Right'));
letterVisuals.set(Letter.U, new LetterVisual('U', 'Up '));
letterVisuals.set(Letter.D, new LetterVisual('D', 'Down'));
letterVisuals.set(Letter.W, new LetterVisual('W', 'Wall', '#83A0A8'));
letterVisuals.set(Letter.I, new LetterVisual('I', 'Invisible', '#4FA4E4'));
letterVisuals.set(Letter.C, new LetterVisual('C', 'Cross'));
// letterVisuals.set(Letter.X, new LetterVisual('X', 'X'));
// letterVisuals.set(Letter.T, new LetterVisual('T', 'Twist'));

export const letterFrequency = new Map<Letter, number>();
letterFrequency.set(Letter.L, 16);
letterFrequency.set(Letter.R, 16);
letterFrequency.set(Letter.U, 5);
letterFrequency.set(Letter.D, 15);
letterFrequency.set(Letter.W, 19);
letterFrequency.set(Letter.I, 14);
letterFrequency.set(Letter.C, 15);

export function getRandomLetter() {
    let rand = Math.random() * 100;
    console.log(`rand=${rand}`)
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

export const maxY = 15;
export const maxX = 10;
export let gameboard: Array<LetterEntity>;

export function resetBoard() {
    gameboard = [];
    for (let y = 0; y < maxY; ++y) {
        for (let x = 0; x < maxX; ++x) {
            addLetter(getRandomLetter(), x, y);
        }
    }
    //This is super confusing but it sets the O, N, and E somewhere at the top.
    const topArea = 50;
    for (let i = Letter.O; i <= Letter.E; ++i) {
        gameboard[Math.floor(Math.random() * topArea)].letter = i;
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