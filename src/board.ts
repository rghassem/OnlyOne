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

export const rows = 16;
export const cols = 16

const gameboard = new Array<Letter>();

for (let r = 0; r < rows; ++r) {
    for (let c = 0; c < cols; ++c) {
        gameboard[boardIndex(c, r)] = randomLetter();
    }
}

export function randomLetter() {
    return Math.floor(Math.random() * (Letter.Length - 1)) + 1;
}

export function boardIndex(x: number, y: number) {
    return x + (cols * y);
}

export function getLetter(x: number, y: number) {
    return gameboard[boardIndex(x, y)];
}

export function setLetter(x: number, y: number, val: Letter) {
    gameboard[boardIndex(x, y)] = val;
}