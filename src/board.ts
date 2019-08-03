export enum Letter {
    O,
    N,
    E,
    L,
    R,
    U,
    D,
    Length
}

export const rows = 16;
export const cols = 16

const gameboard = new Array<Letter>();

for (let r = 0; r < rows; ++r) {
    for (let c = 0; c < cols; ++c) {
        gameboard[boardIndex(r, c)] = Math.floor(Math.random() * Letter.Length);
    }
}

export function boardIndex(x: number, y: number) {
    return x + (cols * y);
}

export function getLetter(x: number, y: number) {
    return gameboard[boardIndex(x, y)];
}