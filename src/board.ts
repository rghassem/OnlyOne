export enum Letter {
    Blank,
    O,
    N,
    E,
    L,
    R,
    U,
    D,
    T,
    Length
}

export class LetterEntity {
    constructor(
        public letter: Letter,
        public x: number,
        public y: number
    ) { }
}

export const maxY = 16;
export const maxX = 16

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