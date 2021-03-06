import { maxY, maxX } from "./board";

export enum Letter {
    First,
    Second,
    Third,
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
    X,
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
letterVisuals.set(Letter.First, new LetterVisual('0', "Get this to the bottom!", "Get this to the bottom row!", "#FFFF00"));
letterVisuals.set(Letter.Second, new LetterVisual('1', "Get this to the bottom!", "Get this to the bottom row!", "#FFFF00"));
letterVisuals.set(Letter.Third, new LetterVisual('2', "Get this to the bottom!", "Get this to the bottom row!", "#FFFF00"));
letterVisuals.set(Letter.R, new LetterVisual('R', 'Right', 'Destroys all letters to the right. Blocked by walls.'));
letterVisuals.set(Letter.L, new LetterVisual('L', 'Left', 'Destroys all letters to the left. Blocked by walls.'));
letterVisuals.set(Letter.U, new LetterVisual('U', 'Up', 'Destroys all letters above it. Blocked by walls.'));
letterVisuals.set(Letter.D, new LetterVisual('D', 'Down', 'Destroys all letters below it. Blocked by walls.'));
letterVisuals.set(Letter.W, new LetterVisual('W', 'Wall', 'Blocks all letter destruction effects. Can be destroyed normally.', '#55B560'));
letterVisuals.set(Letter.I, new LetterVisual('I', 'Invisible', 'Can only be destroyed by letter abilities.', '#4FA4E4'));
letterVisuals.set(Letter.C, new LetterVisual('C', 'Cross', 'Destroys one block in each cardinal direction.', '#99041D'));
letterVisuals.set(Letter.X, new LetterVisual('X', 'X Bomb', 'Destroys one block at each corner.', '#99041D'));
letterVisuals.set(Letter.Y, new LetterVisual('Y', 'Yttrium Bomb', 'We kinda just liked the pattern.', '#99041D'));
letterVisuals.set(Letter.O, new LetterVisual('O', 'O'));
letterVisuals.set(Letter.N, new LetterVisual('N', 'N'));
letterVisuals.set(Letter.E, new LetterVisual('E', 'E'));
letterVisuals.set(Letter.B, new LetterVisual('B', 'B'));
letterVisuals.set(Letter.M, new LetterVisual('M', 'M'));
letterVisuals.set(Letter.Z, new LetterVisual('Z', 'Z'));
letterVisuals.set(Letter.A, new LetterVisual('A', 'A'));
letterVisuals.set(Letter.K, new LetterVisual('K', 'K'));
letterVisuals.set(Letter.S, new LetterVisual('S', 'S'));
letterVisuals.set(Letter.P, new LetterVisual('P', 'P'));
letterVisuals.set(Letter.T, new LetterVisual('T', 'Twist', "Rotate all letters clockwise", '#07a32b'));
letterVisuals.set(Letter.G, new LetterVisual('G', 'G'));

export type LetterFrequencyMap = Map<Letter, number>;


export function getRandomLetter(rand01: number, posX: number, posY: number, frequencyMap: LetterFrequencyMap) {
    let rand = rand01 * 100;
    let sum = 0;
    for (let key of frequencyMap.keys()) {
        sum += frequencyMap.get(key)!;
        if (rand <= sum && isAllowedAtPos(key)) {
            return key;
        }
    }
    return Letter.I;

    function isAllowedAtPos(letter: Letter) {
        return !(
            letter === Letter.T && (
                posX === 0 || posX === maxX - 1 ||
                posY === 0 || posY === maxY - 1
            )
        );
    }
}

export class LetterEntity {
    constructor(
        public letter: Letter,
        public x: number,
        public y: number
    ) { }
}