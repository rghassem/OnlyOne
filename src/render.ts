import { Letter, rows, cols, getLetter } from "./board";

export function drawLetters(app: PIXI.Application) {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < cols; ++c) {
            const letter = getLetter(r, c);
            const x = r * CellWidth;
            const y = c * CellHeight;
            drawLetter(letterToCharacter(letter), x, y, app);
        }
    }
}

const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 26,
    fill: '#ffffff', // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    // dropShadowColor: '#000000',
    // dropShadowBlur: 4,
    // dropShadowAngle: Math.PI / 6,
    // dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
});

function letterToCharacter(letter: Letter): string {
    switch (letter) {
        case Letter.O: return 'O';
        case Letter.N: return 'N';
        case Letter.E: return 'E';
        case Letter.L: return 'L';
        case Letter.R: return 'R';
        case Letter.U: return 'U';
        case Letter.D: return 'D';
        default: return '-';
    }
}

const CellWidth = 50;
const CellHeight = 50;

function drawLetter(letter: string, x: number, y: number, app: PIXI.Application) {
    const text = new PIXI.Text(letter, style);

    text.x = x;
    text.y = y;

    app.stage.addChild(text);
}