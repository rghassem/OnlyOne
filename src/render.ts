import { Letter, rows, cols, getLetter, boardIndex } from "./board";
import { BoardEffect, BoardEffectType } from "./boardEffect";

const CellWidth = 50;
const CellHeight = 50;

export let events: {
    onLetterClick: ((x: number, y: number) => void) | null
} = {
    onLetterClick: null
};

const pixiLetters = new Array<PIXI.Text>();

export function initializeLetters(app: PIXI.Application) {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < cols; ++c) {
            const letter = getLetter(r, c);

            const newLetter = drawLetter(letterToCharacter(letter), r, c, app);
            pixiLetters.push(newLetter);
        }
    }
}

export function drawEffects(app: PIXI.Application, effects: Array<BoardEffect>) {
    for (const boardEffect of effects) {
        switch (boardEffect.effect) {
            case BoardEffectType.Destroy:
                const letter = pixiLetters[boardIndex(boardEffect.x, boardEffect.y)]
                letter.text = ' ';
                break;
        }
    }
}

function drawLetter(letter: string, row: number, col: number, app: PIXI.Application) {

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

    const x = row * CellWidth;
    const y = col * CellHeight;

    const text = new PIXI.Text(letter, style);
    text.x = x;
    text.y = y;

    text.interactive = true;
    text.buttonMode = true;
    text.on('pointerover', () => text.style.fill = '#FF0000')
        .on('pointerout', () => text.style.fill = '#ffffff')
        .on('pointerdown', () => events.onLetterClick && events.onLetterClick(row, col));


    app.stage.addChild(text);
    return text;
}

function letterToCharacter(letter: Letter): string {
    switch (letter) {
        case Letter.O: return 'O';
        case Letter.N: return 'N';
        case Letter.E: return 'E';
        case Letter.L: return 'L';
        case Letter.R: return 'R';
        case Letter.U: return 'U';
        case Letter.D: return 'D';
        default: return ' ';
    }
}