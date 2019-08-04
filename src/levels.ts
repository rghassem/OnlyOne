import { maxX, maxY } from "./board";

export const levels = [levelOne, levelTwo, levelThree, levelFour, levelFive];

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
        + 'IIIWIIIIIL';
}

function levelTwo() {
    const result = ' '
        .repeat(maxX * (maxY - 5))
        + 'IMUSIC BYI'
        + 'IPERITUNEI'
        + 'IIDIIIIIDI'
        + 'IIIIONIIII'
        + 'RIIIIIIIII'

    return result;
}

function levelThree() {
    const result = ' '
        .repeat(maxX * (maxY - 5))
        + 'IIIIIIIIII'
        + 'OIIOIIIIII'
        + 'DIIWNIIIIW'
        + 'IIIIDEIIII'
        + 'WIIUIICIIU';
    return result;
}

function levelFour() {
    const result = ' '
        .repeat(maxX * (maxY - 7))
        + 'IIIIIIINII'
        + 'IIIIIIIINI'
        + 'IIIIIIICII'
        + 'IIIIIIIIYI'
        + 'RIOIIIRCII'
        + 'IIYIDEIIIC'
        + 'RIIUIICWWW';
    return result;
}

function levelFive() {
    const result = ' '
        .repeat(maxX * (maxY - 10))
        + '**OINIE****'
        + 'NIIIIIOIINI'
        + 'IIIEIIICII'
        + '**********'
        + '**********'
        + '**********'
        + '**********'
        + '**********'
        + '**********'
        + '**********';
    return result;
}