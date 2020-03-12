import { maxX, maxY } from "./board";

export function handmadeLevel(index: number) {
    const levels = [
        fillSpace(
            '  012   ' +
            'IIIIIIIL'
        ),

        //2
        fillSpace(
            '  012   ' +
            'IIWIIIIL' +
            'RIIIIIII'
        ),

        fillSpace(
            'I0IIIII1' +
            'IDIIIIID' +
            'III2IIII' +
            'RIIIIIII'
        ),

        //4
        fillSpace(
            'I0IIIII1' +
            'IDIIIIID' +
            'IIIIIII2' +
            'IRIIIIII'
        ),

        fillSpace(
            'II01IIII' +
            'WWWWWWWW' +
            'III2IIIW' +
            'IIIDIUIL' +
            'WIUIIIIL'
        ),

        //6
        fillSpace(
            '0IIIIIII' +
            'RIW1IIIW' +
            'DIIDI2II' +
            'IIIIIIII' +
            'WRUIIUIU'
        ),

        fillSpace(
            'IIII0III' +
            'III1I2II' +
            'IIIICIII' +
            'IRIIIIII'
        ),

        //8
        fillSpace(
            'IIIIIIII' +
            '0IILIIII' +
            'RII1IIIW' +
            'IIIDILII' +
            'UIIC2III' +
            'WIUIICII'
        ),

        fillSpace(
            '0IIIIIII' +
            'WW1IIIII' +
            'IIYIIIII' +
            'IICII2II' +
            'IICIIYII' +
            'UIIIIIII'
        ),

        //10
        fillSpace(
            'IIIIIIII' +
            'IIIIIII0' +
            'IIIIIICI' +
            'IIIIIIIY' +
            'R1IIIRCI' +
            'IYID2IIC' +
            'RIUIICWW'
        ),

        //11 (joke level)
        fillSpace(
            'IIII0III' +
            'CCCWWWCC' +
            'IXIXDXII' +
            'IIXIX1XI' +
            'IIIXIXII' +
            'IIXIXWXI' +
            'IX2XIXII' +
            'IIXIXIIL'
        ),

        //12
        fillSpace(
            'III2IIII' +
            'IXIICIRI' +
            'YIIICUII' +
            'WWWWWWWW' +
            'LIII1IIL' +
            'IIIIICIL' +
            'WWWWWWWW' +
            'III0IIIU' +
            'RIIXIIIL'
        ),

        //13
        fillSpace(
            'II2IWYCI' +
            'IIRIIYII' +
            'IIIYIRII' +
            'I1CIILII' +
            'IXIRIWWI' +
            'IILII0II' +
            'IWIRIILI' +
            'IILIIIRI' +
            'IIXIIYII' +
            'IIILIIWW'
        ),

        //14
        fillSpace(
            'IIIIIIII' +
            'III21III' +
            'IR0TLIII' +
            'IIUIIIII'
        ),

        //15
        fillSpace(
            'XDIIUIIY' +
            'WTWILIRI' +
            'I1CTCILI' +
            'CUIYILII' +
            'IRTIYIY2' +
            'WILXWIWI' +
            'WIII0RII' +
            'ILTIWTCI' +
            'IRIXUILI' +
            'XILTIXIW' +
            'IIRIILIU' +
            'RIITIIUI'
        ),
    ]

    if (index >= levels.length) return null;
    return levels[index];
}

function fillSpace(levelString: string) {
    const lines = Math.ceil(levelString.length / maxX);
    return ' '.repeat(maxX * (maxY - lines)) + levelString;
}