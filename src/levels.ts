import { maxX, maxY, Gameboard } from "./board";
import { LetterFrequencyMap } from "./letterEntity";
import { LevelTypes } from "./levelTypes";

export const MaxLevels = 999;
export const LevelSequenceLength = 10;

const levels = new Map<number, string>();
levels.set(0, levelOne());
levels.set(1, levelTwo());
levels.set(2, levelThree());
levels.set(3, levelFour());
levels.set(4, levelFive());

export interface LevelSequence {
    frequencies: keyof typeof LevelTypes,
    levels: Array<number>
}

//Assume this is declared globally from generated script loaded in index.js
declare var levelSequences: Array<LevelSequence>;


export function getLevel(level: number, forceFrequencyMap?: LetterFrequencyMap) {
    if (forceFrequencyMap) {
        return Gameboard.fromSeed(level, forceFrequencyMap);
    }
    else if (levels.has(level)) {
        return Gameboard.fromString(levels.get(level)!, level, LevelTypes.DefaultLetterFrequency);
    }
    else {
        const sequenceIndex = Math.floor(level / 10);
        const levelInSequence = level - (sequenceIndex * LevelSequenceLength);
        if (sequenceIndex > levelSequences.length) {
            return endScreen();
        }
        const sequence = levelSequences[sequenceIndex];
        if (levelInSequence > sequence.levels.length) {
            return endScreen();
        }
        const seed = sequence.levels[levelInSequence];
        const frequencies = LevelTypes[sequence.frequencies];
        return Gameboard.fromSeed(seed, frequencies);
    }
}

export function endScreen() {
    return Gameboard.fromString(' '
        .repeat(maxX * Math.floor(maxY / 2))
        + ' THE END' +
        ' '.repeat(maxX * Math.floor(maxY / 2)),
        0, LevelTypes.DefaultLetterFrequency);
}

export function winScreen() {
    return Gameboard.fromString(' '
        .repeat(maxX * Math.floor(maxY / 2))
        + ' WINNER ' +
        ' '.repeat(maxX * Math.floor(maxY / 2)),
        0, LevelTypes.DefaultLetterFrequency);
}

export function loseScreen() {
    return Gameboard.fromString(
        ' '.repeat(maxX * Math.floor(maxY / 2))
        + 'TRYAGAIN' +
        ' '.repeat(maxX * Math.floor(maxY / 2)),
        0, LevelTypes.DefaultLetterFrequency);
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