import { maxX, maxY } from "./board";

export const levels = [levelOne, levelTwo];

export function winScreen() {
    return ' '
        .repeat(maxX * Math.floor(maxY / 2))
        + '   WIN   ' +
        ' '.repeat(maxX * Math.floor(maxY / 2))
}

function levelOne() {
    return ' '
        .repeat(maxX * (maxY - 2))
        + '   ONE    '
        + 'RIIWIIIIIL';
}

function levelTwo() {
    const result = ' '
        .repeat(maxX * (maxY - 7))
        + 'IMUSIC BYI'
        + 'IPERITUNEI'
        + 'IIIIIIIIII'
        + 'IIIOIIIIII'
        + 'IIIWNIIIII'
        + 'IIIIDEIIII'
        + 'IIIUIICIII';
    return result;
}