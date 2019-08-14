import { maxX, maxY } from "./board";

export const levels = [levelOne, levelTwo, levelThree, levelFour, levelFive];

export function winScreen() {
    return ' '
        .repeat(maxX * Math.floor(maxY / 2))
        + '  WINNER  ' +
        ' '.repeat(maxX * Math.floor(maxY / 2))
}

function levelOne() {
    return ' '
        .repeat(maxX * (maxY - 4))
        + 'IIIIIIIIII'
        + '012       '
        + 'IIIWIIIIIL'
        + 'IILIIIIIII';
}

function levelTwo() {
    const result = ' '
        .repeat(maxX * (maxY - 6))
        + 'IMUSIC BYI'
        + 'IPERITUNEI'
        + 'II2IIIII2I'
        + 'IIDIIIIIDI'
        + 'IIII01IIII'
        + 'RIIIIIIIII'

    return result;
}

function levelThree() {
    const result = ' '
        .repeat(maxX * (maxY - 6))
        + 'BY  REZA G'
        + 'AND MARK D'
        + '0II0IIIIII'
        + 'DIIW1IIIIW'
        + 'IIIID2IIII'
        + 'WIIUIICIIU';
    return result;
}

function levelFour() {
    const result = ' '
        .repeat(maxX * (maxY - 7))
        + 'IIIIIII1II'
        + 'IIIIIIII1I'
        + 'IIIIIIICII'
        + 'IIIIIIIIYI'
        + 'RI0IIIRCII'
        + 'IIYID2IIIC'
        + 'RIIUIICWWW';
    return result;
}

function levelFive() {
    const result = ' '
        .repeat(maxX * (maxY - 10))
        + '**0I1I2****'
        + '1IIIII0II1I'
        + 'III2IIICII'
        + '**********'
        + '**********'
        + '**********'
        + '**********'
        + '**********'
        + '**********'
        + '**********';
    return result;
}