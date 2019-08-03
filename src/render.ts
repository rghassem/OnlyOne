import { Letter, rows, cols, getLetter, boardIndex } from "./board";
import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";

const CellWidth = 30;
const CellHeight = 30;

export let events: {
    onLetterClick: ((x: number, y: number) => void) | null
} = {
    onLetterClick: null
};

const pixiLetters = new Array<PIXI.Text>();

export function initializeLetters(app: PIXI.Application) {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < cols; ++c) {
            const letter = getLetter(c, r);

            const newLetter = drawLetter(letterToCharacter(letter), r, c, app);
            pixiLetters.push(newLetter);
        }
    }
}

export function drawEffects(app: PIXI.Application, effects: Array<BoardEffect>) {
    console.log("entering drawEffect");
    for (const boardEffect of effects) {
        const index = boardIndex(boardEffect.x, boardEffect.y);
        if (index > pixiLetters.length) {
            console.log(`tried access index (${boardEffect.x}, ${boardEffect.y}) = ${index}`);
        }
        const letter = pixiLetters[index];

        switch (boardEffect.effect) {
            case BoardEffectType.Destroy:
                console.log(`destroy letter ${letter.text}, (${boardEffect.x}, ${boardEffect.y}) = ${index}`);
                letter.text = ' ';
                break;
            case BoardEffectType.Fall:
                letter.y += CellHeight;
                break;
            case BoardEffectType.Move:
                const e = boardEffect as MoveEffect;
                letter.x = e.toX * CellWidth;
                letter.y = e.toY * CellHeight;
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

    const x = col * CellWidth;
    const y = row * CellHeight;

    const text = new PIXI.Text(letter, style);
    text.x = x;
    text.y = y;

    text.interactive = true;
    text.buttonMode = true;
    text.on('pointerover', () => text.style.fill = '#FF0000')
        .on('pointerout', () => text.style.fill = '#ffffff')
        .on('pointerdown', () => events.onLetterClick && events.onLetterClick(col, row));


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
        case Letter.T: return 'T';
        default: return ' ';
    }
}