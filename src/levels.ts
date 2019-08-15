import { maxX, maxY } from "./board";

export const levels = [levelOne, levelTwo, levelThree, levelFour, levelFive];

export function winScreen() {
    return ' '
        .repeat(maxX * Math.floor(maxY / 2))
        + ' WINNER ' +
        ' '.repeat(maxX * Math.floor(maxY / 2))
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
        + 'MUSIC BY'
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