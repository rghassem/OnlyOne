import { Letter, gameboard, maxX, maxY, getLetterEntity, letterVisuals, LetterEntity } from "./board";
import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";
import { animate, TweeningFunctions } from "./animation";
import { letterOScored, letterNScored, letterEScored } from "./gameState";
import { bonusSound, explosionSound, bounceSound } from "./sounds";

export const CellWidth = 35;
export const CellHeight = CellWidth;

export let events: {
    onLetterClick: ((x: number, y: number) => void) | null
} = {
    onLetterClick: null
};

let pixiLetters: Array<PIXI.Text>;
const textO = new PIXI.Text('O');
const textN = new PIXI.Text('N');
const textE = new PIXI.Text('E');

function getPixiLetter(x: number, y: number) {
    return pixiLetters[x + (maxX * y)];
}

export function resetScreen(stage: PIXI.Container) {
    if (pixiLetters) {
        for (const letter of pixiLetters) {
            stage.removeChild(letter);
            letter.destroy();
        }
    }
    pixiLetters = []
    for (let y = 0; y < maxY; ++y) {
        for (let x = 0; x < maxX; ++x) {
            const entity = getLetterEntity(x, y)!; //guaranteed a letter at every coordinated
            const newLetter = drawLetter(entity.letter, entity.x, entity.y, stage);
            pixiLetters.push(newLetter);
        }
    }
    drawScore(stage);
}

export function drawBoard(stage: PIXI.Container) {
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

export async function drawEffects(stage: PIXI.Container, effects: Array<BoardEffect>) {
    const promises = new Array<Promise<void>>();
    let playBounce = false;
    for (const boardEffect of effects) {
        const letter = getPixiLetter(boardEffect.x, boardEffect.y);

        switch (boardEffect.effect) {
            case BoardEffectType.ScoreDestroy:
                updateScoredLetters();
                bonusSound();
            case BoardEffectType.Destroy:
                letter.text = ' ';
                explosionSound();
                await ghettoAssExplosion(stage, boardEffect, 100);
                break;
            case BoardEffectType.Fall:
                const fallEffect = boardEffect as MoveEffect;
                const startingY = letter.y;
                playBounce = true;
                const anim = animate(letter, 'y', fallEffect.toY * CellHeight, 0.4, TweeningFunctions.easeOutBounce);
                anim.then(() => {
                    letter.y = startingY
                });
                promises.push(anim);
                break;
            case BoardEffectType.Move:
                const e = boardEffect as MoveEffect;
                letter.x = e.toX * CellWidth;
                letter.y = e.toY * CellHeight;
                break;
            case BoardEffectType.Score:
        }
    }

    if (playBounce) bounceSound(0.2);
    await Promise.all(promises);
}

function drawScore(stage: PIXI.Container) {


    textO.x = (maxX * CellWidth) / 2 - 32 - 64;
    textO.y = maxY * CellHeight + 10;

    textN.x = (maxX * CellWidth) / 2 - 32;
    textN.y = maxY * CellHeight + 10;

    textE.x = (maxX * CellWidth) / 2 - 32 + 64;
    textE.y = maxY * CellHeight + 10;
    textO.style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 64,
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 5,
        dropShadow: true,
        // dropShadowColor: '#000000',
        // dropShadowBlur: 4,
        // dropShadowAngle: Math.PI / 6,
        // dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    });

    textN.style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 64,
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 5,
        dropShadow: true,
        // dropShadowColor: '#000000',
        // dropShadowBlur: 4,
        // dropShadowAngle: Math.PI / 6,
        // dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    });

    textE.style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 64,
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 5,
        dropShadow: true,
        // dropShadowColor: '#000000',
        // dropShadowBlur: 4,
        // dropShadowAngle: Math.PI / 6,
        // dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    });

    stage.addChild(textO);
    stage.addChild(textN);
    stage.addChild(textE);
}

function updateScoredLetters() {
    if (letterOScored) {
        console.log("O Scored")
        textO.style.fill = '#FFFF00';
        textO.style.stroke = '#4a1850';
    }
    if (letterNScored) {
        console.log("N Scored")
        textN.style.fill = '#FFFF00';
        textN.style.stroke = '#4a1850';
    }
    if (letterEScored) {
        console.log("E Scored")
        textE.style.fill = '#FFFF00';
        textE.style.stroke = '#4a1850';
    }
}

function drawLetter(letter: Letter, x: number, y: number, stage: PIXI.Container) {
    const gridx = x * CellWidth;
    const gridy = y * CellHeight;

    const text = new PIXI.Text(' ');
    setStyle(text, letter);
    text.x = gridx;
    text.y = gridy;

    text.interactive = true;
    text.buttonMode = true;

    const vis = letterVisuals.get(letter)!;

    text.on('pointerover', () => text.style.fill = '#FF0000')
        .on('pointerout', () => text.style.fill = vis.color || '#ffffff')
        .on('pointerdown', () => events.onLetterClick && events.onLetterClick(x, y));

    stage.addChild(text);
    return text;
}

function setStyle(pixiText: PIXI.Text, letter: Letter) {
    const viz = letterVisuals.get(letter);

    const style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 36,
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

async function ghettoAssExplosion(stage: PIXI.Container, boardEffect: BoardEffect, durationMS: number) {
    return new Promise<void>((resolve, reject) => {
        const explosion = new PIXI.Graphics();
        stage.addChild(explosion);
        explosion.x = (boardEffect.x * CellWidth) + CellWidth / 4;
        explosion.y = (boardEffect.y * CellHeight) + CellHeight / 4;
        const time = durationMS;
        let elapsed = 0;
        let previous: number;
        const startingRadius = 0.01;
        const endingRadius = 15;
        const frame = (now: number) => {
            let delta: number
            if (previous) {
                delta = now - previous;
            }
            else {
                delta = 0;
            }
            previous = now;
            elapsed += delta;
            let progress = (elapsed / time);
            const radius = startingRadius + (endingRadius - startingRadius) * progress;
            explosion.clear();
            explosion.beginFill(0xE25822);
            explosion.drawCircle(0, 0, radius);
            explosion.endFill();
            if (elapsed < time) {
                requestAnimationFrame(frame);
            }
            else {
                stage.removeChild(explosion);
                explosion.destroy();
                resolve();
            }
        }
        requestAnimationFrame(frame);
    });
}