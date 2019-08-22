import { maxX, maxY, Gameboard } from "./board";
import { BoardEffect, BoardEffectType, MoveEffect } from "./boardEffect";
import { animate, TweeningFunctions, wait } from "./animation";
import { bonusSound, explosionSound, bounceSound, blockSound } from "./sounds";
import { currentLevel } from "./main";
import { LetterEntity, letterVisuals, Letter } from "./letterEntity";

export const CellWidth = 45;
export const CellHeight = CellWidth;

export let events: {
    onLetterClick: ((entity: LetterEntity) => void) | null
} = {
    onLetterClick: null
};

let pixiLetters: Map<LetterEntity, PIXI.Text>;
const firstScoreLetter = new PIXI.Text('0');
const secondScoreLetter = new PIXI.Text('1');
const thirdScoreLetter = new PIXI.Text('2');


export async function resetScreen(gameboard: Gameboard, stage: PIXI.Container) {
    if (pixiLetters) {
        for (const letter of pixiLetters.values()) {
            stage.removeChild(letter);
            letter.destroy();
        }
    }
    pixiLetters = new Map();

    const entrances = new Array<Promise<void>>();
    drawScore(stage);
    drawGameboard(gameboard, stage, entrances);
    drawDescription(stage);
    drawTooltip(stage);
    updateTooltip('');
    await Promise.all(entrances);
}

function drawGameboard(gameboard: Gameboard, stage: PIXI.Container, entrances: Promise<void>[]) {
    for (const entity of gameboard) {
        const newLetter = drawLetter(entity, stage);
        newLetter.y -= maxY * CellHeight;
        const duration = 1.5 + ((entity.x / maxX) * 0.2);
        entrances.push(animate(newLetter, 'y', entity.y * CellHeight, duration, TweeningFunctions.easeOutBounce));
        pixiLetters.set(entity, newLetter);
    }
}

export async function drawEffects(stage: PIXI.Container, gameboard: Gameboard, effects: Array<BoardEffect>) {
    const promises = new Array<Promise<void>>();
    let playBounce = false;
    let pauseForEffect = false;
    for (const boardEffect of effects) {
        const letter = pixiLetters.get(boardEffect.entity);
        if (!letter) continue;

        switch (boardEffect.effect) {
            case BoardEffectType.ScoreDestroy:
                updateScoredLetters(gameboard);
                bonusSound();
            case BoardEffectType.Destroy:
                pauseForEffect = true;
                letter.alpha = 0;
                explosionSound();
                await ghettoAssExplosion(stage, boardEffect, 100);
                stage.removeChild(letter);
                break;
            case BoardEffectType.BlockDestruction:
                await pulse(letter);
                break;
            case BoardEffectType.Explode:
                await pulse(letter);
                break;
            case BoardEffectType.Fall:
                playBounce = true;
                const anim = animate(letter, 'y', boardEffect.toY * CellHeight, 0.4, TweeningFunctions.easeOutBounce);
                promises.push(anim);
                break;
            case BoardEffectType.Move:
                const moveY = animate(letter, 'y', boardEffect.toY * CellHeight, 0.4, TweeningFunctions.easeInCubic)
                const moveX = animate(letter, 'x', boardEffect.toX * CellWidth, 0.4, TweeningFunctions.easeInCubic)
                promises.push(moveX, moveY);
                break;

            case BoardEffectType.Transform:
                await pulse(letter);
                updateStyle(letter, boardEffect.changeTo);
                break;

            case BoardEffectType.Score:
                break;
        }
    }

    if (playBounce) bounceSound(0.2);
    await Promise.all(promises);
    if (pauseForEffect) await wait(0.4);
}



function drawScore(stage: PIXI.Container) {

    const scoringLine = new PIXI.Graphics();
    scoringLine.lineStyle(3, 0xffff00);
    scoringLine.moveTo(-CellWidth / 2, 0);
    scoringLine.lineTo(maxX * CellWidth, 0);
    scoringLine.x = 0;
    scoringLine.y = maxY * CellHeight;
    stage.addChild(scoringLine);

    const yPadding = 15;

    const level = currentLevel + 1;
    const hundreds = Math.floor(level / 100) % 10;
    const tens = Math.floor(level / 10) % 10;
    const ones = level % 10;

    firstScoreLetter.text = hundreds.toString();
    secondScoreLetter.text = tens.toString();
    thirdScoreLetter.text = ones.toString();

    firstScoreLetter.x = (maxX * CellWidth) / 2 - 32 - 64;
    firstScoreLetter.y = maxY * CellHeight + yPadding;

    secondScoreLetter.x = (maxX * CellWidth) / 2 - 32;
    secondScoreLetter.y = maxY * CellHeight + yPadding;

    thirdScoreLetter.x = (maxX * CellWidth) / 2 - 32 + 64;
    thirdScoreLetter.y = maxY * CellHeight + yPadding;
    firstScoreLetter.style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 64,
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 440
    });

    secondScoreLetter.style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 64,
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 440
    });

    thirdScoreLetter.style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 64,
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 440
    });

    stage.addChild(firstScoreLetter);
    stage.addChild(secondScoreLetter);
    stage.addChild(thirdScoreLetter);
}

function updateScoredLetters(gameboard: Gameboard) {
    if (gameboard.firstLetterScored) {
        firstScoreLetter.style.fill = '#FFFF00';
        firstScoreLetter.style.stroke = '#4a1850';
    }
    if (gameboard.secondLetterScored) {
        secondScoreLetter.style.fill = '#FFFF00';
        secondScoreLetter.style.stroke = '#4a1850';
    }
    if (gameboard.thirdLetterScored) {
        thirdScoreLetter.style.fill = '#FFFF00';
        thirdScoreLetter.style.stroke = '#4a1850';
    }
}

export const description = new PIXI.Text("* Press a letter\n* Score ONE point \n* Don't destroy ONE ");

function drawDescription(stage: PIXI.Container) {
    description.style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 24,
        fill: '#ffffff',
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 200,
    });

    description.x = 400;
    description.y = 100;

    stage.addChild(description);
}

export const tooltip = new PIXI.Text('');

function drawTooltip(stage: PIXI.Container) {
    tooltip.style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 24,
        fill: '#ffffff',
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 200,
    });

    tooltip.anchor.set(0.5, 0.5);
    tooltip.x = (maxX * CellWidth) / 2;
    tooltip.y = -20;

    stage.addChild(tooltip);
}

function updateTooltip(text: string) {
    tooltip.text = text;
    // tooltip.x = (maxX * CellWidth) / 2 - (text.length * 24) / 12;
}

function drawLetter(entity: LetterEntity, stage: PIXI.Container) {

    const gridx = entity.x * CellWidth;
    const gridy = entity.y * CellHeight;

    const text = new PIXI.Text();
    const style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 52,
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true
    });
    text.style = style;

    updateStyle(text, entity.letter);
    text.x = gridx;
    text.y = gridy;

    text.interactive = true;
    text.buttonMode = true;

    text
        .on('pointerover', () => {
            text.style.fill = '#FF0000';
        })
        .on('pointerout', () => {
            const letter = letterVisuals.get(entity.letter);
            if (!letter) return;
            text.style.fill = letter.color || "#FFFFFF";
        })
        .on('pointerdown', () => {
            events.onLetterClick && events.onLetterClick(entity);
            const letter = letterVisuals.get(entity.letter);
            if (!letter) return;
            updateTooltip(`${letter.name}`);
        });

    stage.addChild(text);
    return text;
}

function updateStyle(pixiText: PIXI.Text, letter: Letter) {
    if (pixiText.alpha === 0) {
        pixiText.alpha = 1;
    }

    const viz = letterVisuals.get(letter);
    if (viz) {
        pixiText.style.fill = viz.color;
        if (viz.char !== pixiText.text) {
            if (letter === Letter.First) {
                pixiText.text = firstScoreLetter.text;
            } else if (letter === Letter.Second) {
                pixiText.text = secondScoreLetter.text;
            } else if (letter === Letter.Third) {
                pixiText.text = thirdScoreLetter.text;
            } else {
                pixiText.text = viz.char;
            }
        }
    }

}

async function pulse(pixiText: PIXI.Text) {
    blockSound();

    pixiText.pivot.set(0.5, 0.5);
    animate(pixiText.scale, 'x', 1.4, 0.1, TweeningFunctions.linear);
    await animate(pixiText.scale, 'y', 1.4, 0.1, TweeningFunctions.linear);

    animate(pixiText.scale, 'x', 1, 0.2, TweeningFunctions.easeOutCubic);
    await animate(pixiText.scale, 'y', 1, 0.2, TweeningFunctions.easeOutCubic);

    pixiText.pivot.set(0, 0);
}

let cachedExplosion: PIXI.Graphics | null = null;

async function ghettoAssExplosion(stage: PIXI.Container, boardEffect: BoardEffect, durationMS: number) {
    return new Promise<void>((resolve, reject) => {
        let explosion: PIXI.Graphics;
        if (cachedExplosion) {
            explosion = cachedExplosion;
            cachedExplosion = null;
        }
        else {
            explosion = new PIXI.Graphics();
        }

        stage.addChild(explosion);
        explosion.x = (boardEffect.entity.x * CellWidth) + CellWidth / 4;
        explosion.y = (boardEffect.entity.y * CellHeight) + CellHeight / 4;
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
                if (!cachedExplosion) {
                    cachedExplosion = explosion
                }
                else {
                    explosion.destroy();
                }
                wait(0.01).then(() => resolve());
            }
        }
        requestAnimationFrame(frame);
    });
}