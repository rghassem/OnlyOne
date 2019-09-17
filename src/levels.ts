import { maxX, maxY, Gameboard } from "./board";
import { Letter, LetterFrequencyMap } from "./letterEntity";

const DefaultLetterFrequency = new Map<Letter, number>([
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
]);

const InvisibleHeavy = new Map<Letter, number>([
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
]);

const levels = new Map<number, string>();
levels.set(0, levelOne());
levels.set(1, levelTwo());
levels.set(2, levelThree());
levels.set(3, levelFour());
levels.set(4, levelFive());

export const frequencyChanges: Array<[number, LetterFrequencyMap]> = [
    [0, DefaultLetterFrequency],
    [20, InvisibleHeavy]
]

export function getLevel(level: number) {
    if (levels.has(level)) {
        return Gameboard.fromString(levels.get(level)!, level, DefaultLetterFrequency);
    }
    else {
        let currentRange = frequencyChanges.findIndex(freqPair => freqPair[0] > level) - 1;
        if (currentRange < 0) currentRange = frequencyChanges.length - 1;
        const frequencies = frequencyChanges[currentRange][1];
        return Gameboard.fromSeed(level, frequencies);
    }
}

export function winScreen() {
    return Gameboard.fromString(' '
        .repeat(maxX * Math.floor(maxY / 2))
        + ' WINNER ' +
        ' '.repeat(maxX * Math.floor(maxY / 2)),
        0, DefaultLetterFrequency);
}

export function loseScreen() {
    return Gameboard.fromString(
        ' '.repeat(maxX * Math.floor(maxY / 2))
        + 'TRYAGAIN' +
        ' '.repeat(maxX * Math.floor(maxY / 2)),
        0, DefaultLetterFrequency);
}

function levelOne() {
    return ' '
        .repeat(maxX * (maxY - 2))
        + '  012   '
        + 'IIWIIIIL';
}

function levelTwo() {
    const result = ' '
        .repeat(maxX * (maxY - 6))
        + 'MUSICIBY'
        + 'PERITUNE'
        + 'I2IIIII2'
        + 'IDIIIIID'
        + 'III01III'
        + 'RIIIIIII'

    return result;
}

function levelThree() {
    const result = ' '
        .repeat(maxX * (maxY - 6))
        + 'BY  REZA'
        + 'AND MARK'
        + '0I0IIIII'
        + 'DIW1IIIW'
        + 'IIID2III'
        + 'WIUIICIU';
    return result;
}

function levelFour() {
    const result = ' '
        .repeat(maxX * (maxY - 7))
        + 'IIIIII1I'
        + 'IIIIIII1'
        + 'IIIIIICI'
        + 'IIIIIIIY'
        + 'R0IIIRCI'
        + 'IYID2IIC'
        + 'RIUIICWW';
    return result;
}

function levelFive() {
    const result = ' '
        .repeat(maxX * (maxY - 10))
        + '**0I1I2*'
        + '1IIII0I1'
        + 'III2IICI'
        + '********'
        + '********'
        + '********'
        + '********'
        + '********'
        + '********'
        + '********';
    return result;
}