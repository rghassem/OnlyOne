import { Letter } from "./letterEntity";

export const LevelTypes = {
    'DefaultLetterFrequency': new Map<Letter, number>([
        [Letter.L, 10],
        [Letter.R, 10],
        [Letter.U, 10],
        [Letter.D, 5],
        [Letter.W, 12],
        [Letter.I, 14],
        [Letter.C, 10],
        [Letter.Y, 10],
        [Letter.X, 9],
        [Letter.T, 10],
    ]),

    "InvisibleHeavy": new Map<Letter, number>([
        [Letter.L, 10],
        [Letter.R, 10],
        [Letter.U, 8],
        [Letter.D, 5],
        [Letter.W, 6],
        [Letter.I, 40],
        [Letter.C, 5],
        [Letter.Y, 4],
        [Letter.X, 4],
        [Letter.T, 8],
    ]),

    "BombHeavy": new Map<Letter, number>([
        [Letter.L, 9],
        [Letter.R, 9],
        [Letter.U, 4],
        [Letter.D, 4],
        [Letter.W, 12],
        [Letter.I, 5],
        [Letter.C, 15],
        [Letter.Y, 15],
        [Letter.X, 15],
        [Letter.T, 12],
    ]),

    "TwistHeavy": new Map<Letter, number>([
        [Letter.L, 5],
        [Letter.R, 5],
        [Letter.U, 5],
        [Letter.D, 5],
        [Letter.W, 10],
        [Letter.I, 9],
        [Letter.C, 8],
        [Letter.Y, 8],
        [Letter.X, 5],
        [Letter.T, 40],
    ])
}