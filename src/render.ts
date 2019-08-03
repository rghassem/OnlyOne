import { Letter, gameboard, maxX, maxY, getLetterEntity, letterVisuals, LetterEntity } from "./board";
import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";
import { animate, TweeningFunctions } from "./animation";

const CellWidth = 30;
const CellHeight = 30;
const offset = 250;

export let events: {
    onLetterClick: ((x: number, y: number) => void) | null
} = {
    onLetterClick: null
};

let pixiLetters = new Array<PIXI.Text>();

function getPixiLetter(x: number, y: number) {
    return pixiLetters[x + (maxX * y)];
}

export function initializeLetters(app: PIXI.Application) {
    for (let y = 0; y < maxY; ++y) {
        for (let x = 0; x < maxX; ++x) {
            const entity = getLetterEntity(x, y)!; //guaranteed a letter at every coordinated
            const newLetter = drawLetter(entity.letter, entity.x, entity.y, app);
            pixiLetters.push(newLetter);
        }
    }
}

export function drawBoard(app: PIXI.Application) {
    pixiLetters.forEach(pixiLetter => {
        pixiLetter.text = ' ';
    });
    console.log(gameboard);
    for (const entity of gameboard) {
        const pixiLetter = getPixiLetter(entity.x, entity.y);
        // pixiLetter.x = entity.x * CellWidth;
        // pixiLetter.y = entity.y * CellHeight;
        setStyle(pixiLetter, entity.letter);
    }
}

export async function drawEffects(app: PIXI.Application, effects: Array<BoardEffect>) {
    const promises = new Array<Promise<void>>();
    for (const boardEffect of effects) {
        const letter = getPixiLetter(boardEffect.x, boardEffect.y);

        switch (boardEffect.effect) {
            case BoardEffectType.Destroy:
                letter.text = ' ';
                break;
            case BoardEffectType.Fall:
                const startingY = letter.y;
                const anim = animate(letter, 'y', letter.y + CellHeight, 0.4, TweeningFunctions.easeOutBounce);
                anim.then(() => { letter.y = startingY });
                promises.push(anim);
                break;
            case BoardEffectType.Move:
                const e = boardEffect as MoveEffect;
                letter.x = e.toX * CellWidth;
                letter.y = e.toY * CellHeight;
                break;
        }
    }
    await Promise.all(promises);
}

function drawLetter(letter: Letter, x: number, y: number, app: PIXI.Application) {
    const gridx = offset + x * CellWidth;
    const gridy = y * CellHeight;

    const text = new PIXI.Text(' ');
    setStyle(text, letter);
    text.x = gridx;
    text.y = gridy;

    text.interactive = true;
    text.buttonMode = true;
    text.on('pointerover', () => text.style.fill = '#FF0000')
        .on('pointerout', () => text.style.fill = '#ffffff')
        .on('pointerdown', () => events.onLetterClick && events.onLetterClick(x, y));


    app.stage.addChild(text);
    return text;
}

function setStyle(pixiText: PIXI.Text, letter: Letter) {
    const viz = letterVisuals.get(letter);

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 26,
        fill: viz ? viz.color : '#ffffff',
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

    pixiText.text = viz ? viz.char : ' ';
    pixiText.style = style;
}