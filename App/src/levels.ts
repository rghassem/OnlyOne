import { maxX, maxY, Gameboard } from "./board";
import { LetterFrequencyMap } from "./letterEntity";
import { LevelTypes } from "./levelTypes";
import { handmadeLevel } from "./handmadeLevels";

export const MaxLevels = 999;
export const LevelSequenceLength = 10;

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

    const handmade = handmadeLevel(level);
    if (handmade) {
        return Gameboard.fromString(handmade, level, LevelTypes.DefaultLetterFrequency);
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