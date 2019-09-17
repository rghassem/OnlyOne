import { onLetterPressed } from "./letters";
import { drawEffects, events, resetScreen, CellHeight, CellWidth, FontFamily, tellUserWhatLetterToClick } from "./render";
import { updateState, checkWin, resetScore, checkLose } from "./gameState";
import { runAnimations, wait, clearAnimations } from "./animation";
import { maxY, maxX, Gameboard } from "./board";
import { makeButton } from "./button";
import { shootSound, bonusSound, bgmusic, blockSound, toggleSound } from "./sounds";
import { winScreen, getLevel, loseScreen } from "./levels";
import { BoardEffectType, BoardEffect } from "./boardEffect";
import { LetterEntity } from "./letterEntity";
import { solve } from "./solver";

declare var FontFaceObserver: any;

const EnableSolver = false;

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();
console.log(`window.devicePixelRatio: ${window.devicePixelRatio}`);

//Letter stage
const letterStage = new PIXI.Container();
app.stage.addChild(letterStage);

//Reset button
let solveButton: PIXI.Graphics;

let muteTexture: PIXI.Texture;
let unmuteTexture: PIXI.Texture;
let resetTexture: PIXI.Texture;
let leftTexture: PIXI.Texture;
let rightTexture: PIXI.Texture;

let muteButton: PIXI.Sprite;
let resetButton: PIXI.Sprite;
let leftButton: PIXI.Sprite;
let rightButton: PIXI.Sprite;

//Initialize renderer stuff
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
(<any>app).renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

function resize(resizeRenderer: boolean = false) {

    if (resizeRenderer) {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    const letterStageWidth = CellWidth * maxX;
    const letterStageHeight = CellHeight * maxY;
    letterStage.x = app.screen.width / 2 - letterStageWidth / 2;
    letterStage.y = app.screen.height / 2 - letterStageHeight / 2;

    const scoreCenterLine = 608;

    if (solveButton) {
        solveButton.x = letterStage.x + 400;
        solveButton.y = letterStage.y + 300;
    }

    if (muteButton) {
        muteButton.x = letterStage.x;
        muteButton.y = letterStage.y + scoreCenterLine;
    }

    if (resetButton) {
        resetButton.x = letterStage.x + 320;
        resetButton.y = letterStage.y + scoreCenterLine;
    }

    if (leftButton) {
        leftButton.x = letterStage.x + 50;
        leftButton.y = letterStage.y + scoreCenterLine;
    }

    if (rightButton) {
        rightButton.x = letterStage.x + 260;
        rightButton.y = letterStage.y + scoreCenterLine;
    }

    const actualWidth = letterStageWidth + 0.15 * letterStageWidth;
    const scaleFactor = app.screen.width / actualWidth;
    if (scaleFactor < 1) {
        const scaleAdjustment = (1 - scaleFactor) / 2;
        app.stage.x = app.screen.width * scaleAdjustment;
        app.stage.y = app.screen.height * scaleAdjustment;
        app.stage.scale.set(scaleFactor);
    }
}

window.onresize = () => {
    resize(true);
}

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

var font = new FontFaceObserver(FontFamily);
font.load(null, 5000).then(function () {
    console.log('Font is available');
    createButtons();
    start();
}, function () {
    console.log('Font is not available after waiting 5 seconds');
});

export let currentLevel = 0;
export let maxLevel = 0;

function initLevel() {
    const queryParams = new URLSearchParams(new URL(document.URL).search);
    const paramLevel = queryParams.get("level");
    const forceLevel = paramLevel && parseInt(paramLevel) ? parseInt(paramLevel) : null;

    currentLevel = forceLevel || Number(window.localStorage.getItem('level')) || 0;
    maxLevel = Number(window.localStorage.getItem('maxLevel')) || 0;
    leftButton.visible = currentLevel > 0;
    rightButton.visible = currentLevel < maxLevel;
}

function decreaseLevel() {
    currentLevel -= 1;
    window.localStorage.setItem('level', '' + currentLevel);
    leftButton.visible = currentLevel > 0;
    rightButton.visible = currentLevel < maxLevel;
}

function advanceLevel() {
    currentLevel += 1;
    window.localStorage.setItem('level', '' + currentLevel);
    leftButton.visible = currentLevel > 0;
    rightButton.visible = currentLevel < maxLevel;
    if (currentLevel > maxLevel) {
        maxLevel = currentLevel;
        window.localStorage.setItem('maxLevel', '' + maxLevel);
    }
}

function createButtons() {
    muteTexture = PIXI.Texture.from('assets/volume-mute-solid.svg');
    unmuteTexture = PIXI.Texture.from('assets/volume-up-solid.svg');
    resetTexture = PIXI.Texture.from('assets/undo-alt-solid.svg');
    rightTexture = PIXI.Texture.from('assets/caret-right-solid.svg');
    leftTexture = PIXI.Texture.from('assets/caret-left-solid.svg');

    muteButton = new PIXI.Sprite(unmuteTexture);
    resetButton = new PIXI.Sprite(resetTexture);
    rightButton = new PIXI.Sprite(rightTexture);
    leftButton = new PIXI.Sprite(leftTexture);

    app.stage.addChild(muteButton);
    app.stage.addChild(resetButton);
    app.stage.addChild(leftButton);
    app.stage.addChild(rightButton);
}

async function start() {
    //Iniitalize letter stage
    let resolving = false;
    let specialScreen = false;

    muteButton.interactive = true;
    muteButton.on("pointerdown", async () => {
        muteButton.texture = toggleSound() ? muteTexture : unmuteTexture;
    });

    resetButton.interactive = true;
    resetButton.on("pointerdown", async () => {
        specialScreen = false;
        shootSound();
        const board = await reset(getLevel(currentLevel));
        gameboard = board;
        resolving = false;
    });

    leftButton.interactive = true;
    leftButton.on("pointerdown", async () => {
        specialScreen = false;
        shootSound();
        decreaseLevel();
        const board = await reset(getLevel(currentLevel));
        gameboard = board;
        resolving = false;
    });

    rightButton.interactive = true;
    rightButton.on("pointerdown", async () => {
        specialScreen = false;
        shootSound();
        advanceLevel();
        const board = await reset(getLevel(currentLevel));
        gameboard = board;
        resolving = false;
    });

    if (EnableSolver) {
        solveButton = makeButton(app.stage, 80, 28, "Solve", async () => {
            resolving = true;
            const result = solve(gameboard);
            while (result.solved && result.solution.moves.length > 0 && !checkWin(gameboard)) {
                const turn = result.solution.moves.shift()!;
                const move = gameboard.getLetterEntity(turn.x, turn.y)
                if (!move) {
                    throw new Error(`Invalid move from AI (${turn.x}, ${turn.y})`);
                }
                await resolveMove(move);
            }
            resolving = false;
        });
    }

    resize();

    //Run animation system
    app.ticker.add(() => {
        runAnimations(app.ticker.elapsedMS / 1000);
    });

    initLevel();

    let gameboard = getLevel(currentLevel); //TODO: Clean up
    gameboard = await reset(getLevel(currentLevel));

    //For the first level, pulse the letter you should click first
    if (currentLevel === 0) {
        tellUserWhatLetterToClick(gameboard, 7, 12);
    }

    events.onLetterClick = (entity: LetterEntity) => {
        if (resolving) return;
        resolving = true;
        resolveMove(entity).then(() => resolving = false);
    }

    async function resolveMove(entity: LetterEntity) {
        let effects = onLetterPressed(gameboard, entity);
        while (effects.length !== 0) {
            await drawEffects(letterStage, gameboard, effects);
            effects = updateState(gameboard, effects);
        }

        if (checkWin(gameboard)) {
            advanceLevel();
            changeLevel(currentLevel);
        } else if (checkLose(gameboard)) {
            playLoseScreen();
        }
    }

    async function playLoseScreen() {
        specialScreen = true;
        gameboard = await reset(loseScreen());
        blockSound();
        await wait(0.1);
        blockSound();
        await wait(0.2);
        blockSound();
        await wait(0.7);
        const destroyWinLetters = gameboard.entities
            .map(entity => {
                if (entity.letter !== undefined)
                    return { entity, effect: BoardEffectType.Destroy }
                else return null;
            })
            .filter(effect => effect !== null) as BoardEffect[];
        if (specialScreen) await drawEffects(letterStage, gameboard, destroyWinLetters);
        if (specialScreen) {
            gameboard = await reset(getLevel(currentLevel));
            specialScreen = false;
        }
    }

    async function changeLevel(level: number) {
        window.localStorage.setItem('currentlevel', '' + level);
        specialScreen = true;
        gameboard = await reset(winScreen());
        bonusSound();
        await wait(0.7);
        bonusSound();
        await wait(0.7);
        const destroyWinLetters = gameboard.entities
            .map(entity => {
                if (entity.letter !== undefined)
                    return { entity, effect: BoardEffectType.Destroy }
                else return null;
            })
            .filter(effect => effect !== null) as BoardEffect[];
        if (level === 1) bgmusic();
        if (specialScreen) {
            if (specialScreen) await drawEffects(letterStage, gameboard, destroyWinLetters);
            gameboard = await reset(getLevel(currentLevel));
            specialScreen = false;
        }
    }

    async function reset(newBoard: Gameboard) {
        clearAnimations();
        resetScore(gameboard);
        await resetScreen(newBoard, letterStage);
        return newBoard;
    }
}